import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import { courses_Collection } from "../../../utils/firebase";
import {
  storeSingleCourseAction,
  storeTeacherCourseGeneralInfoAction,
  storeSingleCourseLessonsAction,
  storeSingleCourseExersAction,
  storeSingleCourseQuizzesAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import CoursesCard from "../../Courses/CoursesCard";

export default function CoursesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const courses = useSelector(
    (state) => state.storeTeacherCourseGeneralInfoReducer
  );

  const getAllCourses = () => {
    courses_Collection
      .where("Creator", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherCourseGeneralInfoAction(data));
      })
      .catch((err) => console.log(err));
  };

  const removeCourse = (event) => {
    const courseID = event.target.getAttribute("id");

    // Remove from DB

    courses_Collection
      .doc(courseID)
      .collection("Lessons")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((lesson) => {
          courses_Collection
            .doc(courseID)
            .collection("Lessons")
            .doc(lesson.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    courses_Collection
      .doc(courseID)
      .collection("Exercises")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((exer) => {
          courses_Collection
            .doc(courseID)
            .collection("Exercises")
            .doc(exer.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    courses_Collection
      .doc(courseID)
      .collection("Quizzes")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((quiz) => {
          courses_Collection
            .doc(courseID)
            .collection("Quizzes")
            .doc(quiz.id)
            .collection("Components")
            .get()
            .then((snapshot) => {
              const compData = firebaseLooper(snapshot);
              compData.forEach((comp) => {
                courses_Collection
                  .doc(courseID)
                  .collection("Quizzes")
                  .doc(quiz.id)
                  .collection("Components")
                  .doc(comp.id)
                  .delete()
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          courses_Collection
            .doc(courseID)
            .collection("Quizzes")
            .doc(quiz.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    courses_Collection
      .doc(courseID)
      .collection("Exams")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((exam) => {
          courses_Collection
            .doc(courseID)
            .collection("Exams")
            .doc(exam.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    courses_Collection
      .doc(courseID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allCourses = [...courses];
    const filtered = allCourses.filter((course) => course.id !== courseID);

    dispatch(storeTeacherCourseGeneralInfoAction(filtered));
  };
  const editCourse = (event) => {
    const courseID = event.target.getAttribute("id");

    courses.forEach((course) => {
      if (course.id === courseID) {
        dispatch(storeSingleCourseAction(course));

        // Dispatch Lessons
        courses_Collection
          .doc(course.id)
          .collection("Lessons")
          .orderBy("Order", "asc")
          .get()
          .then((snapshot) => {
            const lessonData = firebaseLooper(snapshot);
            dispatch(storeSingleCourseLessonsAction(lessonData));
          })
          .catch((err) => console.log(err));

        // Dispatch Exercises
        courses_Collection
          .doc(course.id)
          .collection("Exercises")
          .orderBy("Order", "asc")
          .get()
          .then((snapshot) => {
            const exerData = firebaseLooper(snapshot);
            dispatch(storeSingleCourseExersAction(exerData));
          })
          .catch((err) => console.log(err));

        // Dispatch Quizzes
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .orderBy("Order", "asc")
          .get()
          .then((snapshot) => {
            const quizData = firebaseLooper(snapshot);
            dispatch(storeSingleCourseQuizzesAction(quizData));
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/teacher-courses-wizard-edit");
  };

  const handleCourseList = () => {
    return courses.map((course, i) => {
      return (
        <div key={i}>
          <h3>{course.Name}</h3>
          <p>{course.Access}</p>
          <button id={course.id} onClick={editCourse}>
            Edit
          </button>
          <button id={course.id} onClick={removeCourse}>
            Remove
          </button>
        </div>
      );
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllCourses();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <h1>Courses</h1>
        <br />
        <input id="tbCourseSearch" type="text" placeholder="Search" />
        <button onClick={() => history.push("/teacher-courses-wizard-full")}>
          Create New Course
        </button>
      </div>
      <div>{handleCourseList()}</div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
