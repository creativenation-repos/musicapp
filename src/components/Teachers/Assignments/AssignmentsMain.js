import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import "./Assignments.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherAssignmentAssigneesAction,
  storeTeacherAssignmentsGeneralInfoAction,
  storeTeacherSingleAssignmentAction,
} from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
          <div className="assListBlock" key={i}>
            <div className="assGrid">
              <h3 className="assName">{ass.Name}</h3>
              {ass.Date ? (
                <p className="assAssigned">
                  Assigned: {ass.Date.toDate().toString().substr(4, 11)}
                </p>
              ) : null}
              {ass.Due ? (
                <p className="assDue">
                  Due: {ass.Due.toDate().toString().substr(4, 11)}
                </p>
              ) : null}
            </div>
            <div className="btnGroup">
              <button
                className="btnAssView"
                id={ass.id}
                onClick={navAssignmentView}
              >
                View
              </button>
              <button
                id={ass.id}
                onClick={removeAssignment}
                className="btnAssRemove"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
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

  // REMOVE
  const removeAssignment = (event) => {
    const assID = event.target.getAttribute("id");

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Assignments")
      .doc(assID)
      .delete()
      .catch((err) => console.log(err));

    // Duspatch
    const allAssignments = [...assignments];
    const filtered = allAssignments.filter((a) => a.id !== assID);

    dispatch(storeTeacherAssignmentsGeneralInfoAction(filtered));
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
      <div className="content">
        <h1>Assignments</h1>
        {/* Search */}
        <div className="searchWrapper">
          <p className="searchHead">Search for assignments.</p>
          <input id="tbAssSearch" type="text" placeholder="Search" />
          <button className="btnCreate" onClick={navAssignmentNew}>
            Create New Assignment
          </button>
        </div>
        <br />
        {/* Assignment List */}
        <div className="assWrapper">{handleAssignmentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
