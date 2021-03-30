import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import {
  storeStudentAssignmentsAction,
  storeStudentSingleAssignmentAction,
  storeStudentAssignmentsInfoAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentAssignmentsMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assignments = useSelector(
    (state) => state.storeStudentAssignmentsReducer
  );
  const assignmentsInfo = useSelector(
    (state) => state.storeStudentAssignmentsInfoReducer
  );

  //   GET
  const getAllAssignments = () => {
    // Get list of assignments info
    students_Collection
      .doc(studentAuthID)
      .collection("AssignmentsInfo")
      .get()
      .then((snapshot) => {
        const assignmentList = firebaseLooper(snapshot);
        dispatch(storeStudentAssignmentsInfoAction(assignmentList));
        assignmentList.forEach((ass) => {
          teachers_Collection
            .doc(ass.Teacher)
            .collection("Assignments")
            .where("Name", "==", ass.Name)
            .get()
            .then((snapshot) => {
              const assData = firebaseLooper(snapshot);
              dispatch(storeStudentAssignmentsAction(assData));
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleCompleteAssignmentList = () => {
    return assignmentsInfo.map((assInfo, i) => {
      if (assInfo.isComplete) {
        return (
          <div key={i}>
            <h3>{assInfo.Name}</h3>
            <p>Teacher: {assInfo.Teacher}</p>
            <p style={{ color: "green" }}>Complete!</p>
          </div>
        );
      }
    });
  };

  const handleIncompleteAssignmentList = () => {
    return assignmentsInfo.map((assInfo, i) => {
      if (!assInfo.isComplete) {
        return (
          <div key={i}>
            <h3>{assInfo.Name}</h3>
            <p>{assInfo.Desc}</p>
            <p>Teacher: {assInfo.Teacher}</p>
            <button id={assInfo.AssID} onClick={navAssignmentView}>
              View
            </button>
          </div>
        );
      }
    });
  };

  //   NAV
  const navAssignmentView = (event) => {
    const assID = event.target.getAttribute("id");
    assignments.forEach((ass) => {
      if (ass.id === assID) {
        dispatch(storeStudentSingleAssignmentAction(ass));
      }
    });

    history.push("/student-assignment-view");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllAssignments();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <h1>Assignments</h1>

        <br />
        <h3>Incomplete</h3>
        {handleIncompleteAssignmentList()}
        <hr />
        <h3>Completed</h3>
        {handleCompleteAssignmentList()}
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
