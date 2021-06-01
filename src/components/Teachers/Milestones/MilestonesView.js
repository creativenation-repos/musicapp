import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import firebase, {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import {
  storeTeacherMilestoneTasksAction,
  toggleStudentMilestoneAddAssigneeFormAction,
  storeTeacherMilestoneStudentsAction,
  storeTeacherMilestoneAssigneesAction,
  storeTeacherMeDataAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function MilestonesView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleAddAssigneeForm = useSelector(
    (state) => state.toggleStudentMilestoneAddAssigneeFormReducer
  );

  const milestone = useSelector(
    (state) => state.storeTeacherSingleMilestoneSetReducer
  );
  const tasks = useSelector((state) => state.storeTeacherMilestoneTasksReducer);
  const assignees = useSelector(
    (state) => state.storeTeacherMilestoneStudentsReducer
  );
  const mileAssignees = useSelector(
    (state) => state.storeTeacherMilestoneAssigneesReducer
  );

  //   GET
  const getAllTasks = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Milestones")
      .doc(milestone.id)
      .collection("MilestoneTasks")
      .get()
      .then((snapshot) => {
        const tasksData = firebaseLooper(snapshot);
        dispatch(storeTeacherMilestoneTasksAction(tasksData));
      })
      .catch((err) => console.log(err));
  };
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studData = firebaseLooper(snapshot);
        let onlyIDs = [];
        studData.forEach((stud) => {
          onlyIDs.push(stud.id);
        });

        onlyIDs = onlyIDs.filter((val) => !milestone.AssignedTo.includes(val));

        let allStuds = [];
        onlyIDs.forEach((o, i) => {
          studData.forEach((stud) => {
            if (stud.id === o) {
              allStuds.push(stud);
            }
          });
          if (i + 1 === onlyIDs.length) {
            dispatch(storeTeacherMilestoneStudentsAction(allStuds));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const getMilestoneAssignees = () => {
    dispatch(storeTeacherMilestoneAssigneesAction(milestone.AssignedTo));
  };
  const getMeData = () => {
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeTeacherMeDataAction(me));
        });
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleTaskList = () => {
    return tasks.map((task, i) => {
      return (
        <div className="task-block" key={i}>
          <p className="task-task">{task.Task}</p>
          <p className="task-desc">{task.Desc}</p>
        </div>
      );
    });
  };
  const handleAssignees = () => {
    if (mileAssignees) {
      return mileAssignees.map((a, i) => {
        return (
          <div className="ass-name-block" key={i}>
            <FontAwesomeIcon className="ass-name-icon" icon={faArrowRight} />
            <p>{a}</p>
          </div>
        );
      });
    }
  };
  const handleAddAssigneeForm = () => {
    return assignees.map((a, i) => {
      return (
        <div className="ass-form-stud-block" key={i}>
          <p>
            {a.FirstName} {a.LastName}
          </p>
          <button
            id={a.id}
            onClick={onAddAssignee}
            className="btn-ass-form-add"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      );
    });
  };

  // POST
  const onAddAssignee = (event) => {
    const studID = event.currentTarget.getAttribute("id");

    assignees.forEach((ass) => {
      if (ass.id === studID) {
        // Take them off student list
        const allAssignees = [...assignees];
        const filtered = allAssignees.filter((as) => as.id !== studID);

        dispatch(storeTeacherMilestoneStudentsAction(filtered));

        // Push to milestone assigned
        const allMileAssigned = [...mileAssignees];
        allMileAssigned.push(studID);
        dispatch(storeTeacherMilestoneAssigneesAction(allMileAssigned));

        // Add Milestone Info
        const rand1 = RandomString();
        const rand2 = RandomString();
        const mileInfoID = `Mile${rand1}${rand2}`;

        students_Collection
          .doc(studID)
          .collection("MilestonesInfo")
          .doc(mileInfoID)
          .set({
            Name: milestone.Name,
            TeacherID: teacherAuthID,
            MileID: milestone.id,
            isComplete: false,
          })
          .catch((err) => console.log(err));

        // Add Tasks
        tasks.forEach((t) => {
          const rand3 = RandomString();
          const rand4 = RandomString();
          const taskID = `Task${rand3}${rand4}`;

          students_Collection
            .doc(studID)
            .collection("MilestonesInfo")
            .where("MileID", "==", milestone.id)
            .get()
            .then((snapshot) => {
              const mileInfoData = firebaseLooper(snapshot);
              mileInfoData.forEach((mi) => {
                students_Collection
                  .doc(studID)
                  .collection("MilestonesInfo")
                  .doc(mi.id)
                  .collection("MilestoneTasks")
                  .doc(taskID)
                  .set({
                    TaskID: t.id,
                    SetID: t.SegmentName,
                    isComplete: false,
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));
        });

        // Send Notification
        const rand5 = RandomString();
        const rand6 = RandomString();
        const notifID = `Notif${rand5}${rand6}`;

        students_Collection
          .doc(studID)
          .collection("Notifications")
          .doc(notifID)
          .set({
            Action: "",
            Text: `You have been assigned the milestone set: ${milestone.Name}, by your instructor ${meData.FirstName} ${meData.LastName}.`,
            Icon: "faSpinner",
            Date: GetToday(),
          });

        // Add to Assigned TO
        teachers_Collection
          .doc(teacherAuthID)
          .collection("Milestones")
          .doc(milestone.id)
          .update({
            AssignedTo: firebase.firestore.FieldValue.arrayUnion(studID),
          })
          .catch((err) => console.log(err));
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllTasks();
    getAllStudents();
    getMilestoneAssignees();
    getMeData();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>{milestone.Name}</h1>
        <button
          onClick={() => history.push("/teacher-milestones")}
          className="btn-back"
        >
          Back
        </button>
        <button
          onClick={() => {
            history.push("/teacher-milestone-edit");
          }}
          className="btn-edit-tasks"
        >
          Edit Tasks
        </button>
        <div className="white-background">{handleTaskList()}</div>
        <div className="white-background">
          <p className="add-ass-form-head">Assignees:</p>
          {handleAssignees()}
          <br />
          {toggleAddAssigneeForm ? (
            <button
              onClick={() =>
                dispatch(toggleStudentMilestoneAddAssigneeFormAction())
              }
              className="btn-back"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() =>
                dispatch(toggleStudentMilestoneAddAssigneeFormAction())
              }
              className="btn-add-mile-ass"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}

          {toggleAddAssigneeForm ? handleAddAssigneeForm() : null}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
