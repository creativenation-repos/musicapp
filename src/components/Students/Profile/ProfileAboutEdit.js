import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";
import {
  storeStudentAboutAction,
  storeStudentExpAction,
  toggleNewExpFormAction,
  toggleNewInstrumentFormAction,
} from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";

export default function ProfileAboutEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const about = useSelector((state) => state.storeStudentAboutReducer);
  const exps = useSelector((state) => state.storeStudentExpReducer);

  const toggleNewExpForm = useSelector(
    (state) => state.toggleNewExpFormReducer
  );
  const toggleNewInstrumentForm = useSelector(
    (state) => state.toggleNewInstrumentFormReducer
  );

  // HANDLE
  const handleEditExp = () => {
    return exps.map((exp, i) => {
      return (
        <div>
          <div>
            <h3>Institution</h3>
            <input
              id={`tbInstEdit${i}`}
              type="text"
              defaultValue={exp.Institution}
            />
          </div>
          <div>
            <h3>Description</h3>
            <textarea id={`taDescEdit${i}`} defaultValue={exp.Desc} />
          </div>
          <div>
            <h3>Started</h3>
            <input
              type="date"
              id={`daStart${i}`}
              defaultValue={InputDateFormatter(exp.Start)}
            ></input>
          </div>

          <div>
            <h3>Ended</h3>
            <input
              type="date"
              id={`daEnd${i}`}
              defaultValue={InputDateFormatter(exp.End)}
            ></input>
          </div>
          <button id={exp.id} onClick={removeExp}>
            Remove
          </button>
          <hr />
        </div>
      );
    });
  };
  const handleInstruments = () => {
    if (about.Instruments) {
      return about.Instruments.map((ins, i) => {
        return (
          <div key={i}>
            <input id={`tbInstrument${i}`} type="text" defaultValue={ins} />
            <button id={ins} onClick={removeInstrument}>
              -
            </button>
          </div>
        );
      });
    }
  };
  const handleNewExp = () => {
    return (
      <div>
        <div>
          <h3>Institution</h3>
          <input id="tbNewInstitution" type="text" placeholder="Institution" />
        </div>
        <div>
          <h3>Description</h3>
          <textarea id="tbNewDesc" placeholder="Description"></textarea>
        </div>
        <div>
          <h3>Started</h3>
          <input
            type="date"
            id="daNewStarted"
            defaultValue={InputDateFormatter(GetToday())}
          />
        </div>
        <div>
          <h3>Ended</h3>
          <input
            type="date"
            id="daNewEnded"
            defaultValue={InputDateFormatter(GetToday())}
          />
        </div>

        <button onClick={saveExp}>Apply</button>
      </div>
    );
  };
  const handleNewInstrument = () => {
    return (
      <div>
        <input id="tbNewInstrument" type="text" placeholder="Instrument" />
        <button onClick={saveInstrument}>Apply</button>
      </div>
    );
  };

  //   POST
  const saveExp = () => {
    const institution = document.querySelector("#tbNewInstitution").value;
    const desc = document.querySelector("#tbNewDesc").value;
    const started = FirebaseDate(document.querySelector("#daNewStarted").value);
    const ended = FirebaseDate(document.querySelector("#daNewEnded").value);

    const rand1 = RandomString();
    const rand2 = RandomString();
    const expID = `Exp${rand1}${rand2}`;

    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks")
      .doc(expID)
      .set({
        Institution: institution,
        Desc: desc,
        Start: started,
        End: ended,
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allExp = [...exps];
    allExp.push({
      id: expID,
      Institution: institution,
      Desc: desc,
      Start: started,
      End: ended,
    });

    dispatch(storeStudentExpAction(allExp));
    dispatch(toggleNewExpFormAction());
  };
  const saveInstrument = () => {
    const instrument = document.querySelector("#tbNewInstrument").value;
    const allInstruments = [...about.Instruments];
    allInstruments.push(instrument);
    //   Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        Instruments: [...allInstruments],
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const aboutObj = { ...about };
    aboutObj.Instruments = [...allInstruments];

    dispatch(storeStudentAboutAction(aboutObj));
    dispatch(toggleNewInstrumentFormAction());
  };
  const saveAllChanges = () => {
    const aboutText = document.querySelector("#taAboutText").value;

    const expCount = exps.length;
    const instCount = about.Instruments.length;

    const allExp = [];
    const allInst = [];

    for (let i = 0; i < expCount; i = i + 1) {
      const expIns = document.querySelector(`#tbInstEdit${i}`).value;
      const expDesc = document.querySelector(`#taDescEdit${i}`).value;
      const expStart = document.querySelector(`#daStart${i}`).value;
      const expEnd = document.querySelector(`#daEnd${i}`).value;

      const tempObj = {
        id: exps[i].id,
        Institution: expIns,
        Desc: expDesc,
        Start: FirebaseDate(expStart),
        End: FirebaseDate(expEnd),
      };

      allExp.push(tempObj);
    }

    for (let i = 0; i < instCount; i = i + 1) {
      const ins = document.querySelector(`#tbInstrument${i}`).value;
      allInst.push(ins);
    }

    const location = document.querySelector("#tbLocation").value;

    // Save to DB

    // About
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        About: aboutText,
        Location: location,
        Instruments: [...allInst],
      })
      .catch((err) => console.log(err));

    //   Experience
    allExp.forEach((ex) => {
      students_Collection
        .doc(studentAuthID)
        .collection("Profile")
        .doc("Experience")
        .collection("ExpBlocks")
        .doc(ex.id)
        .update({
          Institution: ex.Institution,
          Desc: ex.Desc,
          Start: ex.Start,
          End: ex.End,
        })
        .catch((err) => console.log(err));
    });

    // Dispatch

    // About
    about.About = aboutText;
    about.Instruments = [...allInst];
    about.Location = location;

    history.push("/student-profile/about");
  };

  //   REMOVE
  const removeExp = (event) => {
    const expID = event.target.getAttribute("id");

    // Remove from DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks")
      .doc(expID)
      .delete()
      .catch((err) => console.log(err));

    //   Dispatch
    const allExp = [...exps];
    const filtered = allExp.filter((ex) => ex.id !== expID);

    dispatch(storeStudentExpAction(filtered));
  };
  const removeInstrument = (event) => {
    const instrument = event.target.getAttribute("id");

    const allInstruments = [...about.Instruments];
    const filtered = allInstruments.filter((inst) => inst !== instrument);

    // Remove from DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        Instruments: [...filtered],
      })
      .catch((err) => console.log(err));

    //   Dispatch

    const aboutObj = { ...about };
    aboutObj.Instruments = [...filtered];

    dispatch(storeStudentAboutAction(aboutObj));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* About */}
      <div>
        <h2>About</h2>
        <textarea id="taAboutText" defaultValue={about.About}></textarea>
      </div>

      {/* Experience */}
      <div>
        <h2>Experience</h2>
        <div>{handleEditExp()}</div>
        <div>{toggleNewExpForm ? handleNewExp() : null}</div>
        <br />
        <button onClick={() => dispatch(toggleNewExpFormAction())}>
          {toggleNewExpForm ? "Close" : "Add Experience"}
        </button>
      </div>

      {/* Persona; */}
      <div>
        <h2>Personal</h2>
        <h3>Location:</h3>
        <input type="text" id="tbLocation" defaultValue={about.Location} />
        <h3>Instruments:</h3>
        {/* instruments */}
        {handleInstruments()}
        <br />
        {toggleNewInstrumentForm ? handleNewInstrument() : null}
        <button onClick={() => dispatch(toggleNewInstrumentFormAction())}>
          {toggleNewInstrumentForm ? "Close" : "+"}
        </button>
      </div>
      <br />
      <button onClick={saveAllChanges}>Save All Changes</button>
    </div>
  );
}
