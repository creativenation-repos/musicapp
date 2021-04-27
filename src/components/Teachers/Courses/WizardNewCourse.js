import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";
import FileUpload, { programUpload } from "../../FileUpload";
import RandomString from "../../RandomString";
import { courses_Collection } from "../../../utils/firebase";
import {
  storeTeacherAllCoursesAction,
  storeTeacherSingleCourseAction,
} from "../../../redux/actions";

export default function WizardNewCourse() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.storeTeacherAllCoursesReducer);

  // POST
  const saveCourseDetails = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const courseID = `Course${rand1}${rand2}`;

    // Variables
    const courseName = document.querySelector("#tbCourseName").value;
    const courseDesc = document.querySelector("#taCourseDesc").value;
    const courseThumb = programUpload();

    // Save in DB
    courses_Collection.doc(courseID).set({
      Name: courseName,
      Desc: courseDesc,
      Thumbnail: courseThumb,
    });

    // Dispatch
    const allCourses = [...courses];
    allCourses.push({
      id: courseID,
      Name: courseName,
      Desc: courseDesc,
      Thumbnail: courseThumb,
    });

    dispatch(storeTeacherAllCoursesAction(allCourses));
    dispatch(
      storeTeacherSingleCourseAction({
        id: courseID,
        Name: courseName,
        Desc: courseDesc,
        Thumbnail: courseThumb,
      })
    );
  };

  //   NAV
  const navCreateLesson = () => {
    saveCourseDetails();
    history.push("/teacher-new-lesson");
  };
  const navSaveExit = () => {
    saveCourseDetails();
    history.push("/teacher-courses");
  };

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
        <h1>New Course: Course Details</h1>

        <div className="bodyWrapper">
          <div className="wizardPair">
            <h3 className="h3">Course Name:</h3>
            <input
              className="tb"
              id="tbCourseName"
              type="text"
              placeholder="Course Name"
            />
          </div>

          <div className="wizardPair">
            <h3 className="h3">Course Description:</h3>
            <textarea
              className="ta"
              id="taCourseDesc"
              placeholder="Course Description"
            ></textarea>
          </div>

          <div className="wizardPair">
            <h3 className="h3">Course Thumbnail:</h3>
            <FileUpload />
          </div>

          <div className="btnFlex">
            <button onClick={navSaveExit} className="btnFormSecondary">
              Save &amp; Exit
            </button>
            <button onClick={navCreateLesson} className="btnFormPrimary">
              Create Lesson {`>`}
            </button>
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
