import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import RandomString from "../../RandomString";
import {
  storeTeacherMilestonesGeneralInfoAction,
  storeTeacherSingleMilestoneSegAction,
  toggleNewTaskFormAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";

export default function MilestoneView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleNewTaskForm = useSelector(
    (state) => state.toggleNewTaskFormReducer
  );

  const milestone = useSelector(
    (state) => state.storeTeacherSingleMilestoneSegReducer
  );

  //   HANDLE
  const handleTaskList = () => {
    if (milestone.Tasks) {
      return milestone.Tasks.map((task, i) => {
        return (
          <div key={i}>
            <h4>{task.Task}</h4>
            <p>{task.Desc}</p>
            <button id={task.id} onClick={removeTask}>
              Remove
            </button>
          </div>
        );
      });
    }
  };
  const handleNewTaskForm = () => {
    return (
      <div>
        <h3>Task:</h3>
        <input id="tbTask" type="text" placeholder="Task" />

        <h3>Description</h3>
        <textarea id="taDesc" placeholder="Description"></textarea>

        <button onClick={addNewTask}>Add</button>
      </div>
    );
  };

  // POST
  const addNewTask = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const taskID = `Task${rand1}${rand2}`;

    const task = document.querySelector("#tbTask").value;
    const desc = document.querySelector("#taDesc").value;

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(milestone.id)
      .collection("MilestoneTasks")
      .doc(taskID)
      .set({
        Task: task,
        Desc: desc,
        SegmentName: milestone.id,
      })
      .catch((err) => console.log(err));

    // Dispatch

    const allTasks = [...milestone.Tasks];
    allTasks.push({
      id: taskID,
      Task: task,
      Desc: desc,
      SegmentName: milestone.id,
    });

    const tempObj = {
      ...milestone,
      Tasks: allTasks,
    };

    dispatch(storeTeacherSingleMilestoneSegAction(tempObj));
    dispatch(toggleNewTaskFormAction());
  };

  // REMOVE
  const removeTask = (event) => {
    const taskID = event.target.getAttribute("id");

    // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(milestone.id)
      .collection("MilestoneTasks")
      .doc(taskID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allTasks = [...milestone.Tasks];
    const filtered = allTasks.filter((task) => task.id !== taskID);

    const tempObj = {
      ...milestone,
      Tasks: filtered,
    };

    dispatch(storeTeacherSingleMilestoneSegAction(tempObj));
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
        <div>
          <button onClick={() => history.push("/teacher-milestones")}>
            Back
          </button>
          <h1>{milestone.Name}</h1>
          <button onClick={() => history.push("/teacher-milestone-edit")}>
            Edit Tasks
          </button>
        </div>

        {/* Tasks */}
        <div>{handleTaskList()}</div>
        <br />
        <button
          onClick={() => dispatch(toggleNewTaskFormAction())}
          className="btn-navy"
        >
          {toggleNewTaskForm ? "Close" : "Add Task"}
        </button>
        {toggleNewTaskForm ? handleNewTaskForm() : null}
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
