import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import { teachers_Collection } from "../../../utils/firebase";
import {
  storeTeacherMilestonesGeneralInfoAction,
  storeTeacherSingleMilestoneSegAction,
  toggleNewSegmentFormAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import RandomString from "../../RandomString";

export default function MilestonesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleNewSegmentForm = useSelector(
    (state) => state.toggleNewSegmentFormReducer
  );

  const milestones = useSelector(
    (state) => state.storeTeacherMilestonesGeneralInfoReducer
  );

  // GET
  const getAllMilestones = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .get()
      .then((snapshot) => {
        const milestoneData = firebaseLooper(snapshot);
        dispatch(storeTeacherMilestonesGeneralInfoAction(milestoneData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleMilestoneSegList = () => {
    return milestones.map((mile, i) => {
      return (
        <div key={i}>
          <h3>{mile.Name}</h3>
          <button id={mile.id} onClick={navMilestoneView}>
            View
          </button>
        </div>
      );
    });
  };
  const handleNewSegmentForm = () => {
    return (
      <div>
        <h3>Segment Name:</h3>
        <p>
          The Segment Name is the title that describes what kind of tasks the
          student will need to complete.
        </p>
        <input id="tbSegName" type="text" placeholder="Segment Name" />
        <button onClick={createSeg}>Create</button>
        <hr />
      </div>
    );
  };

  // POST
  const createSeg = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const segID = `Seg${rand1}${rand2}`;

    const segName = document.querySelector("#tbSegName").value;

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(segID)
      .set({
        AssigedTo: [],
        Name: segName,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const tempObj = {
      id: segID,
      AssigedTo: [],
      Name: segName,
      Tasks: [],
    };

    dispatch(storeTeacherSingleMilestoneSegAction(tempObj));
    history.push("/teacher-milestone-view");
  };

  // NAV
  const navMilestoneView = (event) => {
    const mileID = event.target.getAttribute("id");

    milestones.forEach((mile) => {
      if (mile.id === mileID) {
        teachers_Collection
          .doc(teacherAuthID)
          .collection("Milestones")
          .doc(mileID)
          .collection("MilestoneTasks")
          .get()
          .then((snapshot) => {
            const tasks = firebaseLooper(snapshot);
            const tempObj = {
              ...mile,
              Tasks: tasks,
            };
            dispatch(storeTeacherSingleMilestoneSegAction(tempObj));
          })
          .catch((err) => console.log(err));

        history.push("/teacher-milestone-view");
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllMilestones();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <div>
          <h1>Milestones</h1>
          <button onClick={() => dispatch(toggleNewSegmentFormAction())}>
            {toggleNewSegmentForm ? "Close" : "Create Milestone Segment"}
          </button>
          {toggleNewSegmentForm ? handleNewSegmentForm() : null}
        </div>
        <div>{handleMilestoneSegList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
