import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import {
  storeStudentCourseLessonListAction,
  toggleStudentCourseExerListAction,
  toggleStudentCourseLessonListAction,
  storeStudentCourseExerListAction,
  storeStudentCourseQuizListAction,
  toggleStudentCourseQuizListAction,
  storeCurrentCourseComponentAction,
  storeStudentNextExerciseAction,
  storeStudentNextQuizAction,
} from "../../../redux/actions";
import {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentCoursePreview() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   Toggles
  const toggleLessonList = useSelector(
    (state) => state.toggleStudentCourseLessonListReducer
  );
  const toggleExerList = useSelector(
    (state) => state.toggleStudentCourseExerListReducer
  );
  const toggleQuizList = useSelector(
    (state) => state.toggleStudentCourseQuizListReducer
  );

  const course = useSelector((state) => state.storeStudentSingleCourseReducer);
  const lessons = useSelector(
    (state) => state.storeStudentCourseLessonListReducer
  );
  const currComp = useSelector(
    (state) => state.storeCurrentCourseComponentReducer
  );
  const exers = useSelector((state) => state.storeStudentCourseExerListReducer);
  const quizzes = useSelector(
    (state) => state.storeStudentCourseQuizListReducer
  );

  // GET
  const getAllCourseLessons = () => {
    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const lessonsList = firebaseLooper(snapshot);
        dispatch(storeStudentCourseLessonListAction(lessonsList));
      })
      .catch((err) => console.log(err));
  };
  const getAllCourseExercises = () => {
    courses_Collection
      .doc(course.id)
      .collection("Exercises")
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const exerList = firebaseLooper(snapshot);

        dispatch(storeStudentCourseExerListAction(exerList));
      })
      .catch((err) => console.log(err));
  };
  const getAllCourseQuizzes = () => {
    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const quizList = firebaseLooper(snapshot);

        dispatch(storeStudentCourseQuizListAction(quizList));
      })
      .catch((err) => console.log(err));
  };
  const getStudentProgress = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .where("CourseName", "==", course.Name)
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const progressData = firebaseLooper(snapshot);
        let progress = [];
        progressData.forEach((prog) => {
          if (prog.CourseName === course.Name) {
            progress.push(prog);
          }
        });

        // If there is data
        if (progress.length > 0) {
          const lastComp = progress[0];

          if (lastComp.CompType === "Lesson") {
            // get next exer
            courses_Collection
              .doc(course.id)
              .collection("Exercises")
              .where("Order", "==", lastComp.Order)
              .get()
              .then((snapshot) => {
                const exerData = firebaseLooper(snapshot);
                dispatch(storeCurrentCourseComponentAction(exerData[0]));
                dispatch(storeStudentNextExerciseAction(exerData[0]));
              })
              .catch((err) => console.log(err));
          } else if (lastComp.CompType === "Exercise") {
            courses_Collection
              .doc(course.id)
              .collection("Quizzes")
              .where("Order", "==", lastComp.Order)
              .get()
              .then((snapshot) => {
                const quizData = firebaseLooper(snapshot);
                courses_Collection
                  .doc(course.id)
                  .collection("Quizzes")
                  .doc(quizData[0].id)
                  .collection("Components")
                  .get()
                  .then((snapshot) => {
                    const compData = firebaseLooper(snapshot);
                    const tempObj = {
                      ...quizData[0],
                      Components: compData,
                    };
                    dispatch(storeCurrentCourseComponentAction(tempObj));
                    dispatch(storeStudentNextQuizAction(tempObj));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          } else if (lastComp.CompType === "Quiz") {
            courses_Collection
              .doc(course.id)
              .collection("Lessons")
              .where("Order", "==", lastComp.Order + 1)
              .get()
              .then((snapshot) => {
                const lessonData = firebaseLooper(snapshot);
                dispatch(storeCurrentCourseComponentAction(lessonData[0]));
                dispatch(storeStudentNextExerciseAction(lessonData[0]));
              })
              .catch((err) => console.log(err));
          }
          // Here, the user should get the latest progress block and assess what comes next. That way the Start button can be added to the appropriate component.Consider the order.
        } else {
          courses_Collection
            .doc(course.id)
            .collection("Lessons")
            .where("Order", "==", 1)
            .get()
            .then((snapshot) => {
              const lessonData = firebaseLooper(snapshot);
              dispatch(storeCurrentCourseComponentAction(lessonData[0]));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleLessonList = () => {
    return lessons.map((lesson, i) => {
      return (
        <div key={i}>
          <p>{lesson.Name}</p>
          {currComp.Name === lesson.Name ? (
            <button
              style={{
                backgroundColor: "#54e346",
                color: "white",
                border: "1px solid rgba(0,0,0,0.2)",
                padding: "1%",
                width: "20%",
                borderRadius: '3px'
              }}
              onClick={navCourseLesson}
            >
              Start
            </button>
          ) : null}
        </div>
      );
    });
  };
  const handleExerList = () => {
    return exers.map((exer, i) => {
      return (
        <div key={i}>
          <p>{exer.Name}</p>
          {currComp.Name === exer.Name ? (
            <button onClick={navCourseExercise}>Start</button>
          ) : null}
        </div>
      );
    });
  };
  const handleQuizList = () => {
    return quizzes.map((quiz, i) => {
      return (
        <div key={i}>
          <p>{quiz.Name}</p>
          {currComp.Name === quiz.Name ? (
            <button onClick={navCourseQuiz}>Start</button>
          ) : null}
        </div>
      );
    });
  };

  // NAV
  const navCourseLesson = () => {
    // We are assuming that the lesson is already in dispatch

    history.push("/student-course-lesson");
  };
  const navCourseExercise = () => {
    history.push("/student-course-exercise");
  };
  const navCourseQuiz = () => {
    history.push("/student-course-quiz");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllCourseLessons();
    getAllCourseExercises();
    getAllCourseQuizzes();
    getStudentProgress();
  }, []);

  return (
    <div>
      {/* TopBar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        {/* Left */}
        <div style={{ width: "48%", float: "left", padding: "1%" }}>
          <h1>{course.Name}</h1>
          <img
            src="/Images/course-thumbnail.jpg"
            alt=""
            style={{ width: "400px", height: "auto" }}
          />
          <p>{course.Desc}</p>
        </div>

        {/* Right */}
        <div style={{ width: "48%", float: "right", padding: "1%" }}>
          <h2>Components</h2>

          {/* Lessons */}
          <div>
            <button
              style={{
                width: "100%",
                textAlign: "left",
                padding: "2%",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "3px",
              }}
              onClick={() => dispatch(toggleStudentCourseLessonListAction())}
            >
              Lessons
            </button>
            <div>{toggleLessonList ? handleLessonList() : null}</div>
          </div>
          <br />
          {/* Exercises */}
          <div>
            <button
              style={{
                width: "100%",
                textAlign: "left",
                padding: "2%",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "3px",
              }}
              onClick={() => dispatch(toggleStudentCourseExerListAction())}
            >
              Exercises
            </button>
            <div>{toggleExerList ? handleExerList() : null}</div>
          </div>
          <br />
          {/* Quizzes */}
          <div>
            <button
              style={{
                width: "100%",
                textAlign: "left",
                padding: "2%",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "3px",
              }}
              onClick={() => dispatch(toggleStudentCourseQuizListAction())}
            >
              Quizzes
            </button>
            <div>{toggleQuizList ? handleQuizList() : null}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ clear: "left" }}>
        <Footer />
      </div>
    </div>
  );
}
