import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import {
  storeTeacherAssignmentAssigneesAction,
  storeTeacherSingleAssignmentAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";

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
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <div>
            <h3>Assignment Prompt:</h3>
            <textarea
              id="taAssPracText"
              defaultValue={assignment.Text}
            ></textarea>
          </div>
          <div>
            <h3>Repertoire:</h3>
            <input
              id="tbPracReper"
              type="text"
              defaultValue={assignment.Repertoire}
            />
          </div>
          <div>
            <h3>Composer:</h3>
            <input
              id="tbPracComp"
              type="text"
              defaultValue={assignment.Composer}
            />
          </div>
          <div>
            <h3>Tempo</h3>
            <input
              id="tbPracTempo"
              type="text"
              defaultValue={assignment.Tempo}
            />
          </div>
          <div>
            <h3>Max Time</h3>
            <input
              id="tbPracMaxTime"
              type="text"
              defaultValue={assignment.MaxTime}
            />
          </div>
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
    const allNames = [...assignment.Assignees];

    if (assignment.Type === "Textual") {
      const assText = document.querySelector("#taAssText").value;

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
      dispatch(storeTeacherAssignmentAssigneesAction(allNames));
    } else if (assignment.Type === "Practice") {
      const assPrompt = document.querySelector("#taAssPracText").value;
      const assReper = document.querySelector("#tbPracReper").value;
      const assComp = document.querySelector("#tbPracComp").value;
      const assTempo = document.querySelector("#tbPracTempo").value;
      const assMaxTime = document.querySelector("#tbPracMaxTime").value;

      // Save to DB
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Assignments")
        .doc(assignment.id)
        .update({
          Name: assName,
          Due: assDue,
          Text: assPrompt,
          Repertoire: assReper,
          Composer: assComp,
          Tempo: assTempo,
          MaxTime: assMaxTime,
          Assignees: allNames,
        })
        .catch((err) => console.log(err));

      // Dispatch
      const newAss = {
        ...assignment,
        Name: assName,
        Due: assDue,
        Text: assPrompt,
        Repertoire: assReper,
        Composer: assComp,
        Tempo: assTempo,
        MaxTime: assMaxTime,
        Assignees: allNames,
      };

      dispatch(storeTeacherSingleAssignmentAction(newAss));
      dispatch(storeTeacherAssignmentAssigneesAction(allNames));
    }

    history.push("/teacher-assignment-view");
  };

  //   REMOVE
  const removeAssignee = (event) => {
    const name = event.target.getAttribute("id");
    const allStuds = [...assignment.Assignees];
    const filtered = allStuds.filter((stud) => stud !== name);

    // Remove from DB
    students_Collection
      .doc(name)
      .collection("AssignmentsInfo")
      .doc(assignment.id)
      .delete()
      .catch((err) => console.log(err));

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
