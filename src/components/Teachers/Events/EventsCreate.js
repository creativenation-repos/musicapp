import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

import {
  storeTeacherEventColorAction,
  storeTeacherEventsAction,
} from "../../../redux/actions";
import FirebaseDate from "../../FirebaseDate";
import { teachers_Collection } from "../../../utils/firebase";
import RandomString from "../../RandomString";

export default function EventsCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const color = useSelector((state) => state.storeTeacherEventColorReducer);
  const events = useSelector((state) => state.storeTeacherEventsReducer);

  //   POST
  const createEvent = () => {
    const eventName = document.querySelector("#tbEveName").value;
    const eventStart = FirebaseDate(document.querySelector("#daStart").value);
    const eventEnd = FirebaseDate(document.querySelector("#daEnd").value);
    const eventColor = color;
    const eventDesc = document.querySelector("#taDesc").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const eveID = `Event${rand1}${rand2}`;

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(eveID)
      .set({
        Name: eventName,
        Start: eventStart,
        End: eventEnd,
        Color: eventColor,
        Desc: eventDesc,
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allEvents = [...events];
    allEvents.push({
      id: eveID,
      Name: eventName,
      Start: eventStart,
      End: eventEnd,
      Color: eventColor,
      Desc: eventDesc,
    });

    dispatch(storeTeacherEventsAction(allEvents));
    history.push("/teacher-events");
  };

  //   CLICK
  const onColorClick = (event) => {
    const colorID = event.currentTarget.getAttribute("id");

    const divGreen = document.querySelector("#btnGreen");
    const divBlue = document.querySelector("#btnBlue");
    const divRed = document.querySelector("#btnRed");
    const divPurple = document.querySelector("#btnPurple");
    const divYellow = document.querySelector("#btnYellow");

    if (colorID === "btnGreen") {
      divGreen.classList.add("dark-border");
      divBlue.classList.remove("dark-border");
      divRed.classList.remove("dark-border");
      divPurple.classList.remove("dark-border");
      divYellow.classList.remove("dark-border");

      dispatch(storeTeacherEventColorAction("green"));
    } else if (colorID === "btnBlue") {
      divGreen.classList.remove("dark-border");
      divBlue.classList.add("dark-border");
      divRed.classList.remove("dark-border");
      divPurple.classList.remove("dark-border");
      divYellow.classList.remove("dark-border");

      dispatch(storeTeacherEventColorAction("blue"));
    } else if (colorID === "btnRed") {
      divGreen.classList.remove("dark-border");
      divBlue.classList.remove("dark-border");
      divRed.classList.add("dark-border");
      divPurple.classList.remove("dark-border");
      divYellow.classList.remove("dark-border");
      dispatch(storeTeacherEventColorAction("red"));
    } else if (colorID === "btnPurple") {
      divGreen.classList.remove("dark-border");
      divBlue.classList.remove("dark-border");
      divRed.classList.remove("dark-border");
      divPurple.classList.add("dark-border");
      divYellow.classList.remove("dark-border");
      dispatch(storeTeacherEventColorAction("purple"));
    } else if (colorID === "btnYellow") {
      divGreen.classList.remove("dark-border");
      divBlue.classList.remove("dark-border");
      divRed.classList.remove("dark-border");
      divPurple.classList.remove("dark-border");
      divYellow.classList.add("dark-border");
      dispatch(storeTeacherEventColorAction("yellow"));
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
        <h1>New Event</h1>
        <button
          className="btn-back"
          onClick={() => history.push("/teacher-events")}
        >
          Back
        </button>

        <div className="white-background">
          <p className="eve-view-head">Event Name:</p>
          <input
            className="tb"
            id="tbEveName"
            type="text"
            placeholder="Event Name"
          />
          <br />
          <br />
          <p className="eve-view-head">Start:</p>
          <input type="date" id="daStart" className="dt" />
          <br />
          <p className="eve-view-head">End:</p>
          <input type="date" id="daEnd" className="dt" />
          <br />

          {/* COLOR */}
          <p className="eve-view-head">Color:</p>
          <div style={{ display: "flex" }}>
            {/* GREEN */}
            <div
              onClick={onColorClick}
              id="btnGreen"
              style={{
                width: "fit-content",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            >
              <button
                style={{ backgroundColor: "green" }}
                className="btn-eve-create-color"
              ></button>
            </div>
            {/* BLUE */}
            <div
              onClick={onColorClick}
              id="btnBlue"
              style={{
                width: "fit-content",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            >
              <button
                style={{ backgroundColor: "blue" }}
                className="btn-eve-create-color"
              ></button>
            </div>
            {/* RED */}
            <div
              onClick={onColorClick}
              id="btnRed"
              style={{
                width: "fit-content",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            >
              <button
                style={{ backgroundColor: "red" }}
                className="btn-eve-create-color"
              ></button>
            </div>
            {/* PURPLE */}
            <div
              onClick={onColorClick}
              id="btnPurple"
              style={{
                width: "fit-content",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            >
              <button
                style={{ backgroundColor: "#3E00F9" }}
                className="btn-eve-create-color"
              ></button>
            </div>
            {/* YELLOW */}
            <div
              onClick={onColorClick}
              id="btnYellow"
              style={{
                width: "fit-content",
                borderRadius: "30px",
                marginRight: "10px",
              }}
            >
              <button
                style={{ backgroundColor: "yellow" }}
                className="btn-eve-create-color"
              ></button>
            </div>
          </div>
          {/*  */}

          <br />

          <p className="eve-view-head">Description:</p>
          <textarea
            id="taDesc"
            className="ta"
            placeholder="Description..."
          ></textarea>
        </div>

        <button onClick={createEvent} className="btnSaveChanges">Create</button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
