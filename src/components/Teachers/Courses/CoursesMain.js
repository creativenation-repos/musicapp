import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import "./Courses.css";

export default function CoursesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
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

        <div className="courseListWrapper">
          <p className="searchHead">Search course name.</p>
          <input
            className="tbCourseSearch"
            id="tbCourseSearch"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
