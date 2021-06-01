import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeStudentMilestoneViewTasksAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import Footer from "../Footer";
import TopBar from "../TopBar";

import { firebaseLooper } from "../../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function StudentMilestoneView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const miTasks = useSelector(
    (state) => state.storeStudentMilestoneTasksReducer
  );
  const tasks = useSelector(
    (state) => state.storeStudentMilestoneViewTasksReducer
  );
  const teacherData = useSelector(
    (state) => state.storeStudentTeacherIDReducer
  );

  //   GET
  const getTasks = () => {
    miTasks.forEach((mi) => {
      teachers_Collection
        .doc(teacherData.TeacherID)
        .collection("Milestones")
        .doc(teacherData.MileID)
        .collection("MilestoneTasks")
        .get()
        .then((snapshot) => {
          const teachTaskData = firebaseLooper(snapshot);
          const teachTaskSize = snapshot.size;

          let allTasks = [];
          teachTaskData.forEach((tt, i) => {
            tt = {
              ...tt,
              isComplete: mi.isComplete,
            };
            allTasks.push(tt);
            if (i + 1 === teachTaskSize) {
              dispatch(storeStudentMilestoneViewTasksAction(allTasks));
            }
          });
        })
        .catch((err) => console.log(err));
    });
  };

  //   HANDLE
  const handleTaskList = () => {
    return tasks.map((task, i) => {
      return (
        <div className="task-list-block" key={i}>
          {task.isComplete ? (
            <div className="task-list-icon-complete"></div>
          ) : (
            <div className="task-list-icon-incomplete"></div>
          )}
          <p className="task-list-task">{task.Task}</p>
          <p className="task-list-desc">{task.Desc}</p>
        </div>
      );
    });
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getTasks();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>{teacherData.MileName}</h1>
        <button
          className="btn-back"
          onClick={() => history.push("/student-milestones")}
        >
          Back
        </button>

        <div className="white-background">{handleTaskList()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
