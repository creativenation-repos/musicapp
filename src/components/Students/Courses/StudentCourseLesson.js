import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";

import firebase, {
  courses_Collection,
  students_Collection,
} from "./../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeStudentCourseProgressAction,
  storeStudentTimeAction,
  storeStudentSingleCourseQuizAction,
  storeStudentCourseTimerAction,
} from "../../../redux/actions";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function StudentCourseLesson() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const course = useSelector((state) => state.storeStudentSingleCourseReducer);
  const lesson = useSelector(
    (state) => state.storeStudentSingleCourseLessonReducer
  );
  const progress = useSelector(
    (state) => state.storeStudentCourseProgressReducer
  );

  //   HANDLE
  const handleLessonVideo = () => {
    var storage = firebase.storage();
    var storageRef = storage.ref(`Videos/`);
    //urll is the url for image
    storageRef
      .child(lesson.Video)
      .getDownloadURL()
      .then(function (url) {
        // Or inserted into an <img> element:
        let img = document.getElementById(`vidLesson`);
        img.src = url;
      })
      .catch((err) => console.log(err));
  };

  //   NAV
  const navSaveExit = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const progID = `Prog${rand1}${rand2}`;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("CourseProgress")
      .doc(progID)
      .set({
        Type: "lesson",
        Name: lesson.Name,
        CourseID: course.id,
        Order: lesson.Order,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allProg = [...progress];
    allProg.push({
      id: progID,
      Type: "lesson",
      Name: lesson.Name,
      CourseID: course.id,
      Order: lesson.Order,
      Date: GetToday(),
    });

    dispatch(storeStudentCourseProgressAction(allProg));

    history.push("/student-course-overview");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    handleLessonVideo();
  }, [lesson]);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <div className="lessonWrapper">
          <p className="courseLessonName">{lesson.Name}</p>
          <video className="vidLesson" id="vidLesson" controls="true"></video>

          <div className="lessonTextWrapper">
            <p className="lessonTextHead">Lesson Text</p>
            <p className="lessonText">{lesson.Text}</p>
          </div>
        </div>

        <div className="btnCourseCompGroup">
          
          <button onClick={navSaveExit} style={{ backgroundColor: "white" }}>
            Finish &amp; Exit
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
