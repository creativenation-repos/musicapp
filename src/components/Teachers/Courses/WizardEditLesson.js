import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import FileUpload, { programUpload } from "../../FileUpload";
import {
  storeTeacherSingleCourseLessonAction,
  storeTeacherSingleCourseLessonsAction,
} from "../../../redux/actions";
import { courses_Collection } from "../../../utils/firebase";

export default function WizardEditLesson() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const course = useSelector((state) => state.storeTeacherSingleCourseReducer);
  const lessons = useSelector(
    (state) => state.storeTeacherSingleCourseLessonsReducer
  );
  const lesson = useSelector(
    (state) => state.storeTeacherSingleCourseLessonReducer
  );

  // HANDLE
  const handleLessonForm = () => {
    return (
      <div>
        <div className="wizardPair">
          <h3 className="h3">Lesson Name:</h3>
          <input
            className="tb"
            id="tbLessonName"
            type="text"
            defaultValue={lesson.Name}
          />
        </div>

        <div className="wizardPair">
          <h3 className="h3">Lesson Description:</h3>
          <textarea
            className="ta"
            id="taLessonDesc"
            defaultValue={lesson.Desc}
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
            include a text version of the video provided. This will be displayed
            right underneath the video for the students to read as amn
            alternative for watching the video.
          </p>
          <textarea
            className="ta"
            id="taLessonText"
            defaultValue={lesson.Text}
          ></textarea>
        </div>
      </div>
    );
  };

  // POST
  const saveChanges = () => {
    const lessonName = document.querySelector("#tbLessonName").value;
    const lessonDesc = document.querySelector("#taLessonDesc").value;
    let lessonVideo = lesson.Video;
    const lessonText = document.querySelector("#taLessonText").value;

    if (programUpload() !== undefined) {
      lessonVideo = programUpload();
    }

    courses_Collection
      .doc(course.id)
      .collection("Lessons")
      .doc(lesson.id)
      .update({
        Name: lessonName,
        Desc: lessonDesc,
        Video: lessonVideo,
        Text: lessonText,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allLessons = [...lessons];
    allLessons.forEach((less) => {
      if (less.id === lesson.id) {
        less = {
          id: lesson.id,
          Name: lessonName,
          Desc: lessonDesc,
          Video: lessonVideo,
          Text: lessonText,
        };

        dispatch(storeTeacherSingleCourseLessonsAction(allLessons));
      }
    });

    history.push("/teacher-course-overview");
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
        <h1>Edit Lesson</h1>

        <div className="bodyWrapper">
          {handleLessonForm()}
          <div className="btnGroup">
            <button
              onClick={() => {
                dispatch(storeTeacherSingleCourseLessonAction({}));
                history.push("/teacher-course-overview");
              }}
              className="btnBack"
            >
              Back
            </button>
            <button onClick={saveChanges} className="btnSaveGroup">
              Save Changes
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
