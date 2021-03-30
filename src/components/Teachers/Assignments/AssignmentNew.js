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
          <h2>Textual Assignment</h2>
          <p>
            Insert short description of how the textual assignment will be
            displayed to the student.
          </p>
          <h3>Prompt</h3>
          <textarea id="taAssTextualPrompt" placeholder="Prompt"></textarea>
        </div>
      );
    } else if (assTypeState === "practice") {
      return (
        <div>
          <h2>Practice Form</h2>
          <p>
            Insert short description of how the pratice assignment will be
            displayed to the student.
          </p>
          <h3>Prompt</h3>
          <textarea id="taAssPracticePrompt" placeholder="Prompt"></textarea>
          <h3>Repertoire</h3>
          <p style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
            "Violin Concerto in D Major, G Major Scale (3 Octaves), Etude No.
            12, Excerpt No. 1 Symphony No. 3"
          </p>
          <input id="tbAssPracticeReper" type="text" placeholder="Repertoire" />
          <h3>Composer (optional)</h3>
          <p style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
            "Johann Sebastian Bach, Wolfgang Amadeus Mozart, Ludwig Van
            Beethoven, Philip Glass"
          </p>
          <input id="tbAssPracticeComp" type="text" placeholder="Composer" />
          <h3>Tempo</h3>
          <p style={{ color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
            "144bpm, 60bpm-100bpm, 60bpm.70bpm.80bpm"
          </p>
          <input id="tbAssPracticeTempo" type="text" placeholder="Tempo" />
          <h3>Max Time for Completion</h3>
          <p>
            Students will not be shown this number. However, if the student
            exceeds the maximum amount of practice for this assignment, the
            teacher will be notified. Please enter in number form.
          </p>
          <input id="tbAssPracticeMax" type="text" placeholder="Max Time" />{" "}
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
      <div>
        <h1>Create New Assignment</h1>
        <br />

        {/* Form */}
        <div>
          <div>
            <h3>Assignment Name:</h3>
            <input id="tbAssName" type="text" placeholder="Name" />
          </div>
          <div>
            <h3>Description:</h3>
            <textarea id="taAssDesc" placeholder="Description"></textarea>
          </div>
          <div>
            <h3>Assignment Type:</h3>
            <input
              onChange={OnAssType}
              type="radio"
              id="raTextual"
              name="raAssType"
              value="Textual"
            />
            <label>Textual</label>
            <input
              onChange={OnAssType}
              type="radio"
              id="raPractice"
              name="raAssType"
              value="Practice"
            />
            <label>Practice</label>
            <br />
            {handleAssTypeForm()}
          </div>
          <div>
            <h3>Due Date:</h3>
            <input
              id="daAssDue"
              type="date"
              defaultValue={InputDateFormatter(GetToday())}
            />
          </div>
          <div>
            <button onClick={saveNewAssignment}>Save Assignment</button>
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
