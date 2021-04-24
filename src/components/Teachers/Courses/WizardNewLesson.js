import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import FileUpload from "../../FileUpload";

export default function WizardNewLesson() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   NAV
  const navCreateQuiz = () => {
    history.push("/teacher-new-quiz");
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
        <h1>New Course: Lesson Details</h1>

        <div className="bodyWrapper">
          <div className="wizardPair">
            <h3 className="h3">Lesson Name:</h3>
            <input
              className="tb"
              id="tbLessonName"
              type="text"
              placeholder="Lesson Name"
            />
          </div>

          <div className="wizardPair">
            <h3 className="h3">Lesson Description:</h3>
            <textarea
              className="ta"
              id="taLessonDesc"
              placeholder="Lesson Description"
            ></textarea>
          </div>

          <div className="wizardPair">
            <h3 className="h3">Lesson Video:</h3>
            <FileUpload />
          </div>

          <div className="wizardPair">
            <h3 className="h3">Lesson Text:</h3>
            <p className="smallText">
              This section of the lesson will be available for the teacher to
              include a text version of the video provided. This will be
              displayed right underneath the video for the students to read as
              amn alternative for watching the video.
            </p>
            <textarea
              className="ta"
              id="taLessonDesc"
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor risus, euismod accumsan laoreet in, luctus eu mauris. Mauris purus lorem, commodo ut ante et, scelerisque congue mauris. Quisque consectetur purus vel tellus vulputate malesuada. Fusce a nisi sit amet erat porta blandit. Cras ultricies malesuada ultrices. Quisque libero purus, finibus sed ante quis, tincidunt sodales ex. Nulla ut ligula quam."
            ></textarea>
          </div>

          <div className="btnFlex">
            <button onClick={navSaveExit} className="btnFormSecondary">
              Save &amp; Exit
            </button>
            <button onClick={navCreateQuiz} className="btnFormPrimary">
              Create Quiz {`>`}
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
