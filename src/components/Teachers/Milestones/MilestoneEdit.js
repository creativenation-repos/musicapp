import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import { storeTeacherSingleMilestoneSegAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";

export default function MilestoneEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestone = useSelector(
    (state) => state.storeTeacherSingleMilestoneSegReducer
  );

  //   HANDLE
  const handleTaskEdit = () => {
    if (milestone.Tasks) {
      return milestone.Tasks.map((task, i) => {
        return (
          <div key={i}>
            <h3>Task:</h3>
            <input id={`tbTask${i}`} type-="text" defaultValue={task.Task} />

            <h3>Description:</h3>
            <textarea id={`taDesc${i}`} defaultValue={task.Desc}></textarea>
            <hr />
          </div>
        );
      });
    }
  };

  //   POST
  const saveAllChanges = () => {
    const allTasks = [];

    if (milestone.Tasks) {
      for (let i = 0; i < milestone.Tasks.length; i = i + 1) {
        const task = document.querySelector(`#tbTask${i}`).value;
        const desc = document.querySelector(`#taDesc${i}`).value;

        const tempObj = {
          id: milestone.Tasks[i].id,
          Task: task,
          Desc: desc,
          SegmentName: milestone.id,
        };

        allTasks.push(tempObj);

        // Save to DB
        teachers_Collection
          .doc(teacherAuthID)
          .collection("Milestones")
          .doc(milestone.id)
          .collection("MilestoneTasks")
          .doc(milestone.Tasks[i].id)
          .update({
            Task: task,
            Desc: desc,
          })
          .catch((err) => console.log(err));
      }
    }

    const tempObj = {
      ...milestone,
      Tasks: allTasks,
    };

    dispatch(storeTeacherSingleMilestoneSegAction(tempObj));
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

      {/* Content */}
      <div className="content">
        <h1> Edit Milestone Tasks</h1>

        <div>{handleTaskEdit()}</div>
        <button onClick={saveAllChanges} className="btn-navy">
          Save All Changes
        </button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
