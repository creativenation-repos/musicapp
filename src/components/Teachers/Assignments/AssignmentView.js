import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function AssignmentView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assignment = useSelector(
    (state) => state.storeTeacherSingleAssignmentReducer
  );

  //   HANDLE
  const handleAssignment = () => {
    return (
      <div>
        {assignment.Date ? (
          <p>Assigned: {assignment.Date.toDate().toString().substr(4, 11)}</p>
        ) : null}
        {assignment.Due ? (
          <p>Due: {assignment.Due.toDate().toString().substr(4, 11)}</p>
        ) : null}
        <p>Assignment Type: {assignment.Type}</p>
        <div>{handleAssignmentType()}</div>
        <div>
          <h3>Assignees:</h3>
          {assignment.Assignees
            ? assignment.Assignees.map((stud, i) => {
                return <p key={i}>{stud}</p>;
              })
            : null}
        </div>
      </div>
    );
  };
  const handleAssignmentType = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <h3>Assignment:</h3>
          <p>{assignment.Text}</p>
        </div>
      );
    }
  };

  //   NAV
  const navAssignmentEdit = () => {
    history.push("teacher-assignment-edit");
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
      <button onClick={navAssignmentEdit}>Edit Assignment</button>
      <h1>{assignment.Name}</h1>
      <div>{handleAssignment()}</div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
