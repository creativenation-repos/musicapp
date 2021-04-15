import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentQuizResultsAction,
  toggleStudentQuizResultsAction,
  storeCurrentCourseComponentAction,
  storeStudentNextLessonAction,
} from "../../../redux/actions";
import {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

import Footer from "../Footer";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function StudentCourseQuiz() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   State
  const toggleQuizResults = useSelector(
    (state) => state.toggleStudentQuizResultsReducer
  );

  const course = useSelector((state) => state.storeStudentSingleCourseReducer);

  const quiz = useSelector((state) => state.storeStudentNextQuizReducer);
  const results = useSelector((state) => state.storeStudentQuizResultsReducer);

  //   HANDLE
  const handleQuizComponents = () => {
    if (quiz.Components) {
      return (
        <div>
          {quiz.Components.map((q, i) => {
            if (q.Type === "multiple") {
              return (
                <div key={i}>
                  <h3>{q.Question}</h3>
                  {q.Options.map((opt, a) => {
                    return (
                      <div>
                        <input
                          type="radio"
                          id={`comp${i}Opt${a}`}
                          name={`comp${i}`}
                          value={opt}
                        />
                        <label>{opt}</label>
                        <br />
                      </div>
                    );
                  })}
                </div>
              );
            } else if (q.Type === "short") {
              return (
                <div key={i}>
                  <h3>{q.Text}</h3>
                  <p>Please type your response below:</p>
                  <textarea id={`taShortRes${i}`}></textarea>
                </div>
              );
            } else if (q.Type === "long") {
              return (
                <div key={i}>
                  <h3>{q.Text}</h3>
                  <p>Please type your response below:</p>
                  <textarea id={`taLongRes${i}`}></textarea>
                </div>
              );
            } else if (q.Type === "boolean") {
              return (
                <div key={i}>
                  <h3>{q.Statement}</h3>
                  <input
                    type="radio"
                    id={`raTrue${i}`}
                    name={`raBool${i}`}
                    value="true"
                  />
                  <label>True</label>
                  <br />
                  <input
                    type="radio"
                    id={`raFalse${i}`}
                    name={`raBool${i}`}
                    value="false"
                  />
                  <label>False</label>
                  <br />
                </div>
              );
            }
          })}
          <br />
          <button onClick={calcResults}>Submit</button>
        </div>
      );
    }
  };
  const handleResults = () => {
    //   Display results
    return (
      <div>
        {results.map((re, i) => {
          if (re.Type === "multiple") {
            return (
              <div key={i}>
                <h3>
                  {i + 1}. {quiz.Components[i].Question}
                </h3>
                <p>Your Answer: {re.Given}</p>
                <p>Correct Answer: {re.Answer}</p>
              </div>
            );
          } else if (re.Type === "short") {
            return (
              <div key={i}>
                <h3>
                  {i + 1}. {quiz.Components[i].Text}
                </h3>
                <p>Your Answer: {re.Given}</p>
                <p>Correct Answer: {re.Answer}</p>
              </div>
            );
          } else if (re.Type === "long") {
            return (
              <div key={i}>
                <h3>
                  {i + 1}. {quiz.Components[i].Text}
                </h3>
                <p>Your Answer: {re.Given}</p>
                <p>Correct Answer: {re.Answer}</p>
              </div>
            );
          } else if (re.Type === "boolean") {
            return (
              <div key={i}>
                <h3>
                  {i + 1}. {quiz.Components[i].Statement}
                </h3>
                <p>Your Answer: {re.Given}</p>
                <p>Correct Answer: {re.Answer}</p>
              </div>
            );
          }
        })}
        <br />
        <button onClick={navLesson}>Finish</button>
      </div>
    );
  };

  //   CALC
  const calcResults = () => {
    let results = [];
    quiz.Components.forEach((comp, i) => {
      if (comp.Type === "multiple") {
        const compLength = comp.Options.length;
        const answer = comp.Answer;

        for (let a = 0; a < compLength; a = a + 1) {
          const radioChecked = document.querySelector(`#comp${i}Opt${a}`)
            .checked;
          const radioValue = document.querySelector(`#comp${i}Opt${a}`).value;

          if (radioChecked) {
            //   Insert into results
            let thing = "";
            if (answer === radioValue) {
              thing = "Correct";
            } else {
              thing = "Incorrect";
            }
            results.push({
              Answer: answer,
              Given: radioValue,
              Result: thing,
              Type: "multiple",
            });
          }
        }
      } else if (comp.Type === "short") {
        const answer = comp.Answer;
        const shortRes = document.querySelector(`#taShortRes${i}`).value;

        results.push({
          Answer: answer,
          Given: shortRes,
          Result: 'Pending',
          Type: "short",
        });
      } else if (comp.Type === "long") {
        const answer = comp.Answer;
        const longRes = document.querySelector(`#taLongRes${i}`).value;

        results.push({
          Answer: answer,
          Given: longRes,
          Result: 'Pending',
          Type: "long",
        });
      } else if (comp.Type === "boolean") {
        const answer = comp.Answer;
        const trueRes = document.querySelector(`#raTrue${i}`).checked;
        const falseRes = document.querySelector(`#raFalse${i}`).checked;

        if (trueRes) {
          if (answer === "true") {
            // Correct
            results.push({
              Answer: answer,
              Given: "true",
              Result: "Correct",
              Type: "boolean",
            });
          } else {
            // Incorrect
            results.push({
              Answer: answer,
              Given: "true",
              Result: "Incorrect",
              Type: "boolean",
            });
          }
        } else if (falseRes) {
          if (answer === "false") {
            // Correct
            results.push({
              Answer: answer,
              Given: "false",
              Result: "Correct",
              Type: "boolean",
            });
          } else {
            // Incorrect
            results.push({
              Answer: answer,
              Given: "false",
              Result: "Incorrect",
              Type: "boolean",
            });
          }
        }
      }
    });

  

    // Save results in DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const quizID = `Quiz${rand1}${rand2}`;
    results.forEach((result) => {
      const rand3 = RandomString();
      const rand4 = RandomString();
      const resultID = `Result${rand3}${rand4}`;

      students_Collection
        .doc(studentAuthID)
        .collection("Quizzes")
        .doc(quizID)
        .collection("Results")
        .doc(resultID)
        .set({
          Answer: result.Answer,
          Given: result.Given,
          Result: result.Result,
        })
        .catch((err) => console.log(err));
    });


      // Calculate Results
      dispatch(toggleStudentQuizResultsAction());
      dispatch(storeStudentQuizResultsAction(results));
  };

  //   NAV
  const navLesson = () => {
    const nextOrder = quiz.Order + 1;

    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .get()
      .then((snapshot) => {
        const lessonsList = firebaseLooper(snapshot);
        lessonsList.forEach((less) => {
          if (less.Order === nextOrder) {
            dispatch(storeCurrentCourseComponentAction(less));
            dispatch(storeStudentNextLessonAction(less));
          }
        });
      })
      .catch((err) => console.log(err));

    //   Save progress to DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const progID = `Prog${rand1}${rand2}`;

    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .doc(progID)
      .set({
        CompName: quiz.Name,
        CompType: "Quiz",
        CourseName: course.Name,
        Date: GetToday(),
        Order: quiz.Order,
      })
      .catch((err) => console.log(err));

    // Navigate to Lesson
    history.push("/student-course-lesson");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);
  return (
    <div>
      <div>
        <h1>{quiz.Name}</h1>
      </div>

      <hr />
      <div>{toggleQuizResults ? handleResults() : handleQuizComponents()}</div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
