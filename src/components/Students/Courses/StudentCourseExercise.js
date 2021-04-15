import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

import Footer from "../Footer";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";
import { storeStudentNextQuizAction } from "../../../redux/actions";

export default function StudentCourseExercise() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const currExer = useSelector(
    (state) => state.storeStudentNextExerciseReducer
  );
  const course = useSelector((state) => state.storeStudentSingleCourseReducer);

  //   HANDLE
  const handleExercise = () => {
    if (currExer.Type === "textual") {
      return (
        <div>
          <div>
            <p>{currExer.Text}</p>
          </div>

          <div>
            <textarea id="taTextualResponse" placeholder="Response"></textarea>
          </div>
          <div>
            <button onClick={navQuiz}>Finish</button>
          </div>
        </div>
      );
    }
  };

  // NAV
  const navQuiz = () => {
    // First, store their response to DB. No need to dispatch
    const textRes = document.querySelector("#taTextualResponse").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const exerResID = `ExerRes${rand1}${rand2}`;

    students_Collection
      .doc(studentAuthID)
      .collection("Exercises")
      .doc(exerResID)
      .set({
        Course: course.Name,
        Response: textRes,
        Order: currExer.Order,
        Name: currExer.Name,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    // Store in CourseProgress
    const rand3 = RandomString();
    const rand4 = RandomString();
    const progID = `Prog${rand3}${rand4}`;

    // Update Course Progress
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .doc(progID)
      .set({
        CourseName: course.Name,
        CompName: currExer.Name,
        CompType: "Exercise",
        Order: currExer.Order,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    // Get Next Quiz
    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .get()
      .then((snapshot) => {
        const quizData = firebaseLooper(snapshot);
        quizData.forEach((quiz) => {
          if (quiz.Order === currExer.Order) {
            courses_Collection
              .doc(course.id)
              .collection("Quizzes")
              .doc(quiz.id)
              .collection("Components")
              .get()
              .then((snapshot) => {
                const compData = firebaseLooper(snapshot);

                const quizObj = {
                  ...quiz,
                  Components: compData,
                };

                dispatch(storeStudentNextQuizAction(quizObj));
              })
              .catch((err) => console.log(err));
          }
        });
      })
      .catch((err) => console.log(err));

    history.push("/student-course-quiz");
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
        <h1>{currExer.Name}</h1>
      </div>

      {/* Content */}
      <div>{handleExercise()}</div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
