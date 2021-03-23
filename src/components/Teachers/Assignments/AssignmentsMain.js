import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import AssignmentBlock from "./AssignmentBlock";
import DashFooter from "../Dash/DashFooter";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


export default function AssignmentsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();

  const assignmentState = useSelector(
    (state) => state.storeTeacherAssignmentsGeneralInfoReducer
  );

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

      {/* Content */}
      <div>
        <div>
          <input id="tbAssSearch" type="text" placeholder="Search" />
          <button>Create New Assignment</button>
        </div>
        <div>
          {assignmentState.map((ass, i) => {
            return <AssignmentBlock key={i} name={ass.Name} due={ass.Due} assignedTo={ass.AssignedTo} /> ;
          })}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
