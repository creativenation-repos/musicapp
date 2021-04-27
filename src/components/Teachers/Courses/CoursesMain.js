import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import "./Courses.css";
import { firebaseLooper } from "../../../utils/tools";
import { courses_Collection } from "../../../utils/firebase";
import {
  storeTeacherAllCoursesAction,
  storeTeacherSingleCourseAction,
} from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
          <img className="thumb" src="" alt="" />
          <h3 className="courseListName">{c.Name}</h3>
          <p className="courseListDesc">{c.Desc.substr(0, 160)}...</p>
          <button id={c.id} onClick={navCourseOverview} className="btnEdit">
            Edit
          </button>
          <button id={c.id} onClick={removeCourse} className="btnRemove">
            Remove
          </button>
        </div>
      );
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
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllCourses();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        {/* Rerender */}
        <button onClick={() => getAllCourses()} style={{ display: "none" }}>
          Rerender
        </button>
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
