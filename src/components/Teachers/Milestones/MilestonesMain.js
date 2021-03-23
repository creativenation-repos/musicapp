import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import MilestoneBlock from "./MilestoneBlock";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


export default function MilestonesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestoneState = useSelector(
    (state) => state.storeTeacherMilestonesGeneralInfoReducer
  );



  const getAllAssigned = () => {
    const assignedArray = [];
    milestoneState.forEach((m) => {
      m.AssignedTo.forEach((a) => {
        assignedArray.push(a);
      });
    });

    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const uniqueAssigned = assignedArray.filter(unique);

    return uniqueAssigned;
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
        <div>
          <input id="tbMilestoneSearch" type="text" placeholder="Search" />
          <button>Create New Segment</button>
        </div>
        {/* Show student links */}
        <div>
          {getAllAssigned().map((assigned, i) => {
            return (
              <button id={assigned}>
                {assigned}
              </button>
            );
          })}
          <div>
            
          </div>
        </div>

        <hr />
        <div>
          {milestoneState.map((m, i) => {
            return (
              <MilestoneBlock key={i} name={m.Name} assignedTo={m.AssignedTo} />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
