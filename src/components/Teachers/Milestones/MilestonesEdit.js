import {
  faMinus,
  faPlus,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
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

export default function MilestonesEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const milestone = useSelector(
    (state) => state.storeTeacherSingleMilestoneSetReducer
  );
  const tasks = useSelector((state) => state.storeTeacherMilestoneTasksReducer);

  //   HANDLE
  const handleTasks = () => {
    return tasks.map((task, i) => {
      return (
        <div className="task-edit-block" key={i}>
          <p className="task-edit-head">Task:</p>
          <input
            className="tb"
            id={`tbTaskTask${i}`}
            type="text"
            defaultValue={task.Task}
            placeholder="Task..."
          />

          <p className="task-edit-head">Description:</p>
          <textarea
            className="ta"
            id={`taTaskDesc${i}`}
            defaultValue={task.Desc}
            placeholder="Description..."
          ></textarea>
          <button id={task.id} onClick={removeTask} className="btn-remove-task">
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
      );
    });
  };

  // REMOVE
  const removeTask = (event) => {
    const taskID = event.target.getAttribute("id");

    // Remove from DB
    tasks.forEach((t) => {
      if (t.id === taskID) {
        if (t.SegmentName !== "newTask") {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Milestones")
            .doc(milestone.id)
            .collection("MilestoneTasks")
            .doc(taskID)
            .delete()
            .catch((err) => console.log(err));
        }
      }
    });

    //   Dispatch
    const allTasks = [...tasks];
    const filtered = allTasks.filter((t) => t.id !== taskID);

    dispatch(storeTeacherMilestoneTasksAction(filtered));
  };

  //   CLICK
  const addTask = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const taskID = `Task${rand1}${rand2}`;

    const allTasks = [...tasks];
    allTasks.push({
      id: taskID,
      Task: "",
      Desc: "",
      SegmentName: "newTask",
    });

    dispatch(storeTeacherMilestoneTasksAction(allTasks));
  };

  //   POST
  const saveChanges = () => {
    const milestoneName = document.querySelector("#tbMilestoneName").value;

    // Save Name

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(milestone.id)
      .update({ Name: milestoneName })
      .catch((err) => console.log(err));

    //   Dispatch it
    const tempObj = { ...milestone };
    tempObj.Name = milestoneName;
    dispatch(storeTeacherSingleMilestoneSetAction(tempObj));

    let allTasks = [];

    // Store Tasks
    tasks.forEach((t, i) => {
      const rand1 = RandomString();
      const rand2 = RandomString();
      const taskID = `Task${rand1}${rand2}`;

      const task = document.querySelector(`#tbTaskTask${i}`).value;
      const desc = document.querySelector(`#taTaskDesc${i}`).value;

      if (t.SegmentName === "newTask") {
        teachers_Collection
          .doc(teacherAuthID)
          .collection("Milestones")
          .doc(milestone.id)
          .collection("MilestoneTasks")
          .doc(taskID)
          .set({ Task: task, Desc: desc, SegmentName: milestone.id })
          .catch((err) => console.log(err));
      } else {
        teachers_Collection
          .doc(teacherAuthID)
          .collection("Milestones")
          .doc(milestone.id)
          .collection("MilestoneTasks")
          .doc(t.id)
          .update({
            Task: task,
            Desc: desc,
          });
      }

      allTasks.push({ Task: task, Desc: desc, SegmentName: milestone.id });
    });

    dispatch(storeTeacherMilestoneTasksAction(allTasks));
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
        <h1>Edit</h1>

        <div className="white-background">
          <p className="task-edit-head">Milestone Set Name:</p>
          <input
            className="tb"
            id="tbMilestoneName"
            type="text"
            defaultValue={milestone.Name}
          />
        </div>
        <div className="white-background">
          <h3 className="task-edit-main-head">Tasks</h3>
          {handleTasks()}

          <button onClick={addTask} className="btn-add-task">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <button onClick={saveChanges} className="btnSaveChanges">
          Save Changes
        </button>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
