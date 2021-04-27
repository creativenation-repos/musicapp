import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import FileUpload from "../../FileUpload";
import { firebaseLooper } from "../../../utils/tools";
import { courses_Collection } from "../../../utils/firebase";
import {
  storeTeacherSingleCourseLessonAction,
  storeTeacherSingleCourseLessonsAction,
  storeTeacherSingleCourseQuizzesAction,
  toggleTeacherSingleCourseLessonsListAction,
  toggleTeacherSingleCourseQuizzesListAction,
} from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSortDown,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";

export default function CourseOverview() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleLessonsList = useSelector(
    (state) => state.toggleTeacherSingleCourseLessonsListReducer
  );
  const toggleQuizzesList = useSelector(
    (state) => state.toggleTeacherSingleCourseQuizzesListReducer
  );

  const course = useSelector((state) => state.storeTeacherSingleCourseReducer);

  const lessons = useSelector(
    (state) => state.storeTeacherSingleCourseLessonsReducer
  );
  const quizzes = useSelector(
    (state) => state.storeTeacherSingleCourseQuizzesReducer
  );

  //   GET
  const getAllLessons = () => {
    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .get()
      .then((snapshot) => {
        const lessonsData = firebaseLooper(snapshot);
        dispatch(storeTeacherSingleCourseLessonsAction(lessonsData));
      })
      .catch((err) => console.log(err));
  };
  const getAllQuizzes = () => {
    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .get()
      .then((snapshot) => {
        const quizzesData = firebaseLooper(snapshot);
        dispatch(storeTeacherSingleCourseQuizzesAction(quizzesData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleLessonsList = () => {
    return lessons.map((less, i) => {
      return (
        <div className="lessonBlock" key={i}>
          <FontAwesomeIcon className="sortIcon" icon={faBars} />
          <h3 className="lessonListName">{less.Name}</h3>
          <button onClick={navLessonEdit} id={less.id} className="btnListEdit">
            Edit
          </button>
        </div>
      );
    });
  };
  const handleQuizzesList = () => {
    return quizzes.map((quiz, i) => {
      return (
        <div className="lessonBlock" key={i}>
          <FontAwesomeIcon className="sortIcon" icon={faBars} />
          <h3 className="lessonListName">{quiz.Name}</h3>
          <button className="btnListEdit">Edit</button>
        </div>
      );
    });
  };

  // NAV
  const navLessonEdit = (event) => {
    const lessonID = event.target.getAttribute("id");

    lessons.forEach((less) => {
      if (less.id === lessonID) {
        dispatch(storeTeacherSingleCourseLessonAction(less));
      }
    });

    history.push("/teacher-edit-lesson");
  };

  // SORTABLE
  const setSortables = () => {};

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllLessons();
    getAllQuizzes();
    setSortables();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <button onClick={() => getAllLessons()} style={{ display: "none" }}>
          Rerender
        </button>
        <TopBar />
      </div>

      <div className="content">
        <h1>Edit Course</h1>

        <div className="courseContent">
          <h2>{course.Name}</h2>

          <div className="wizardPair">
            <h3 className="h3">Course Name:</h3>
            <input
              className="tb"
              id="tbCourseName"
              type="text"
              defaultValue={course.Name}
            />
          </div>

          <div className="wizardPair">
            <h3 className="h3">Course Description:</h3>
            <textarea
              className="ta"
              id="taCourseDesc"
              defaultValue={course.Desc}
            ></textarea>
          </div>

          <div className="wizardPair">
            <h3 className="h3">Course Thumbnail:</h3>
            <FileUpload />
          </div>

          <br />

          <div className="compAccordion">
            <button
              className="btnAccordion"
              onClick={() =>
                dispatch(toggleTeacherSingleCourseLessonsListAction())
              }
            >
              {toggleLessonsList ? (
                <FontAwesomeIcon
                  className="accordIcon"
                  icon={faWindowMinimize}
                />
              ) : (
                <FontAwesomeIcon className="accordIcon" icon={faSortDown} />
              )}
              Lessons
            </button>
            {toggleLessonsList ? (
              <div id="sortableLessonsList" className="hiddenList">
                {/* Insert List Here */}
                {handleLessonsList()}
              </div>
            ) : null}
          </div>

          <div className="compAccordion">
            <button
              className="btnAccordion"
              onClick={() =>
                dispatch(toggleTeacherSingleCourseQuizzesListAction())
              }
            >
              {toggleQuizzesList ? (
                <FontAwesomeIcon
                  className="accordIcon"
                  icon={faWindowMinimize}
                />
              ) : (
                <FontAwesomeIcon className="accordIcon" icon={faSortDown} />
              )}
              Quizzes
            </button>
            {toggleQuizzesList ? (
              <div id="sortableQuizzesList" className="hiddenList">
                {/* Insert List Here */}
                {handleQuizzesList()}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
