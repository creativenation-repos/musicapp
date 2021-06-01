import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import firebase, {
  courses_Collection,
  students_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeStudentCourseProgressAction,
  storeStudentSingleCourseLessonAction,
  storeStudentSingleCourseLessonsAction,
  storeStudentSingleCourseQuizAction,
  storeStudentSingleCourseQuizzesAction,
  storeStudentUpNextAction,
  toggleStudentSingleCourseLessonsListAction,
  toggleStudentSingleCourseQuizzesListAction,
} from "../../../redux/actions";

export default function StudentCourseOverview() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleLessonsList = useSelector(
    (state) => state.toggleStudentSingleCourseLessonsListReducer
  );
  const toggleQuizzesList = useSelector(
    (state) => state.toggleStudentSingleCourseQuizzesListReducer
  );

  const course = useSelector((state) => state.storeStudentSingleCourseReducer);
  const progress = useSelector(
    (state) => state.storeStudentCourseProgressReducer
  );
  const lessons = useSelector(
    (state) => state.storeStudentSingleCourseLessonsReducer
  );
  const quizzes = useSelector(
    (state) => state.storeStudentSingleCourseQuizzesReducer
  );
  const orderNum = useSelector(
    (state) => state.storeStudentSingleCourseOrderNumReducer
  );
  const upNext = useSelector((state) => state.storeStudentUpNextReducer);

  // GET
  const getStudentCourseProgress = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .orderBy("Date", "desc")
      .where("CourseID", "==", course.id)
      .get()
      .then((snapshot) => {
        const courseProg = firebaseLooper(snapshot);
        dispatch(storeStudentCourseProgressAction(courseProg));
      })
      .catch((err) => console.log(err));
  };
  const getAllLessons = () => {
    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .orderBy("Order", "asc")
      .get()
      .then((snapshot) => {
        const lessonsData = firebaseLooper(snapshot);
        dispatch(storeStudentSingleCourseLessonsAction(lessonsData));
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
        dispatch(storeStudentSingleCourseQuizzesAction(quizzesData));
      })
      .catch((err) => console.log(err));
  };
  const getUpNext = () => {
    if (progress.length === 0) {
      // Start with the first lesson
      lessons.forEach((less) => {
        if (less.Order === 1) {
          less = {
            ...less,
            Type: "lesson",
          };
          dispatch(storeStudentUpNextAction(less));
        }
      });
    } else {
      const currProg = progress[0];
      if (currProg.Type === "lesson") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .get()
          .then((snapshot) => {
            const quizData = firebaseLooper(snapshot);
            quizData.forEach((q) => {
              if (q.Order === currProg.Order) {
                q = {
                  ...q,
                  Type: "quiz",
                };
                dispatch(storeStudentUpNextAction(q));
              } else {
                courses_Collection
                  .doc(course.id)
                  .collection("Lessons")
                  .get()
                  .then((snapshot) => {
                    const lessonData = firebaseLooper(snapshot);
                    lessonData.forEach((l) => {
                      if (l.Order === currProg.Order + 1) {
                        l = {
                          ...l,
                          Type: "lesson",
                        };
                        dispatch(storeStudentUpNextAction(l));
                      }
                    });
                  })
                  .catch((err) => console.log(err));
              }
            });
          })
          .catch((err) => console.log(err));
      } else if (currProg.Type === "quiz") {
        courses_Collection
          .doc(course.id)
          .collection("Lessons")
          .get()
          .then((snapshot) => {
            const lessonData = firebaseLooper(snapshot);
            lessonData.forEach((l) => {
              if (l.Order === currProg.Order + 1) {
                l = {
                  ...l,
                  Type: "lesson",
                };
                dispatch(storeStudentUpNextAction(l));
              } else {
                courses_Collection
                  .doc(course.id)
                  .collection("Quizzes")
                  .get()
                  .then((snapshot) => {
                    const quizData = firebaseLooper(snapshot);
                    quizData.forEach((q) => {
                      if (q.Order === currProg.Order + 1) {
                        q = {
                          ...q,
                          Type: "quiz",
                        };
                        dispatch(storeStudentUpNextAction(q));
                      }
                    });
                  })
                  .catch((err) => console.log(err));
              }
            });
          })
          .catch((err) => console.log(err));
      }
    }
  };
  const checkCourseCompletion = () => {
    // Check if the course has been finished. If so, then close the up next and add completed banner
  };

  // HANDLE
  const handleCourseThumb = () => {
    var storage = firebase.storage();
    var storageRef = storage.ref(`Images/`);
    //urll is the url for image
    storageRef
      .child(course.Thumbnail)
      .getDownloadURL()
      .then(function (url) {
        // Or inserted into an <img> element:
        let img = document.getElementById(`imgCourseThumb`);
        img.src = url;
      })
      .catch((err) => console.log(err));
  };
  const handleUpNext = () => {
    return (
      <div>
        <h3 className="upNextName">{upNext.Name}</h3>
        <p className="upNextDesc">{upNext.Desc}...</p>
        <button onClick={navCourseComp} id={upNext.Type} className="btnBegin">
          Begin
        </button>
      </div>
    );
  };
  const handleLessonList = () => {
    return lessons.map((less, i) => {
      return (
        <div key={i}>
          <p className="listName">
            {less.Name}
            {less.Name ? (
              less.Name.includes("Lesson") ? null : (
                <span> Lesson</span>
              )
            ) : null}
          </p>
        </div>
      );
    });
  };
  const handleQuizList = () => {
    return quizzes.map((quiz, i) => {
      return (
        <div key={i}>
          <p className="listName">{quiz.Name}</p>
        </div>
      );
    });
  };

  // NAV
  const navCourseComp = (event) => {
    const compType = event.target.getAttribute("id");

    if (compType === "lesson") {
      dispatch(storeStudentSingleCourseLessonAction(upNext));
      history.push("/student-course-lesson");
    } else if (compType === "quiz") {
      dispatch(storeStudentSingleCourseQuizAction(upNext));
      history.push("/student-course-quiz");
    }
  };

  // RENDER
  const doEverything = () => {
    handleCourseThumb();
    getStudentCourseProgress();
    getAllLessons();
    getAllQuizzes();
    getUpNext();
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    doEverything();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Course Overview</h1>

        {/* Content */}
        <div className="studContentWrapper">
          {/* Left Side */}
          <div className="left">
            <p className="studCourseName">{course.Name}</p>
            <img className="imgCourseThumb" id="imgCourseThumb" alt="" />
            <p className="overview">Overview</p>
            <p className="studCourseDesc">{course.Desc}</p>
          </div>
          {/* Right Side */}
          <div className="right">
            {/* Up next */}
            <div className="upnext">
              <h2 className="upnextHead">Up next:</h2>
              {handleUpNext()}
            </div>
            <br />
            {/* Lessons List */}
            <div className="listWrapper">
              <button
                onClick={() =>
                  dispatch(toggleStudentSingleCourseLessonsListAction())
                }
                className="btnListHead"
              >
                Lessons
              </button>
              {toggleLessonsList ? handleLessonList() : null}
            </div>

            {/* Quizzes List */}
            <div className="listWrapper">
              <button
                onClick={() =>
                  dispatch(toggleStudentSingleCourseQuizzesListAction())
                }
                className="btnListHead"
              >
                Quizzes
              </button>
              {toggleQuizzesList ? handleQuizList() : null}
            </div>
          </div>
        </div>
      </div>

      {/* FOoter */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
