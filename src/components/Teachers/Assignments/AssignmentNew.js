import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import {
  storeTeacherNewAssignmentTypeAction,
  storeTeacherSingleAssignmentAction,
} from "../../../redux/actions";
import GetToday from "../../GetToday";
import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import { teachers_Collection } from "../../../utils/firebase";
import RandomString from "../../RandomString";

export default function AssignmentNew() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assTypeState = useSelector(
    (state) => state.storeTeacherNewAssignmentTypeReducer
  );

  // HANDLE
  const handleAssTypeForm = () => {
    if (assTypeState === "textual") {
      return (
        <div>
          <h2 className="ass-form-head">Textual Assignment</h2>
          <p className="ass-small-text">
            Insert short description of how the textual assignment will be
            displayed to the student.
          </p>
          <h3 className="ass-form-sub-head">Prompt</h3>
          <textarea
            className="ta"
            id="taAssTextualPrompt"
            placeholder="Prompt"
          ></textarea>
        </div>
      );
    } else if (assTypeState === "practice") {
      return (
        <div>
          <h2 className="ass-form-head">Practice Assignment</h2>
          <p className="ass-small-text">
            Insert short description of how the pratice assignment will be
            displayed to the student.
          </p>
          <h3 className="ass-form-sub-head">Prompt</h3>
          <textarea
            className="ta"
            id="taAssPracticePrompt"
            placeholder="Prompt"
          ></textarea>
          <h3 className="ass-form-sub-head">Repertoire</h3>
          <p
            className="ass-small-desc"
            style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}
          >
            "Violin Concerto in D Major, G Major Scale (3 Octaves), Etude No.
            12, Excerpt No. 1 Symphony No. 3"
          </p>
          <input
            className="tb"
            id="tbAssPracticeReper"
            type="text"
            placeholder="Repertoire"
          />
          <h3 className="ass-form-sub-head">Composer (optional)</h3>
          <p
            className="ass-small-desc"
            style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}
          >
            "Johann Sebastian Bach, Wolfgang Amadeus Mozart, Ludwig Van
            Beethoven, Philip Glass"
          </p>
          <input
            className="tb"
            id="tbAssPracticeComp"
            type="text"
            placeholder="Composer"
          />
          <h3 className="ass-form-sub-head">Tempo</h3>
          <p
            className="ass-small-desc"
            style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}
          >
            "144bpm, 60bpm-100bpm, 60bpm.70bpm.80bpm"
          </p>
          <input
            className="tb"
            id="tbAssPracticeTempo"
            type="text"
            placeholder="Tempo"
          />
          <h3 className="ass-form-sub-head">Max Time for Completion</h3>
          <p
            className="ass-small-desc"
            style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}
          >
            Students will not be shown this number. However, if the student
            exceeds the maximum amount of practice for this assignment, the
            teacher will be notified. Please enter in number form.
          </p>
          <input
            className="tb"
            id="tbAssPracticeMax"
            type="text"
            placeholder="Max Time"
          />{" "}
          minutes
        </div>
      );
    }
  };

  //   POST
  const saveNewAssignment = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const assID = `Ass${rand1}${rand2}`;

    const assName = document.querySelector("#tbAssName").value;
    const assDesc = document.querySelector("#taAssDesc").value;
    const assDue = FirebaseDate(document.querySelector("#daAssDue").value);

    if (assTypeState === "textual") {
      const textPrompt = document.querySelector("#taAssTextualPrompt").value;

      //   Save to DB
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Assignments")
        .doc(assID)
        .set({
          Assignees: [],
          Date: GetToday(),
          Desc: assDesc,
          Due: assDue,
          Name: assName,
          Text: textPrompt,
          Type: "Textual",
          Teacher: teacherAuthID,
        })
        .catch((err) => console.log(err));

      // Dispatch
      dispatch(
        storeTeacherSingleAssignmentAction({
          id: assID,
          Assignees: [],
          Date: GetToday(),
          Desc: assDesc,
          Due: assDue,
          Name: assName,
          Text: textPrompt,
          Type: "Textual",
          Teacher: teacherAuthID,
        })
      );
    } else if (assTypeState === "practice") {
      const pracPrompt = document.querySelector("#taAssPracticePrompt").value;
      const pracReper = document.querySelector("#tbAssPracticeReper").value;
      const pracComp = document.querySelector("#tbAssPracticeComp").value;
      const pracTempo = document.querySelector("#tbAssPracticeTempo").value;
      const pracMax = document.querySelector("#tbAssPracticeMax").value;

      //   Save to DB
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Assignments")
        .doc(assID)
        .set({
          Assignees: [],
          Date: GetToday(),
          Desc: assDesc,
          Due: assDue,
          Name: assName,
          Text: pracPrompt,
          Repertoire: pracReper,
          Composer: pracComp,
          Tempo: pracTempo,
          MaxTime: pracMax,
          Type: "Practice",
        })
        .catch((err) => console.log(err));

      // Dispatch
      dispatch(
        storeTeacherSingleAssignmentAction({
          id: assID,
          Assignees: [],
          Date: GetToday(),
          Desc: assDesc,
          Due: assDue,
          Name: assName,
          Text: pracPrompt,
          Repertoire: pracReper,
          Composer: pracComp,
          Tempo: pracTempo,
          MaxTime: pracMax,
          Type: "Practice",
        })
      );
    }

    history.push("/teacher-assignment-view");
  };

  // EVENTS
  const OnAssType = () => {
    const raTextual = document.querySelector("#raTextual").checked;
    const raPractice = document.querySelector("#raPractice").checked;

    if (raTextual) {
      dispatch(storeTeacherNewAssignmentTypeAction("textual"));
    } else if (raPractice) {
      dispatch(storeTeacherNewAssignmentTypeAction("practice"));
    }
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
        <h1>Create New Assignment</h1>

        {/* Form */}
        <div>
        <button
              onClick={() => history.push("/teacher-assignments")}
              className="btn-back"
            >
              Back
            </button>
          <div className="white-background">
            
            <h3 className="edit-ass-head">Assignment Name:</h3>
            <input
              className="tb"
              id="tbAssName"
              type="text"
              placeholder="Name"
            />

            <h3 className="edit-ass-head">Description:</h3>
            <textarea
              className="ta"
              id="taAssDesc"
              placeholder="Description"
            ></textarea>
          </div>
          <div className="white-background">
            <h3 className="edit-ass-head">Assignment Type:</h3>
            <div className="ra-ass-group">
              <input
                onChange={OnAssType}
                type="radio"
                id="raTextual"
                name="raAssType"
                value="Textual"
              />
              <label>Textual</label>
            </div>
            <div className="ra-ass-group">
              {" "}
              <input
                onChange={OnAssType}
                type="radio"
                id="raPractice"
                name="raAssType"
                value="Practice"
              />
              <label>Practice</label>
            </div>
            <div className="ass-type-form">{handleAssTypeForm()}</div>
          </div>
          <div className="white-background">
            <h3 className="edit-ass-head">Due Date:</h3>
            <input
              className="dt"
              id="daAssDue"
              type="date"
              defaultValue={InputDateFormatter(GetToday())}
            />
          </div>
          <div>
            <button className="btnSaveChanges" onClick={saveNewAssignment}>
              Save Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
