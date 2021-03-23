import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Footer from "../Footer";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

import {
  storeStudentLessonQuestionResultAction,
  storeStudentNextExerciseAction,
} from "../../../redux/actions";
import {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentCourseLesson() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const currLesson = useSelector(
    (state) => state.storeCurrentCourseComponentReducer
  );
  const result = useSelector(
    (state) => state.storeStudentLessonQuestionResultReducer
  );
  const course = useSelector((state) => state.storeStudentSingleCourseReducer);

  // GET
  const getNextExercise = () => {
    courses_Collection
      .doc(course.id)
      .collection("Exercises")
      .get()
      .then((snapshot) => {
        const exerData = firebaseLooper(snapshot);
        exerData.forEach((exer) => {
          if (exer.Order === currLesson.Order) {
            dispatch(storeStudentNextExerciseAction(exer));
          }
        });
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleLessonUI = () => {
    return (
      <div>
        <div>
          <h2>Video is here...</h2>
        </div>
        <div>
          <h2>Textual Lesson</h2>
          <p>{currLesson.Text}</p>
        </div>
        <div>{handleLessonQuestion()}</div>
        <div>{handleResult()}</div>
      </div>
    );
  };
  const handleLessonQuestion = () => {
    if (currLesson.Text) {
      return (
        <div>
          <h3>{currLesson.Question}</h3>
          <div>
            {currLesson.Options.map((opt, i) => {
              return (
                <div>
                  <input
                    type="radio"
                    id={`Opt${i}`}
                    name="lessonOpts"
                    value={opt}
                  />
                  <label for={opt}>{opt}</label>
                </div>
              );
            })}
          </div>
          <br />
          <div>
            <button onClick={calcQuestionResult}>Check</button>
          </div>
          <br />
        </div>
      );
    }
  };
  const handleResult = () => {
    if (result === "correct") {
      return (
        <div>
          <p>That is correct!</p>
          <button onClick={navExercise}>Finish</button>
        </div>
      );
    } else if (result === "incorrect") {
      return (
        <div>
          <p>Incorrect. Try Again.</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>Answer question correctly before completing lesson.</p>
        </div>
      );
    }
  };

  // NAV
  const navExercise = () => {
    getNextExercise();
    dispatch(storeStudentLessonQuestionResultAction(""));

    const rand1 = RandomString();
    const rand2 = RandomString();
    const progID = `Prog${rand1}${rand2}`;

    // Update Course Progress
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .doc(progID)
      .set({
        CourseName: course.Name,
        CompName: currLesson.Name,
        CompType: "Lesson",
        Order: currLesson.Order,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    history.push("/student-course-exercise");
  };

  //   CALC
  const calcQuestionResult = () => {
    const answer = currLesson.Answer;

    for (let i = 0; i < currLesson.Options.length; i = i + 1) {
      const radioChoice = document.querySelector(`#Opt${i}`).checked;
      if (radioChoice) {
        if (currLesson.Options[i] === answer) {
          dispatch(storeStudentLessonQuestionResultAction("correct"));
        } else {
          dispatch(storeStudentLessonQuestionResultAction("incorrect"));
        }
      }
    }
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);
  return (
    <div>
      <br />
      <div>
        <h1>{currLesson.Name}</h1>
      </div>

      <div>{handleLessonUI()}</div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
