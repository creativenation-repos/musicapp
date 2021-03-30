import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherAssignmentAssigneesAction,
  storeTeacherAssignmentsGeneralInfoAction,
  storeTeacherSingleAssignmentAction,
} from "../../../redux/actions";

export default function AssignmentsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const assignments = useSelector(
    (state) => state.storeTeacherAssignmentsGeneralInfoReducer
  );

  // GET
  const getAllAssignments = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Assignments")
      .get()
      .then((snapshot) => {
        const assData = firebaseLooper(snapshot);
        dispatch(storeTeacherAssignmentsGeneralInfoAction(assData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleAssignmentList = () => {
    if (assignments.length > 0) {
      return assignments.map((ass, i) => {
        return (
          <div key={i}>
            <h3>{ass.Name}</h3>
            {ass.Date ? (
              <p>Assigned: {ass.Date.toDate().toString().substr(4, 11)}</p>
            ) : null}
            {ass.Due ? (
              <p>Due: {ass.Due.toDate().toString().substr(4, 11)}</p>
            ) : null}
            <button id={ass.id} onClick={navAssignmentView}>
              View
            </button>
            <button class="btn-salmon">Remove</button>
          </div>
        );
      });
    }
  };

  // NAV
  const navAssignmentView = (event) => {
    // Get assignment and store it
    const assID = event.target.getAttribute("id");
    assignments.forEach((ass) => {
      if (ass.id === assID) {
        dispatch(storeTeacherSingleAssignmentAction(ass));
        dispatch(storeTeacherAssignmentAssigneesAction(ass.Assignees));
      }
    });

    history.push("/teacher-assignment-view");
  };
  const navAssignmentNew = () => {
    history.push("/teacher-assignment-new");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
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

      {/* Content */}
      <div>
        {/* Search */}
        <div>
          <input id="tbAssSearch" type="text" placeholder="Search" />
          <button className="btn-navy" onClick={navAssignmentNew}>
            Create New Assignment
          </button>
        </div>
        <br />
        {/* Assignment List */}
        <div>{handleAssignmentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
