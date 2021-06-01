import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import Footer from "../Footer";
import TopBar from "../TopBar";
import "./Milestones.css";

import {
  storeStudentCompleteMilestonesAction,
  storeStudentIncompleteMilestonesAction,
  storeStudentMilestoneTasksAction,
  storeStudentTeacherIDAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MilestonesCreate from "../../Teachers/Milestones/MilestonesCreate";

export default function StudentMilestonesMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const complete = useSelector(
    (state) => state.storeStudentCompleteMilestonesReducer
  );
  const incomplete = useSelector(
    (state) => state.storeStudentIncompleteMilestonesReducer
  );

  //  GET
  const getCompleteMilestones = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("MilestonesInfo")
      .where("isComplete", "==", true)
      .get()
      .then((snapshot) => {
        const compData = firebaseLooper(snapshot);
        dispatch(storeStudentCompleteMilestonesAction(compData));
      })
      .catch((err) => console.log(err));
  };
  const getIncompleteMilestones = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("MilestonesInfo")
      .where("isComplete", "==", false)
      .get()
      .then((snapshot) => {
        const incompData = firebaseLooper(snapshot);
        dispatch(storeStudentIncompleteMilestonesAction(incompData));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleCompleteMilestoneList = () => {
    return complete.map((mile, i) => {
      return (
        <div className="mile-list-block" key={i}>
          <div>
            <p className="mile-list-name">{mile.Name}</p>
            <p className="mile-list-teacher">Teacher: {mile.TeacherID}</p>
          </div>
        </div>
      );
    });
  };
  const handleIncompleteMilestoneList = () => {
    return incomplete.map((mile, i) => {
      return (
        <div className="mile-list-block" key={i}>
          <div>
            <p className="mile-list-name">{mile.Name}</p>
            <p className="mile-list-teacher">Teacher: {mile.TeacherID}</p>
          </div>
          <button
            id={mile.id}
            onClick={navMilestoneView}
            className="btn-mile-view"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      );
    });
  };

  // NAV
  const navMilestoneView = (event) => {
    const mileID = event.currentTarget.getAttribute("id");

    incomplete.forEach((mi) => {
      if (mi.id === mileID) {
        dispatch(
          storeStudentTeacherIDAction({
            TeacherID: mi.TeacherID,
            MileID: mi.MileID,
            MileName: mi.Name,
          })
        );

        students_Collection
          .doc(studentAuthID)
          .collection("MilestonesInfo")
          .doc(mi.id)
          .collection("MilestoneTasks")
          .get()
          .then((snapshot) => {
            const taskData = firebaseLooper(snapshot);
            dispatch(storeStudentMilestoneTasksAction(taskData));
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/student-milestone-view");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getCompleteMilestones();
    getIncompleteMilestones();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Milestones</h1>

        <div className="white-background">
          <p className="mile-list-head">Incomplete</p>
          <div>{handleIncompleteMilestoneList()}</div>
        </div>
        <div className="white-background">
          <p className="mile-list-head">Complete</p>
          <div>{handleCompleteMilestoneList()}</div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
