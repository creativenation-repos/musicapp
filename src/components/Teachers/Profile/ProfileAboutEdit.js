import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  toggleNewExperienceFormAction,
  storeProfileExperienceDataAction,
  storeProfileAboutDataAction,
  toggleNewInstrumentFormAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import firebase from "../../../utils/firebase";

export default function ProfileAboutEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const about = useSelector((state) => state.storeProfileAboutDataReducer);
  const exp = useSelector((state) => state.storeProfileExperienceDataReducer);

  const toggleExpState = useSelector(
    (state) => state.toggleNewExperienceFormReducer
  );
  const toggleInsState = useSelector(
    (state) => state.toggleNewInstrumentFormReducer
  );

  const saveAllChanges = () => {
    // About Section
    const aboutText = document.querySelector("#taAboutDescText").value;

    // Experience Section
    const newExperienceArray = [];

    const expCount = exp.length;
    for (let i = 0; i < expCount; i = i + 1) {
      const tbInstitution = document.querySelector(`#tbExpInstText${i}`).value;
      const tbDesc = document.querySelector(`#taExpDescText${i}`).value;
      const daStarted = document.querySelector(`#dtStarted${i}`).value;
      const daEnded = document.querySelector(`#dtEnded${i}`).value;

      const startedSplit = daStarted.split("-");
      const endedSplit = daEnded.split("-");

      const startedDate = firebase.firestore.Timestamp.fromDate(
        new Date(`${startedSplit[1]} ${startedSplit[2]}, ${startedSplit[0]}`)
      );
      const endedDate = firebase.firestore.Timestamp.fromDate(
        new Date(`${endedSplit[1]} ${endedSplit[2]}, ${endedSplit[0]}`)
      );

      newExperienceArray.push({
        id: exp[i].id,
        Institution: tbInstitution,
        Desc: tbDesc,
        Start: startedDate,
        End: endedDate,
      });
    }

    // Personal
    const email = document.querySelector("#tbEmailText").value;
    const location = document.querySelector("#tbLocationText").value;

    const insArray = [];
    const insCount = about.Instruments.length;
    for (let i = 0; i < insCount; i = i + 1) {
      const tbInstrument = document.querySelector(`#tbInstruments${i}`).value;

      insArray.push(tbInstrument);
    }

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        About: aboutText,
        Email: email,
        Location: location,
        Instruments: insArray,
        Joined: about.Joined,
      })
      .catch((err) => console.log(err));

    newExperienceArray.forEach((ex) => {
      teachers_Collection
        .doc(teacherAuthID)
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
    const tempAbout = {
      About: aboutText,
      Email: email,
      Location: location,
      Instruments: insArray,
      Joined: about.Joined,
    };

    const tempExp = [...newExperienceArray];

    dispatch(storeProfileAboutDataAction(tempAbout));
    dispatch(storeProfileExperienceDataAction(tempExp));

    history.push("/teacher-profile/about");
  };

  const applyNewExperience = () => {
    let rand1 = Math.random().toString(36).substring(3);
    let rand2 = Math.random().toString(36).substring(3);
    const expBlockID = `ExpBlock${rand1}${rand2}`;

    const institution = document.querySelector("#tbInstText").value;
    const desc = document.querySelector("#tbDescText").value;
    const started = document.querySelector("#daStartDate").value;
    const ended = document.querySelector("#daEndDate").value;

    const startedSplit = started.split("-");
    const endedSplit = ended.split("-");

    const startedDate = firebase.firestore.Timestamp.fromDate(
      new Date(`${startedSplit[1]} ${startedSplit[2]}, ${startedSplit[0]}`)
    );
    const endedDate = firebase.firestore.Timestamp.fromDate(
      new Date(`${endedSplit[1]} ${endedSplit[2]}, ${endedSplit[0]}`)
    );

    // Save to database
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks")
      .doc(expBlockID)
      .set({
        Institution: institution,
        Desc: desc,
        Start: startedDate,
        End: endedDate,
      })
      .catch((err) => console.log(err));

    // dispatch new exp
    const allExp = [...exp];

    allExp.push({
      id: expBlockID,
      Institution: institution,
      Desc: desc,
      Start: startedDate,
      End: endedDate,
    });

    console.log(allExp);

    dispatch(storeProfileExperienceDataAction(allExp));
    dispatch(toggleNewExperienceFormAction());
  };

  const removeExperience = (event) => {
    const exID = event.target.getAttribute("id");

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks")
      .doc(exID)
      .delete()
      .catch((err) => console.log(err));

    const allExp = [...exp];

    const filtered = allExp.filter((ex) => ex.id !== exID);

    dispatch(storeProfileExperienceDataAction(filtered));
  };

  const removeInstrument = (event) => {
    const instrument = event.target.getAttribute("id");
    const allInstruments = [...about.Instruments];

    const newList = allInstruments.filter((ins) => ins !== instrument);

    const newObj = {
      ...about,
      Instruments: newList,
    };

    // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        Instruments: firebase.firestore.FieldValue.arrayRemove(instrument),
      })
      .catch((err) => console.log(err));

    dispatch(storeProfileAboutDataAction(newObj));
  };

  const addInstrument = () => {
    const newIns = document.querySelector("#tbNewInsText").value;

    // Add to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("About")
      .update({
        Instruments: firebase.firestore.FieldValue.arrayUnion(newIns),
      })
      .catch((err) => console.log(err));

    // dispatch
    const newInstruments = [...about.Instruments];
    newInstruments.push(newIns);

    const newObj = {
      ...about,
      Instruments: newInstruments,
    };

    dispatch(storeProfileAboutDataAction(newObj));
    dispatch(toggleNewInstrumentFormAction());
  };

  // HANDLE
  const handleCurrPage = () => {
    let feedBtn = document.querySelector("#link-feed");
    feedBtn.classList.remove("navy-back");

    let aboutBtn = document.querySelector("#link-about");
    aboutBtn.classList.add("navy-back");

    let awardsBtn = document.querySelector("#link-awards");
    awardsBtn.classList.remove("navy-back");

    let galleryBtn = document.querySelector("#link-gallery");
    galleryBtn.classList.remove("navy-back");

    let reviewsBtn = document.querySelector("#link-reviews");
    reviewsBtn.classList.remove("navy-back");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    handleCurrPage();
  }, []);
  return (
    <div className="post-edit-wrapper">
      <div>
        <button
          className="btn-back maroon-back"
          onClick={() => history.push("/teacher-profile/about")}
        >
          Back
        </button>
      </div>

      <div className="post-create">
        <div>
          <h2>About</h2>
          <textarea id="taAboutDescText" defaultValue={about.About}></textarea>
        </div>

        <div>
          <h2>Experience</h2>
          {exp.map((ex, i) => {
            const start = `${ex.Start.toDate().getFullYear()}-${
              ex.Start.toDate().getMonth() + 1 < 10 ? "0" : ""
            }${ex.Start.toDate().getMonth() + 1}-${
              ex.Start.toDate().getDate() < 10 ? "0" : ""
            }${ex.Start.toDate().getDate()}`;

            const end = `${ex.End.toDate().getFullYear()}-${
              ex.End.toDate().getMonth() + 1 < 10 ? "0" : ""
            }${ex.End.toDate().getMonth() + 1}-${
              ex.End.toDate().getDate() < 10 ? "0" : ""
            }${ex.End.toDate().getDate()}`;

            return (
              <div key={i}>
                <h4>Institution</h4>
                <input
                  id={`tbExpInstText${i}`}
                  type="text"
                  defaultValue={ex.Institution}
                />
                <h4>Description</h4>
                <textarea
                  id={`taExpDescText${i}`}
                  defaultValue={ex.Desc}
                ></textarea>
                <h4>Started</h4>
                <input id={`dtStarted${i}`} type="date" defaultValue={start} />
                <h4>Ended</h4>
                <input id={`dtEnded${i}`} type="date" defaultValue={end} />
                <button id={ex.id} onClick={removeExperience}>
                  Remove
                </button>
                <hr />
              </div>
            );
          })}

          {toggleExpState ? (
            <div>
              <button
                onClick={() => {
                  dispatch(toggleNewExperienceFormAction());
                }}
              >
                Cancel
              </button>
              {/* Form */}
              <div>
                <h3>Institution</h3>
                <input id="tbInstText" type="text" placeholder="Institution" />
              </div>
              <div>
                <h3>Description</h3>
                <textarea id="tbDescText" placeholder="Description"></textarea>
              </div>
              <div>
                <h3>Started: </h3>
                <input id="daStartDate" type="date" />
              </div>
              <div>
                <h3>Ended: </h3>
                <input id="daEndDate" type="date" />
              </div>
              <div>
                <button onClick={applyNewExperience}>Apply</button>
              </div>
            </div>
          ) : (
            <button onClick={() => dispatch(toggleNewExperienceFormAction())}>
              +
            </button>
          )}
        </div>
        <div>
          <h2>Personal</h2>
          <p>Email:</p>
          <input id="tbEmailText" type="text" defaultValue={about.Email} />
          <p>Location:</p>
          <input
            id="tbLocationText"
            type="text"
            defaultValue={about.Location}
          />
          <p>Instruments: </p>
          {about.Instruments
            ? about.Instruments.map((ins, i) => {
                return (
                  <div key={i}>
                    <input
                      id={`tbInstruments${i}`}
                      type="text"
                      defaultValue={ins}
                    />
                    <button id={ins} onClick={removeInstrument}>
                      -
                    </button>
                  </div>
                );
              })
            : null}
          {about.Joined ? (
            <div>
              {/* Toggle Instrument Add */}
              {toggleInsState ? (
                <div>
                  <div>
                    <button
                      onClick={() => {
                        dispatch(toggleNewInstrumentFormAction());
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <h3>Instrument</h3>
                  <input
                    id="tbNewInsText"
                    type="text"
                    placeholder="Instrument"
                  />
                  <div>
                    <button onClick={addInstrument}>Apply</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    dispatch(toggleNewInstrumentFormAction());
                  }}
                >
                  +
                </button>
              )}

              <p>Joined: {about.Joined.toDate().toString().substr(4, 11)}</p>
            </div>
          ) : null}
        </div>
        <button onClick={saveAllChanges}>Save All Changes</button>
      </div>
    </div>
  );
}
