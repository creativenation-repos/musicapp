import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherMilestonesGeneralInfoAction,
  storeTeacherMilestoneTasksAction,
  storeTeacherSingleMilestoneSetAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import RandomString from "../../RandomString";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

export default function MilestonesCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestones = useSelector(
    (state) => state.storeTeacherMilestonesGeneralInfoReducer
  );

  //   POST
  const saveChanges = () => {
    const setName = document.querySelector("#tbSetName").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const setID = `Set${rand1}${rand2}`;

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(setID)
      .set({
        Name: setName,
        AssignedTo: [],
      })
      .catch((err) => console.log(err));

    const allSets = [...milestones];
    allSets.push({
      id: setID,
      Name: setName,
      AssignedTo: [],
    });

    dispatch(storeTeacherMilestonesGeneralInfoAction(allSets));
    dispatch(
      storeTeacherSingleMilestoneSetAction({
        id: setID,
        Name: setName,
        AssignedTo: [],
      })
    );
    dispatch(storeTeacherMilestoneTasksAction([]));
    history.push("/teacher-milestone-view");
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
        <h1>Create Milestone Set</h1>
        <button
          onClick={() => history.push("/teacher-milestones")}
          className="btn-back"
        >
          Back
        </button>
        <div className="white-background">
          <p className="set-name-head">Milestone Set Name:</p>
          <input
            className="tb"
            id="tbSetName"
            type="text"
            placeholder="Milestone Set Name..."
          />
        </div>
        <button onClick={saveChanges} className="btnSaveChanges">
          Create
        </button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
