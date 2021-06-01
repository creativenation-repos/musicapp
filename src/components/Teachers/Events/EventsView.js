import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeTeacherEventColorAction } from "../../../redux/actions";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

export default function EventsView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.storeTeacherEventReducer);

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
        <h1>{event.Name}</h1>
        <button
          className="btn-back"
          onClick={() => history.push("/teacher-events")}
        >
          Back
        </button>
        <button
          onClick={() => {
            dispatch(storeTeacherEventColorAction(event.Color));
            history.push("/teacher-event-edit");
          }}
          className="btn-eve-edit"
        >
          Edit
        </button>

        <div className="white-background">
          <p className="eve-view-head">Start:</p>
          <p className="eve-view-date">
            {event.Start ? event.Start.toDate().toString().substr(4, 11) : null}
            <br />
            {event.Start ? event.Start.toDate().toString().substr(16, 5) : null}
          </p>

          <p className="eve-view-head">End:</p>
          <p className="eve-view-date">
            {event.End ? event.End.toDate().toString().substr(4, 11) : null}
            <br />
            {event.End ? event.End.toDate().toString().substr(16, 5) : null}
          </p>

          <p className="eve-view-head">Color:</p>
          <div
            style={{
              backgroundColor: `${
                event.Color === "purple" ? "#3E00F9" : event.Color
              }`,
            }}
            className="eve-view-color"
          ></div>

          <p className="eve-view-head">Description:</p>
          <p className="eve-view-desc">{event.Desc}</p>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
