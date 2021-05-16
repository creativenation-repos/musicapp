import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import "./StudentCourses.css";
import firebase, {
  courses_Collection,
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";

import { firebaseLooper } from "../../../utils/tools";
import {
  storeStudentAllCoursesAction,
  storeStudentSingleCourseAction,
} from "../../../redux/actions";

export default function StudentCoursesMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.storeStudentAllCoursesReducer);

  // GET
  const getAllCourses = () => {
    // Get Teachers
    students_Collection
      .doc(studentAuthID)
      .collection("Teachers")
      .get()
      .then((snapshot) => {
        const teachersData = firebaseLooper(snapshot);
        teachersData.forEach((teacher) => {
          const teacherID = teacher.TeacherID;
          teachers_Collection
            .doc(teacherID)
            .collection("Students")
            .get()
            .then((snapshot) => {
              const studentData = firebaseLooper(snapshot);
              let allCourseIDs = [];
              studentData.forEach((stud) => {
                if (stud.id === studentAuthID) {
                  allCourseIDs = [...stud.Courses];
                }
              });

              let allCourses = [];
              courses_Collection
                .get()
                .then((snapshot) => {
                  const courseData = firebaseLooper(snapshot);
                  allCourseIDs.forEach((ids) => {
                    courseData.forEach((cour) => {
                      if (ids === cour.id) {
                        allCourses.push(cour);
                      }
                    });
                  });

                  dispatch(storeStudentAllCoursesAction(allCourses));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleCourseGrid = () => {
    return courses.map((cour, i) => {
      return (
        <div className="courseCard" key={i}>
          <img className="imgThumb" id={`imgThumbnail${i}`} alt="" />
          <h3 className="courseListName">{cour.Name}</h3>
          <p className="courseListDesc">{cour.Desc.substr(0, 160)}...</p>
          <button id={cour.id} onClick={navCourseOverview} className="btnView">
            View
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
          let img = document.getElementById(`imgThumbnail${i}`);
          img.src = url;
        })
        .catch((err) => console.log(err));
    });
  };

  // NAV
  const navCourseOverview = (event) => {
    const courseID = event.target.getAttribute("id");
    const allCourses = [...courses];
    allCourses.forEach((cour) => {
      if (cour.id === courseID) {
        dispatch(storeStudentSingleCourseAction(cour));
      }
    });
    history.push("/student-course-overview");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllCourses();
    handleCourseThumb();
  }, [courses]);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Courses</h1>
        <div className="courseSearchWrapper">
          <p className="searchLabel">Search for a course.</p>
          <input
            className="tbCourseSearch"
            id="tbCourseSearch"
            type="text"
            placeholder="Type course name..."
          />
        </div>
        <div className="courseGridWrapper">{handleCourseGrid()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
