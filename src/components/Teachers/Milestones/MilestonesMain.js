import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherMilestonesGeneralInfoAction,
  storeTeacherSingleMilestoneSetAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";
import "./Milestones.css";

import { firebaseLooper } from "../../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default function MilestonesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestones = useSelector(
    (state) => state.storeTeacherMilestonesGeneralInfoReducer
  );

  // GET
  const getMilestones = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .get()
      .then((snapshot) => {
        const mileData = firebaseLooper(snapshot);

        dispatch(storeTeacherMilestonesGeneralInfoAction(mileData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleMilestoneList = () => {
    return milestones.map((mile, i) => {
      return (
        <div className="milestone-block" key={i}>
          <p className="mile-name">{mile.Name}</p>
          <div style={{ marginLeft: "auto", marginRight: "10px" }}>
            <button
              id={mile.id}
              onClick={navMilestoneView}
              className="mile-view"
            >
              View
            </button>
            <button id={mile.id} onClick={removeSet} className="mile-remove">
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
      );
    });
  };

  // NAV
  const navMilestoneView = (event) => {
    const mileID = event.target.getAttribute("id");

    milestones.forEach((mile) => {
      if (mile.id === mileID) {
        dispatch(storeTeacherSingleMilestoneSetAction(mile));
      }
    });

    history.push("/teacher-milestone-view");
  };

  // REMOVE
  const removeSet = (event) => {
    const setID = event.target.getAttribute("id");

    // // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(setID)
      .collection("MilestoneTasks")
      .get()
      .then((snapshot) => {
        const tasksData = firebaseLooper(snapshot);
        tasksData.forEach((t) => {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Milestones")
            .doc(setID)
            .collection("MilestoneTasks")
            .doc(t.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(setID)
      .delete()
      .catch((err) => console.log(err));

    // DIspatch
    const allSets = [...milestones];
    const filtered = allSets.filter((s) => s.id !== setID);
    console.log(filtered);

    dispatch(storeTeacherMilestonesGeneralInfoAction(filtered));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getMilestones();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Milestones</h1>
        <button
          onClick={() => history.push("/teacher-milestone-create")}
          className="btnCreate"
        >
          Create New Milestone Set
        </button>

        <div className="white-background">{handleMilestoneList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
