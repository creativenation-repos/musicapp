import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";
import FirebaseDate from "../../FirebaseDate";

import {
  storeTeacherEventAction,
  storeTeacherEventColorAction,
  storeTeacherEventsAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import InputDateFormatter from "../../InputDateFormatter";

export default function EventsEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.storeTeacherEventsReducer);
  const event = useSelector((state) => state.storeTeacherEventReducer);
  const color = useSelector((state) => state.storeTeacherEventColorReducer);

  //   CLICK
  const onColorClick = (event) => {
    let colorID;
    const colorCapitalized = color.charAt(0).toUpperCase() + color.slice(1);
    if (event === undefined) {
      colorID = `btn${colorCapitalized}`;
    } else {
      colorID = event.currentTarget.getAttribute("id");
    }

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

  //   POST
  const saveChanges = () => {
    const eventName = document.querySelector("#tbEveName").value;
    const eventStart = FirebaseDate(document.querySelector("#daStart").value);
    const eventEnd = FirebaseDate(document.querySelector("#daEnd").value);
    const eventColor = color;
    const eventDesc = document.querySelector("#taDesc").value;

    // Update in DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(event.id)
      .update({
        Name: eventName,
        Start: eventStart,
        End: eventEnd,
        Color: eventColor,
        Desc: eventDesc,
      })
      .catch((err) => console.log(err));

    //   Dispatch
    dispatch(
      storeTeacherEventAction({
        id: event.id,
        Name: eventName,
        Start: eventStart,
        End: eventEnd,
        Color: eventColor,
        Desc: eventDesc,
      })
    );

    const allEvents = [...events];
    allEvents.forEach((eve) => {
      if (eve.id === event.id) {
        eve = {
          id: event.id,
          Name: eventName,
          Start: eventStart,
          End: eventEnd,
          Color: eventColor,
          Desc: eventDesc,
        };

        dispatch(storeTeacherEventsAction(allEvents));
      }
    });

    history.push("/teacher-event-view");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    onColorClick();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Edit Event</h1>
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
            defaultValue={event.Name}
          />
          <br />
          <br />
          <p className="eve-view-head">Start:</p>
          <input
            type="date"
            id="daStart"
            className="dt"
            defaultValue={InputDateFormatter(event.Start)}
          />
          <br />
          <p className="eve-view-head">End:</p>
          <input
            type="date"
            id="daEnd"
            className="dt"
            defaultValue={InputDateFormatter(event.End)}
          />
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
            defaultValue={event.Desc}
          ></textarea>
        </div>

        <button onClick={saveChanges} className="btnSaveChanges">
          Save Changes
        </button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
