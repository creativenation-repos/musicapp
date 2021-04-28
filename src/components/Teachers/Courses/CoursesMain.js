import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import firebase from "../../../utils/firebase";
import "./Courses.css";
import { firebaseLooper } from "../../../utils/tools";
import { courses_Collection } from "../../../utils/firebase";
import {
  storeTeacherAllCoursesAction,
  storeTeacherSingleCourseAction,
} from "../../../redux/actions";

export default function CoursesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.storeTeacherAllCoursesReducer);

  // GET
  const getAllCourses = () => {
    courses_Collection
      .get()
      .then((snapshot) => {
        const coursesData = firebaseLooper(snapshot);
        dispatch(storeTeacherAllCoursesAction(coursesData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleCoursesList = () => {
    return courses.map((c, i) => {
      return (
        <div className="courseListBlock" key={i}>
          <img id={`imgThumb${i}`} className="thumb" src="" alt="" />
          <h3 className="courseListName">{c.Name}</h3>
          <p className="courseListDesc">{c.Desc.substr(0, 160)}...</p>
          <div className="btnCourseGroup">
            <button id={c.id} onClick={navCourseOverview} className="btnEdit">
              View
            </button>
            <button id={c.id} onClick={removeCourse} className="btnRemove">
              Remove
            </button>
          </div>
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
          let img = document.getElementById(`imgThumb${i}`);
          img.src = url;
        })
        .catch((err) => console.log(err));
    });
  };
  const handleAllThumbnails = () => {
    courses.forEach(() => {
      handleCourseThumb();
    });
  };

  // NAV
  const navCourseOverview = (event) => {
    const courseID = event.target.getAttribute("id");

    courses.forEach((c) => {
      if (c.id === courseID) {
        dispatch(storeTeacherSingleCourseAction(c));
      }
    });

    history.push("/teacher-course-overview");
  };

  // REMOVE
  const removeCourse = (event) => {
    const courseID = event.target.getAttribute("id");

    // Remove from DB
    courses_Collection
      .doc(courseID)
      .collection("Lessons")
      .get()
      .then((snapshot) => {
        const lessonsData = firebaseLooper(snapshot);
        lessonsData.forEach((less) => {
          firebase.storage.ref("Videos/").child(less.Video).delete();

          courses_Collection
            .doc(courseID)
            .collection("Lessons")
            .doc(less.id)
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
        const quizData = firebaseLooper(snapshot);
        quizData.forEach((q) => {
          courses_Collection
            .doc(courseID)
            .collection("Quizzes")
            .doc(q.id)
            .collection("Components")
            .get()
            .then((snapshot) => {
              const compsData = firebaseLooper(snapshot);
              compsData.forEach((com) => {
                if (com.Type === "audio") {
                  firebase.storage.ref("Audio/").child(com.Audio).delete();
                } else if (com.Type === "video") {
                  firebase.storage.ref("Videos/").child(com.Video).delete();
                } else if (com.Type === "image") {
                  firebase.storage.ref("Images/").child(com.Video).delete();
                }

                courses_Collection
                  .doc(courseID)
                  .collection("Quizzes")
                  .doc(q.id)
                  .collection("Components")
                  .doc(com.id)
                  .delete()
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          courses.forEach((c) => {
            if (c.id === courseID) {
              firebase.storage.ref("Images/").child(c.Thumbnail).delete();
            }
          });

          courses_Collection
            .doc(courseID)
            .collection("Quizzes")
            .doc(q.id)
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
    const filtered = allCourses.filter((cour) => cour.id !== courseID);

    dispatch(storeTeacherAllCoursesAction(filtered));
  };

  // ONCHANGE
  const onCourseSearch = () => {
    const search = document.querySelector("#tbCourseSearch").value;

    const allCourses = [...courses];
    const filtered = allCourses.filter((c) => c.Name.includes(search));

    if (search === "") {
      dispatch(storeTeacherAllCoursesAction(courses));
    } else {
      dispatch(storeTeacherAllCoursesAction(filtered));
    }
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllCourses();
    handleAllThumbnails();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <p style={{ display: "none" }} onClick={handleAllThumbnails()}></p>
        <TopBar />
      </div>

      <div className="content">
        <h1>Courses</h1>
        <button
          onClick={() => history.push("/teacher-new-course")}
          className="btnNewCourse"
        >
          Create New Course
        </button>

        <div className="courseTop">
          <p className="searchHead">Search course name.</p>
          <input
            onChange={onCourseSearch}
            className="tbCourseSearch"
            id="tbCourseSearch"
            type="text"
            placeholder="Search"
          />
        </div>

        <div className="courseListWrapper">{handleCoursesList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
