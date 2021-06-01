import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentSingleCourseQuizComponentsAction,
  storeStudentTimeAction,
  storeStudentQuizFinalResultsAction,
  storeStudentCourseProgressAction,
} from "../../../redux/actions";
import {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import TopBar from "../TopBar";
import Footer from "../Footer";
import firebase from "../../../utils/firebase";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function StudentCourseQuiz() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const seconds = useSelector((state) => state.storeStudentTimeReducer);
  const course = useSelector((state) => state.storeStudentSingleCourseReducer);
  const quiz = useSelector(
    (state) => state.storeStudentSingleCourseQuizReducer
  );
  const components = useSelector(
    (state) => state.storeStudentSingleCourseQuizComponentsReducer
  );
  const progress = useSelector(
    (state) => state.storeStudentCourseProgressReducer
  );

  //   GET
  const getAllComponents = () => {
    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .doc(quiz.id)
      .collection("Components")
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const compsData = firebaseLooper(snapshot);
        dispatch(storeStudentSingleCourseQuizComponentsAction(compsData));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleQuizCompnents = () => {
    return components.map((comp, i) => {
      if (comp.Type === "multiple") {
        return (
          <div className="studCompBlock purple-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Question}
            </h3>
            {handleOptions(comp.Options, i)}
            <br />
          </div>
        );
      } else if (comp.Type === "short") {
        return (
          <div className="studCompBlock red-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Prompt}
            </h3>
            <input
              className="tbShort"
              id={`tbShort${i}`}
              type="text"
              placeholder="Type Answer Here..."
            />
          </div>
        );
      } else if (comp.Type === "long") {
        return (
          <div className="studCompBlock yellow-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Prompt}
            </h3>
            <textarea
              className="taLong"
              id={`taLong${i}`}
              placeholder="Type Answer Here..."
            ></textarea>
          </div>
        );
      } else if (comp.Type === "trueFalse") {
        return (
          <div className="studCompBlock aqua-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Prompt}
            </h3>
            <div className="raFlex">
              <input
                type="radio"
                id={`raTrue${i}`}
                name={`raTrueFalse${i}`}
                value="True"
              />
              <label>True</label>
            </div>
            <div className="raFlex">
              <input
                type="radio"
                id={`raFalse${i}`}
                name={`raTrueFalse${i}`}
                value="False"
              />
              <label>False</label>
            </div>
          </div>
        );
      } else if (comp.Type === "audio") {
        return (
          <div className="studCompBlock orange-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Question}
            </h3>
            <audio className="quizAudio" id={`audio${i}`} controls>
              <source type="audio/mpeg" />
            </audio>

            {handleOptions(comp.Options, i)}
          </div>
        );
      } else if (comp.Type === "video") {
        return (
          <div className="studCompBlock pink-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Question}
            </h3>
            <video
              className="quizVideo"
              controls="true"
              id={`video${i}`}
            ></video>
            {handleOptions(comp.Options, i)}
          </div>
        );
      } else if (comp.Type === "image") {
        return (
          <div className="studCompBlock green-border" key={i}>
            <h3 className="compHead">
              {i + 1}. {comp.Question}
            </h3>
            <img className="quizImg" id={`image${i}`} alt="" />
            {handleOptions(comp.Options, i)}
          </div>
        );
      }
    });
  };
  const handleOptions = (opts, i) => {
    return opts.map((opt, a) => {
      return (
        <div className="compOpts" key={i}>
          <input
            type="radio"
            id={`raOpt${i}-${a}`}
            name={`raOpts${i}`}
            value={opt}
          />
          <label>{opt}</label>
        </div>
      );
    });
  };
  const handleMediaComps = () => {
    components.forEach((comp, i) => {
      if (comp.Type === "audio") {
        var storage = firebase.storage();
        var storageRef = storage.ref(`Audio/`);
        //urll is the url for image

        storageRef
          .child(comp.Audio)
          .getDownloadURL()
          .then(function (url) {
            // Or inserted into an <img> element:
            let audio = document.querySelector(`#audio${i}`);
            audio.src = url;
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "video") {
        var storage = firebase.storage();
        var storageRef = storage.ref(`Videos/`);
        //urll is the url for image
        storageRef
          .child(comp.Video)
          .getDownloadURL()
          .then(function (url) {
            // Or inserted into an <img> element:
            let audio = document.getElementById(`video${i}`);
            audio.src = url;
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "image") {
        var storage = firebase.storage();
        var storageRef = storage.ref(`Images/`);
        //urll is the url for image
        storageRef
          .child(comp.Image)
          .getDownloadURL()
          .then(function (url) {
            // Or inserted into an <img> element:
            let audio = document.getElementById(`image${i}`);
            audio.src = url;
          })
          .catch((err) => console.log(err));
      }
    });
  };

  //   POST
  const finishQuiz = () => {
    // Get all data here
    let allResults = [];
    components.forEach((comp, i) => {
      if (comp.Type === "multiple") {
        comp.Options.forEach((opt, a) => {
          const optChecked = document.querySelector(`#raOpt${i}-${a}`).checked;
          const optGiven = document.querySelector(`#raOpt${i}-${a}`).value;
          if (optChecked === true) {
            const answer = comp.Answer;
            if (answer === optGiven) {
              allResults.push({
                Type: "multiple",
                Answer: answer,
                Given: optGiven,
                Result: "Correct",
                Points: comp.Points,
                Earned: comp.Points,
              });
            } else {
              allResults.push({
                Type: "multiple",
                Answer: answer,
                Given: optGiven,
                Result: "Incorrect",
                Points: comp.Points,
                Earned: "0",
              });
            }
          }
        });
      } else if (comp.Type === "short") {
        const tbShort = document
          .querySelector(`#tbShort${i}`)
          .value.toLowerCase();
        const answer = comp.Answer.toLowerCase();

        if (tbShort === answer) {
          allResults.push({
            Type: "short",
            Answer: answer,
            Given: tbShort,
            Result: "Correct",
            Points: comp.Points,
            Earned: comp.Points,
          });
        } else {
          allResults.push({
            Type: "short",
            Answer: answer,
            Given: tbShort,
            Result: "Incorrect",
            Points: comp.Points,
            Earned: "0",
          });
        }
      } else if (comp.Type === "long") {
        const tbLong = document
          .querySelector(`#taLong${i}`)
          .value.toLowerCase();
        const answer = comp.Answer.toLowerCase();

        if (tbLong === answer) {
          allResults.push({
            Type: "long",
            Answer: answer,
            Given: tbLong,
            Result: "Pending",
            Points: comp.Points,
            Earned: "0",
          });
        } else {
          allResults.push({
            Type: "long",
            Answer: answer,
            Given: tbLong,
            Result: "Pending",
            Points: comp.Points,
            Earned: "0",
          });
        }
      } else if (comp.Type === "trueFalse") {
        const raTrue = document.querySelector(`#raTrue${i}`).checked;
        const raFalse = document.querySelector(`#raFalse${i}`).checked;
        const answer = comp.Answer;

        if (raTrue === true) {
          // Student picked true
          if (answer === true) {
            allResults.push({
              Type: "trueFalse",
              Answer: answer,
              Given: true,
              Result: "Correct",
              Points: comp.Points,
              Earned: comp.Points,
            });
          } else {
            // Wrong
            allResults.push({
              Type: "trueFalse",
              Answer: answer,
              Given: true,
              Result: "Incorrect",
              Points: comp.Points,
              Earned: "0",
            });
          }
        } else {
          // Student picked false
          if (answer === false) {
            allResults.push({
              Type: "trueFalse",
              Answer: answer,
              Given: false,
              Result: "Correct",
              Points: comp.Points,
              Earned: comp.Points,
            });
          } else {
            // Wrong
            allResults.push({
              Type: "trueFalse",
              Answer: answer,
              Given: false,
              Result: "Incorrect",
              Points: comp.Points,
              Earned: "0",
            });
          }
        }
      } else if (comp.Type === "audio") {
        comp.Options.forEach((opt, j) => {
          const optChecked = document.querySelector(`#raOpt${i}-${j}`).checked;
          const optGiven = document.querySelector(`#raOpt${i}-${j}`).value;
          if (optChecked === true) {
            const answer = comp.Answer;
            if (answer === optGiven) {
              allResults.push({
                Type: "audio",
                Answer: answer,
                Given: optGiven,
                Result: "Correct",
                Points: comp.Points,
                Earned: comp.Points,
              });
            } else {
              allResults.push({
                Type: "audio",
                Answer: answer,
                Given: optGiven,
                Result: "Incorrect",
                Points: comp.Points,
                Earned: "0",
              });
            }
          }
        });
      } else if (comp.Type === "video") {
        comp.Options.forEach((opt, j) => {
          const optChecked = document.querySelector(`#raOpt${i}-${j}`).checked;
          const optGiven = document.querySelector(`#raOpt${i}-${j}`).value;
          if (optChecked === true) {
            const answer = comp.Answer;
            if (answer === optGiven) {
              allResults.push({
                Type: "video",
                Answer: answer,
                Given: optGiven,
                Result: "Correct",
                Points: comp.Points,
                Earned: comp.Points,
              });
            } else {
              allResults.push({
                Type: "video",
                Answer: answer,
                Given: optGiven,
                Result: "Incorrect",
                Points: comp.Points,
                Earned: "0",
              });
            }
          }
        });
      } else if (comp.Type === "image") {
        comp.Options.forEach((opt, j) => {
          const optChecked = document.querySelector(`#raOpt${i}-${j}`).checked;
          const optGiven = document.querySelector(`#raOpt${i}-${j}`).value;
          if (optChecked === true) {
            const answer = comp.Answer;
            if (answer === optGiven) {
              allResults.push({
                Type: "image",
                Answer: answer,
                Given: optGiven,
                Result: "Correct",
                Points: comp.Points,
                Earned: comp.Points,
              });
            } else {
              allResults.push({
                Type: "image",
                Answer: answer,
                Given: optGiven,
                Result: "Incorrect",
                Points: comp.Points,
                Earned: "0",
              });
            }
          }
        });
      }
    });

    // Save to DB
    const courseName = course.Name;
    const quizName = quiz.Name;
    const results = [...allResults];

    const rand1 = RandomString();
    const rand2 = RandomString();
    const resID = `Res${rand1}${rand2}`;

    // Result Data
    students_Collection
      .doc(studentAuthID)
      .collection("QuizResults")
      .doc(resID)
      .set({
        CourseName: courseName,
        QuizName: quizName,
      })
      .catch((err) => console.log(err));

    // Result Objs Data
    results.forEach((res) => {
      const rand3 = RandomString();
      const rand4 = RandomString();
      const resultID = `ResObj${rand3}${rand4}`;

      if (res.Type === "multiple") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "multiple",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "short") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "short",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "long") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "long",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "trueFalse") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "trueFalse",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "audio") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "audio",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "video") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "video",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      } else if (res.Type === "image") {
        students_Collection
          .doc(studentAuthID)
          .collection("QuizResults")
          .doc(resID)
          .collection("Results")
          .doc(resultID)
          .set({
            Type: "image",
            Answer: res.Answer,
            Given: res.Given,
            Result: res.Result,
            Points: res.Points,
            Earned: res.Earned,
          })
          .catch((err) => console.log(err));
      }
    });

    const rand5 = RandomString();
    const rand6 = RandomString();
    const progID = `Prog${rand5}${rand6}`;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .doc(progID)
      .set({
        Type: "quiz",
        Name: quiz.Name,
        CourseID: course.id,
        Order: quiz.Order,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allProg = [...progress];
    allProg.push({
      id: progID,
      Type: "quiz",
      Name: quiz.Name,
      CourseID: course.id,
      Order: quiz.Order,
      Date: GetToday(),
    });

    dispatch(storeStudentCourseProgressAction(allProg));

    // Dispatch
    const tempObj = {
      CourseName: courseName,
      QuizName: quizName,
      Results: results,
    };

    dispatch(storeStudentQuizFinalResultsAction(tempObj));
    history.push("/student-course-quiz-results");

    // END
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllComponents();
    handleMediaComps();
  }, [quiz]);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>{quiz.Name}</h1>

        {handleQuizCompnents()}

        <button onClick={finishQuiz} className="btnFinishQuiz">
          Finish
        </button>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
