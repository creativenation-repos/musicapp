import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import {
  storeStudentSingleCourseAction,
  flagStudentTeacherConnectionAction,
  storeStudentTeacherListAction,
  storeStudentCoursesAction,
} from "../../../redux/actions";
import {
  courses_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentCoursesMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const studentTeacherConn = useSelector(
    (state) => state.flagStudentTeacherConnectionReducer
  );
  const studentTeacherList = useSelector(
    (state) => state.storeStudentTeacherListReducer
  );

  const courses = useSelector((state) => state.storeStudentCoursesReducer);

  //   GET
  const getStudentTeacherConnection = () => {
    let teachers = [];
    teachers_Collection
      .get()
      .then((snapshot) => {
        const teacherList = firebaseLooper(snapshot);
        teacherList.forEach((teach) => {
          teachers_Collection
            .doc(teach.id)
            .collection("Students")
            .get()
            .then((snapshot) => {
              const studentList = firebaseLooper(snapshot);
              studentList.forEach((stud) => {
                if (stud.id === studentAuthID) {
                  dispatch(flagStudentTeacherConnectionAction(true));
                  teachers.push(teach);
                  dispatch(storeStudentTeacherListAction(teachers));
                }
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllCourses = () => {
    if (studentTeacherConn) {
      studentTeacherList.forEach((teach) => {
        courses_Collection
          .where("Creator", "==", teach.id)
          .get()
          .then((snapshot) => {
            const courses = firebaseLooper(snapshot);
            dispatch(storeStudentCoursesAction(courses));
          })
          .catch((err) => console.log(err));
      });
    }
  };

  //   HANDLE
  const handleCourseList = () => {
    return courses.map((course, i) => {
      return (
        <div key={i}>
          <h3>{course.Name}</h3>
          <h4>Instructor: {course.Creator}</h4>
          <button id={course.id} onClick={navCoursePreview}>
            Enter Course
          </button>
        </div>
      );
    });
  };

  //   NAVIGATE
  const navCoursePreview = (event) => {
    const courseID = event.target.getAttribute("id");

    courses.forEach((course) => {
      if (course.id === courseID) {
        dispatch(storeStudentSingleCourseAction(course));
      }
    });

    history.push("/student-course-preview");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getStudentTeacherConnection();
    getAllCourses();
  }, []);
  return (
    <div>
      {/* TopBar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <div>
          <h1>Courses</h1>
        </div>

        {/* Search */}
        <div>
          <input
            id="tbCourseSearch"
            type="text"
            placeholder="Type Course Name/Keywords"
          />
        </div>
        <hr />
        <button
          onClick={() => {
            getStudentTeacherConnection();
            getAllCourses();
          }}
        >
          Rerender
        </button>
        {/* Course List */}
        <div>{handleCourseList()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
