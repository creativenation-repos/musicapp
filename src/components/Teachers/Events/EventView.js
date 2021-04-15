import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function EventView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const eve = useSelector((state) => state.storeSingleMonthEventReducer);

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
        <button onClick={() => history.push("/teacher-events")}>Back</button>
        <h1>{eve.Name}</h1>
        <div>
          <p>{eve.Desc}</p>
          <p>
            Start:{" "}
            {eve.Start ? eve.Start.toDate().toString().substr(4, 11) : null}
          </p>
          <p>
            End: {eve.End ? eve.End.toDate().toString().substr(4, 11) : null}
          </p>

          <p>Invitees: </p>
          <ul>
            {eve.Invitees
              ? eve.Invitees.map((inv, i) => {
                  return <p key={i}>{inv}</p>;
                })
              : null}
          </ul>
        </div>
      </div>

      {/* Dash Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
