import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";
import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import { teachers_Collection } from "../../../utils/firebase";
import { storeTeacherEventsGeneralInfoAction } from "../../../redux/actions";
import { create } from "sortablejs";

export default function EventNew() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const events = useSelector(
    (state) => state.storeTeacherEventsGeneralInfoReducer
  );

  //   POST
  const createEvent = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const eventID = `Event${rand1}${rand2}`;

    const name = document.querySelector("#tbName").value;
    const desc = document.querySelector("#taDesc").value;
    const color = document.querySelector("#tbColor").value;
    const start = FirebaseDate(document.querySelector("#daStart").value);
    const end = FirebaseDate(document.querySelector("#daEnd").value);

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(eventID)
      .set({
        Name: name,
        Desc: desc,
        Color: color,
        Start: start,
        End: end,
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allEvents = [...events];
    allEvents.push({
      id: eventID,
      Name: name,
      Desc: desc,
      Color: color,
      Start: start,
      End: end,
    });

    allEvents.sort((a, b) => (a.Start > b.Start ? 1 : -1));
    dispatch(storeTeacherEventsGeneralInfoAction(allEvents));
    history.push("/teacher-events");
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

      {/* Content */}
      <div>
        <h1>New Event</h1>

        <div>
          <h3>Name: </h3>
          <input id="tbName" type="text" placeholder="Name" />

          <h3>Desc: </h3>
          <textarea id="taDesc" placeholder="Description"></textarea>

          <h3>Color: </h3>
          <input id="tbColor" type="text" placeholder="Color" />

          <h3>Start: </h3>
          <input
            id={`daStart`}
            type="date"
            defaultValue={InputDateFormatter(GetToday())}
          />

          <h3>End: </h3>
          <input
            id={`daEnd`}
            type="date"
            defaultValue={InputDateFormatter(GetToday())}
          />
          <br />
          <br />
          <button onClick={createEvent} className="btn-navy">
            Create Event
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
