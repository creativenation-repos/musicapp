import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherStudentGeneralInfoAction,
  storeTeacherSingleStudentAction,
} from "../../../redux/actions";

export default function StudentsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );

  // GET
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentList = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentGeneralInfoAction(studentList));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleStudentList = () => {
    return students.map((stud, i) => {
      return (
        <div key={i}>
          <h3>
            {stud.FirstName} {stud.LastName}
          </h3>
          <p>{stud.id}</p>
          <button onClick={navStudentOverview} id={stud.id}>
            Overview
          </button>
          <button>Remove</button>
        </div>
      );
    });
  };

  // NAV
  const navStudentOverview = (event) => {
    const studID = event.target.getAttribute("id");

    students.forEach((stud) => {
      if (stud.id === studID) {
        students_Collection
          .where("StudentID", "==", stud.id)
          .get()
          .then((snapshot) => {
            const student = firebaseLooper(snapshot);
            student.forEach((s) => {
              dispatch(storeTeacherSingleStudentAction(s));
            });
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/teacher-student-overview");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllStudents();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div className="content">
        <div>
          <h1>Students</h1>
        </div>
        {/* Student Search */}
        <div></div>

        {/* Student List */}
        <div>{handleStudentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
