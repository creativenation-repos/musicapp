import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { firebaseLooper } from "../../../utils/tools";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import {
  storeTeacherAssignmentAssigneesAction,
  storeTeacherAssignmentsGeneralInfoAction,
  storeTeacherStudentGeneralInfoAction,
  toggleAssigneeFormAction,
} from "../../../redux/actions";
import RandomString from "../../RandomString";
import firebase from "../../../utils/firebase";

export default function AssignmentView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleAssigneeForm = useSelector(
    (state) => state.toggleAssigneeFormReducer
  );

  const assignment = useSelector(
    (state) => state.storeTeacherSingleAssignmentReducer
  );
  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );
  const assignees = useSelector(
    (state) => state.storeTeacherAssignmentAssigneesReducer
  );

  //   HANDLE
  const handleAssignment = () => {
    return (
      <div>
        {assignment.Date ? (
          <p>Assigned: {assignment.Date.toDate().toString().substr(4, 11)}</p>
        ) : null}
        {assignment.Due ? (
          <p>Due: {assignment.Due.toDate().toString().substr(4, 11)}</p>
        ) : null}
        <p>Assignment Type: {assignment.Type}</p>
        <div>{handleAssignmentType()}</div>
        <div>
          <h3>Assignees:</h3>
          {assignment.Assignees
            ? assignees.map((stud, i) => {
                return <p key={i}>{stud}</p>;
              })
            : null}
        </div>
      </div>
    );
  };
  const handleAssignmentType = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <h3>Assignment:</h3>
          <p>{assignment.Text}</p>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <div>
            <h3>Assignment:</h3>
            <p>{assignment.Text}</p>
          </div>
          <div>
            <h3>Repertoire:</h3>
            <p>{assignment.Repertoire}</p>
          </div>
          <div>
            <h3>Composer:</h3>
            <p>{assignment.Composer}</p>
          </div>
          <div>
            <h3>Tempo:</h3>
            <p>{assignment.Tempo}</p>
          </div>
          <div>
            <h3>Max Practice Time</h3>
            <p>{assignment.MaxTime}</p>
          </div>
        </div>
      );
    }
  };
  const handleAssigneeForm = () => {
    if (assignees.length > 0) {
      const studs = [...students];
      const distinct = studs.filter((item) => !assignees.includes(item.id));

      return distinct.map((dis, i) => {
        return (
          <div key={i}>
            <p>{dis.id}</p>
            <button onClick={addAssignee} id={dis.id}>
              Assign
            </button>
          </div>
        );
      });
    } else {
      return students.map((stud, i) => {
        return (
          <div key={i}>
            <p>{stud.id}</p>
            <button onClick={addAssignee} id={stud.id}>
              Assign
            </button>
          </div>
        );
      });
    }
  };

  // GET
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studList = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentGeneralInfoAction(studList));
      })
      .catch((err) => console.log(err));
  };

  // POST
  const addAssignee = (event) => {
    let valid = true;
    const studID = event.target.getAttribute("id");
    assignees.forEach((assignee) => {
      if (studID === assignee) {
        valid = false;
      }
    });

    if (valid) {
      const rand1 = RandomString();
      const rand2 = RandomString();
      const assInfoID = `AssInfo${rand1}${rand2}`;

      // Save to DB

      students_Collection
        .doc(studID)
        .collection("AssignmentsInfo")
        .doc(assInfoID)
        .set({
          Teacher: teacherAuthID,
          AssID: assignment.id,
          Name: assignment.Name,
          Desc: assignment.Desc,
          isComplete: false,
        })
        .catch((err) => console.log(err));

      teachers_Collection
        .doc(teacherAuthID)
        .collection("Assignments")
        .doc(assignment.id)
        .update({
          Assignees: firebase.firestore.FieldValue.arrayUnion(studID),
        })
        .catch((err) => console.log(err));

      const allAssignees = [...assignment.Assignees];
      allAssignees.push(studID);
      dispatch(storeTeacherAssignmentAssigneesAction(allAssignees));

      const tempObj = {
        ...assignment,
        Assignees: allAssignees,
      };

      dispatch(storeTeacherAssignmentsGeneralInfoAction(tempObj));
    }
  };

  //   NAV
  const navAssignmentEdit = () => {
    history.push("teacher-assignment-edit");
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
      <button
        className="btn-lime"
        onClick={() => history.push("/teacher-assignments")}
      >
        Back
      </button>
      <button onClick={navAssignmentEdit}>Edit Assignment</button>
      <h1>{assignment.Name}</h1>
      <div>{handleAssignment()}</div>
      <br />
      <div>
        <button
          onClick={() => dispatch(toggleAssigneeFormAction())}
          className="btn-navy"
        >
          {toggleAssigneeForm ? "Close" : "Add Assignee"}
        </button>
        {toggleAssigneeForm ? handleAssigneeForm() : null}
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
