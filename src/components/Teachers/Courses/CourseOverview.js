import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import FileUpload, { programUpload } from "../../FileUpload";
import firebase, {
  teachers_Collection,
  courses_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherAllCoursesAction,
  storeTeacherSingleCourseAction,
  storeTeacherSingleCourseLessonAction,
  storeTeacherSingleCourseLessonsAction,
  storeTeacherSingleCourseQuizAction,
  storeTeacherSingleCourseQuizzesAction,
  storeTeacherStudentGeneralInfoAction,
  toggleTeacherSingleCourseLessonsListAction,
  toggleTeacherSingleCourseQuizzesListAction,
  storeTeacherSingleCourseAssignedStudsAction,
  storeTeacherSingleCourseAssigneesAction,
} from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faPlus,
  faSortDown,
  faTimes,
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

  const courses = useSelector((state) => state.storeTeacherAllCoursesReducer);
  const course = useSelector((state) => state.storeTeacherSingleCourseReducer);
  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );
  const assigned = useSelector(
    (state) => state.storeTeacherSingleCourseAssignedStudsReducer
  );
  const assignees = useSelector(
    (state) => state.storeTeacherSingleCourseAssigneesReducer
  );

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
      .orderBy("Order", "asc")
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
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const quizzesData = firebaseLooper(snapshot);
        dispatch(storeTeacherSingleCourseQuizzesAction(quizzesData));
      })
      .catch((err) => console.log(err));
  };
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentGeneralInfoAction(studentData));
      })
      .catch((err) => console.log(err));
  };
  const getAssigneeStuds = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .where("Courses", "array-contains", course.id)
      .get()
      .then((snapshot) => {
        const studsData = firebaseLooper(snapshot);
        dispatch(storeTeacherSingleCourseAssigneesAction(studsData));
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
          <button onClick={removeLesson} id={less.id} className="compDel">
            <FontAwesomeIcon icon={faTimes} />
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
          <button id={quiz.id} onClick={navQuizEdit} className="btnListEdit">
            Edit
          </button>
          <button className={removeQuiz} id={quiz.id} className="compDel">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      );
    });
  };
  const handleCourseThumb = () => {
    courses.forEach((c, i) => {
      var storage = firebase.storage();
      var storageRef = storage.ref(`Images/`);
      //urll is the url for image
      storageRef
        .child(c.Thumbnail)
        .getDownloadURL()
        .then(function (url) {
          // Or inserted into an <img> element:
          let img = document.getElementById(`imgThumbnail`);
          img.src = url;
        })
        .catch((err) => console.log(err));
    });
  };
  const handleAssignedSearchStudList = () => {
    return assigned.map((assignee, i) => {
      return (
        <div className="searchAssigneeWrapper" key={i}>
          <button
            id={assignee.id}
            onClick={onAssigneeClick}
            className="btnSearchAssignee"
          >
            {assignee.FirstName} {assignee.LastName}
          </button>
        </div>
      );
    });
  };
  const handleAssigneesList = () => {
    return assignees.map((assign, i) => {
      return (
        <div key={i}>
          <p className="assignee">
            <FontAwesomeIcon style={{ color: "#3E00F9" }} icon={faArrowRight} />
            <span style={{ marginLeft: "10px" }}>
              {assign.FirstName} {assign.LastName}
            </span>
          </p>
        </div>
      );
    });
  };

  // POST
  const saveChanges = () => {
    // Save course details here
    const courseName = document.querySelector("#tbCourseName").value;
    const courseDesc = document.querySelector("#taCourseDesc").value;
    let courseThumb = programUpload();
    if (courseThumb === undefined) {
      courseThumb = course.Thumbnail;
    }

    courses_Collection
      .doc(course.id)
      .update({
        Name: courseName,
        Desc: courseDesc,
        Thumbnail: courseThumb,
      })
      .catch((err) => console.log(err));

    const allCourses = [...courses];
    allCourses.forEach((c) => {
      if (c.id === course.id) {
        c = {
          id: c.id,
          Name: courseName,
          Desc: courseDesc,
          Thumbnail: courseThumb,
        };
        dispatch(storeTeacherAllCoursesAction(allCourses));
      }
    });

    history.push("/teacher-courses");
  };

  // REMOVE
  const removeLesson = (event) => {
    const lessonID = event.target.getAttribute("id");

    // Remove from DB
    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .doc(lessonID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allLessons = [...lessons];
    const filtered = allLessons.filter((l) => l.id !== lessonID);

    dispatch(storeTeacherSingleCourseLessonsAction(filtered));
  };
  const removeQuiz = (event) => {
    const quizID = event.target.getAttribute("id");

    // Remove from DB
    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .doc(quizID)
      .collection("Components")
      .get()
      .then((snapshot) => {
        const compsData = firebaseLooper(snapshot);
        compsData.forEach((com) => {
          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .collection("Components")
            .doc(com.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .doc(quizID)
      .delete()
      .catch((err) => console.log(err));

    // DIspatch
    const allQuizzes = [...quizzes];
    const filtered = allQuizzes.filter((q) => q.id !== quizID);

    dispatch(storeTeacherSingleCourseQuizzesAction(filtered));
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
  const navQuizEdit = (event) => {
    const quizID = event.target.getAttribute("id");

    quizzes.forEach((quiz) => {
      if (quiz.id === quizID) {
        dispatch(storeTeacherSingleCourseQuizAction(quiz));
      }
    });

    history.push("/teacher-edit-quiz");
  };
  const navNewLesson = () => {
    dispatch(storeTeacherSingleCourseAction(course));

    history.push("/teacher-new-lesson");
  };
  const navNewQuiz = () => {
    dispatch(storeTeacherSingleCourseAction(course));

    history.push("/teacher-new-quiz");
  };

  // SORTABLE
  const setSortables = () => {};

  // ONCHANGE
  const onStudSearch = () => {
    const search = document.querySelector("#tbStudSearch").value.toLowerCase();

    let results = [];
    students.forEach((stud) => {
      const studName = `${stud.FirstName} ${stud.LastName} ${stud.StudentID}`.toLowerCase();
      if (studName.includes(search)) {
        results.push(stud);
      }
    });

    dispatch(storeTeacherSingleCourseAssignedStudsAction(results));
    if (search === "") {
      dispatch(storeTeacherSingleCourseAssignedStudsAction([]));
    }
  };

  // CLICK
  const onAssigneeClick = (event) => {
    const studID = event.target.getAttribute("id");
    let valid = true;

    assignees.forEach((a) => {
      if (a.id === studID) {
        valid = false;
      }
    });

    if (valid) {
      // Save to DB

      teachers_Collection
        .doc(teacherAuthID)
        .collection("Students")
        .doc(studID)
        .update({
          Courses: firebase.firestore.FieldValue.arrayUnion(course.id),
        })
        .catch((err) => console.log(err));

      // DIspatch
      const allAssignees = [...assignees];
      students.forEach((stud) => {
        if (stud.id === studID) {
          allAssignees.push(stud);

          dispatch(storeTeacherSingleCourseAssigneesAction(allAssignees));
        }
      });
    }
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllLessons();
    getAllQuizzes();
    getAllStudents();
    getAssigneeStuds();

    setSortables();
    handleCourseThumb();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        {/* <button onClick={} style={{ display: "none" }}>
          Rerender
        </button> */}
        <TopBar />
      </div>

      <div className="content">
        <h1>Course Overview</h1>

        <div className="courseContent">
          <h1>{course.Name}</h1>
          <img className="courseThumb" id="imgThumbnail" src="" alt="" />

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

          {/* Assign Students */}
          <div className="wizardPair">
            <h3 className="h3">Assigned Students:</h3>
            {handleAssigneesList()}
            <input
              onChange={onStudSearch}
              id="tbStudSearch"
              type="text"
              placeholder="Type student name..."
            />
            <div className="studSearchList">
              {handleAssignedSearchStudList()}
            </div>
          </div>

          <button onClick={saveChanges} className="btnSave">
            Save Changes
          </button>
          <br />
          <br />

          <h1>Course Components</h1>

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
                <button onClick={navNewLesson} className="btnNewComp">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
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
                <button onClick={navNewQuiz} className="btnNewComp">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
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
