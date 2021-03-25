import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import { storeTeacherSingleAssignmentAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";

export default function AssignmentEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assignment = useSelector(
    (state) => state.storeTeacherSingleAssignmentReducer
  );

  //   HANDLE
  const handleAssignment = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <h3>Assignment Prompt:</h3>
          <textarea id="taAssText" defaultValue={assignment.Text}></textarea>
        </div>
      );
    }
  };
  const handleAssignees = () => {
    if (assignment.Assignees) {
      return assignment.Assignees.map((stud, i) => {
        return (
          <div key={i}>
            <p>{stud}</p>
            <button id={stud} class="btn-salmon" onClick={removeAssignee}>
              -
            </button>
          </div>
        );
      });
    }
  };

  //   POST
  const saveAllChanges = () => {
    const assName = document.querySelector("#tbAssName").value;
    const assDue = FirebaseDate(document.querySelector("#daAssDue").value);
    const assText = document.querySelector("#taAssText").value;
    const allNames = [...assignment.Assignees];

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Assignments")
      .doc(assignment.id)
      .update({
        Name: assName,
        Due: assDue,
        Text: assText,
        Assignees: allNames,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const newAss = {
      ...assignment,
      Name: assName,
      Due: assDue,
      Text: assText,
      Assignees: allNames,
    };

    dispatch(storeTeacherSingleAssignmentAction(newAss));
    history.push("teacher-assignment-view");
  };

  //   REMOVE
  const removeAssignee = (event) => {
    const name = event.target.getAttribute("id");
    const allStuds = [...assignment.Assignees];
    const filtered = allStuds.filter((stud) => stud !== name);

    const newAss = {
      ...assignment,
      Assignees: filtered,
    };
    dispatch(storeTeacherSingleAssignmentAction(newAss));
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

      <div>
        <div>
          <h1>Edit</h1>
          <button
            class="btn-lime"
            onClick={() => history.push("teacher-assignment-view")}
          >
            Back
          </button>
        </div>
        <hr />

        {/* Edit content here */}

        <div>
          <div>
            <h3>Assignment Name: </h3>
            <input id="tbAssName" type="text" defaultValue={assignment.Name} />
          </div>
          <div>
            <h3>Due Date: </h3>
            {assignment.Due ? (
              <input
                id={`daAssDue`}
                type="date"
                defaultValue={InputDateFormatter(assignment.Due)}
              />
            ) : null}
          </div>
          <div>{handleAssignment()}</div>

          {/* Assignees */}
          <div>
            <h3>Assignees:</h3>
            {handleAssignees()}
          </div>
          <br />
          <button class="btn-navy" onClick={saveAllChanges}>
            Save All Changes
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
