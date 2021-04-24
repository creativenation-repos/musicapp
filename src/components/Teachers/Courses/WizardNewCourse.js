import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";
import FileUpload from "../../FileUpload";

export default function WizardNewCourse() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   NAV
  const navCreateLesson = () => {
    history.push("/teacher-new-lesson");
  };
  const navSaveExit = () => {
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
