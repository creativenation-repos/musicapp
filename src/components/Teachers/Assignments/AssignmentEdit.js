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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faMinus } from "@fortawesome/free-solid-svg-icons";

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
          <h3 className="edit-ass-head">Assignment Prompt:</h3>
          <textarea
            className="ta"
            id="taAssText"
            defaultValue={assignment.Text}
          ></textarea>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <div>
            <h3 className="edit-ass-head">Assignment Prompt:</h3>
            <textarea
              className="ta"
              id="taAssPracText"
              defaultValue={assignment.Text}
            ></textarea>
          </div>
          <div>
            <h3 className="edit-ass-head">Repertoire:</h3>
            <input
              className="tb"
              id="tbPracReper"
              type="text"
              defaultValue={assignment.Repertoire}
            />
          </div>
          <div>
            <h3 className="edit-ass-head">Composer:</h3>
            <input
              className="tb"
              id="tbPracComp"
              type="text"
              defaultValue={assignment.Composer}
            />
          </div>
          <div>
            <h3 className="edit-ass-head">Tempo</h3>
            <input
              className="tb"
              id="tbPracTempo"
              type="text"
              defaultValue={assignment.Tempo}
            />
          </div>
          <div>
            <h3 className="edit-ass-head">Max Time</h3>
            <input
              className="tb"
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
          <div className="assignee-list" key={i}>
            <FontAwesomeIcon
              style={{ margin: "0", padding: "0", color: "#3E00F9" }}
              icon={faArrowRight}
            />
            <p className="assignee-stud">{stud}</p>
            <button
              id={stud}
              class="btn-remove-assignee"
              onClick={removeAssignee}
            >
              <FontAwesomeIcon icon={faMinus} />
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

      <div className="content">
        <div>
          <h1>Edit Asignment</h1>
          <button
            class="btn-back"
            onClick={() => history.push("teacher-assignment-view")}
          >
            Back
          </button>
        </div>

        {/* Edit content here */}

        <div className="white-background">
          <div>
            <h3 className="edit-ass-head">Assignment Name: </h3>
            <input
              className="tb"
              id="tbAssName"
              type="text"
              defaultValue={assignment.Name}
            />
          </div>
          <div>
            <h3 className="edit-ass-head">Due Date: </h3>
            {assignment.Due ? (
              <input
                className="dt"
                id={`daAssDue`}
                type="date"
                defaultValue={InputDateFormatter(assignment.Due)}
              />
            ) : null}
          </div>
          <div className="ass-type-block">{handleAssignment()}</div>

          {/* Assignees */}
          <div>
            <h3 className="edit-ass-head">Assignees:</h3>
            {handleAssignees()}
          </div>
          <br />
        </div>
        <button class="btnSaveChanges" onClick={saveAllChanges}>
          Save All Changes
        </button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
