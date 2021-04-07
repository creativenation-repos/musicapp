import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import { teachers_Collection } from "../../../utils/firebase";
import {
  storeSingleMonthEventAction,
  storeTeacherEventsGeneralInfoAction,
  toggleAddEventInviteeAction,
  toggleAssigneeFormAction,
} from "../../../redux/actions";

export default function EventEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleAddInviteeForm = useSelector(
    (state) => state.toggleAddEventInviteeReducer
  );
  const events = useSelector(
    (state) => state.storeTeacherEventsGeneralInfoReducer
  );
  const eve = useSelector((state) => state.storeSingleMonthEventReducer);

  // HANDLE
  const handleEventEdit = () => {
    return (
      <div>
        <h3>Name: </h3>
        <input id="tbName" type="text" defaultValue={eve.Name} />

        <h3>Desc: </h3>
        <textarea id="taDesc" defaultValue={eve.Desc}></textarea>

        <h3>Color: </h3>
        <input id="tbColor" type="text" defaultValue={eve.Color} />

        <h3>Start: </h3>
        <input
          id="daStart"
          type="date"
          defaultValue={eve.Start ? InputDateFormatter(eve.Start) : null}
        />

        <h3>End: </h3>
        <input
          id="daEnd"
          type="date"
          defaultValue={eve.End ? InputDateFormatter(eve.End) : null}
        />

        <h3>Invitees:</h3>
        {eve.Invitees
          ? eve.Invitees.map((ei, i) => {
              return (
                <div>
                  <input
                    key={i}
                    id={`tbinvitee${i}`}
                    type="text"
                    defaultValue={ei}
                  />{" "}
                  <button id={ei} onClick={removeInvitee}>
                    -
                  </button>
                </div>
              );
            })
          : null}
        {toggleAddInviteeForm ? (
          <div>
            <p>Enter Invitee Username:</p>
            <input id="tbAddInvitee" type="text" placeholder="Username" />
            <button onClick={addInvitee}>Add</button>
          </div>
        ) : null}

        <button onClick={() => dispatch(toggleAddEventInviteeAction())}>
          +
        </button>
      </div>
    );
  };

  // POST
  const saveAllChanges = () => {
    const name = document.querySelector("#tbName").value;
    const desc = document.querySelector("#taDesc").value;
    const color = document.querySelector("#tbColor").value;
    const start = FirebaseDate(document.querySelector("#daStart").value);
    const end = FirebaseDate(document.querySelector("#daEnd").value);
    const invitees = [...eve.Invitees];

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(eve.id)
      .update({
        Name: name,
        Desc: desc,
        Color: color,
        Start: start,
        End: end,
        Invitees: invitees,
      });

    // Dispatch
    const tempObj = {
      id: eve.id,
      Name: name,
      Desc: desc,
      Color: color,
      Start: start,
      End: end,
      Invitees: invitees,
    };

    dispatch(storeSingleMonthEventAction(tempObj));

    const allEvents = [...events];

    const filtered = allEvents.filter((ev) => ev.id !== eve.id);
    filtered.push(tempObj);
    filtered.sort((a, b) => (a.Start > b.Start ? 1 : -1));
    dispatch(storeTeacherEventsGeneralInfoAction(filtered));

    history.push("/teacher-event-view");
  };
  const addInvitee = () => {
    const invitee = document.querySelector("#tbAddInvitee").value;

    const allInvs = [...eve.Invitees];
    allInvs.push(invitee);

    const tempObj = {
      ...eve,
      Invitees: allInvs,
    };

    dispatch(storeSingleMonthEventAction(tempObj));
    dispatch(toggleAddEventInviteeAction());
  };

  // REMOVE
  const removeInvitee = (event) => {
    const invitee = event.target.getAttribute("id");

    const allInvs = [...eve.Invitees];
    const filtered = allInvs.filter((ee) => ee !== invitee);

    const tempObj = {
      ...eve,
      Invitees: filtered,
    };

    dispatch(storeSingleMonthEventAction(tempObj));
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
        <h1>{eve.Name}</h1>

        <div>{handleEventEdit()}</div>
        <br />
        <button onClick={saveAllChanges}>Save All Changes</button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
