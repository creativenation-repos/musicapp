import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { storeTeacherMilestonesAssigneesAction } from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import firestore from "../../../utils/firebase";

export default function MilestoneAssign() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestone = useSelector(
    (state) => state.storeTeacherSingleMilestoneSegReducer
  );
  const assignees = useSelector(
    (state) => state.storeTeacherMilestonesAssigneesReducer
  );

  // GET
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);
        let studIDs = [];
        studentData.forEach((stud) => {
          studIDs.push(stud.id);
        });
        const filtered = studIDs.filter(
          (e) => !milestone.AssignedTo.includes(e)
        );
        console.log(filtered);
        dispatch(storeTeacherMilestonesAssigneesAction(filtered));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleStudentList = () => {
    return assignees.map((assignee, i) => {
      return (
        <button onClick={assignMilestone} key={i} id={assignee}>
          {assignee}
        </button>
      );
    });
  };

  //   POST
  const assignMilestone = (event) => {
    const studID = event.target.getAttribute("id");

    let currAssignees = [...milestone.AssignedTo];
    currAssignees.push(studID);

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(milestone.id)
      .update({
        AssignedTo: currAssignees,
      })
      .catch((err) => console.log(err));

    students_Collection
      .doc(studID)
      .collection("Milestones")
      .doc(milestone.id)
      .set({
        Name: milestone.Name,
      })
      .catch((err) => console.log(err));

    milestone.Tasks.forEach((task) => {
      students_Collection
        .doc(studID)
        .collection("Milestones")
        .doc(milestone.id)
        .collection("MilestoneTasks")
        .doc(task.id)
        .set({
          Task: task.Task,
          Desc: task.Desc,
          isComplete: false,
        })
        .catch((err) => console.log(err));
    });

    // Dispatch
    const allAssignees = [...assignees];
    const filtered = allAssignees.filter((a) => a !== studID);

    dispatch(storeTeacherMilestonesAssigneesAction(filtered));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllStudents();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <button onClick={() => history.push("/teacher-milestones")}>
          Back
        </button>
        <h1>Assign Milestone Segment</h1>

        <p>
          Please choose the student you want to assign {milestone.Name} Miletone
          Segment to.
        </p>

        <div>{handleStudentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
