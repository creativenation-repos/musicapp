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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
          <p className="ass-assigned-on">
            Created on:{" "}
            <span className="ass-date">
              {assignment.Date.toDate().toString().substr(4, 11)}
            </span>
          </p>
        ) : null}
        {assignment.Due ? (
          <p className="ass-assigned-on">
            Due on:{" "}
            <span className="ass-date">
              {assignment.Due.toDate().toString().substr(4, 11)}
            </span>
          </p>
        ) : null}
        <p className="ass-type">{assignment.Type} Assignment</p>
        <div>{handleAssignmentType()}</div>
        <div>
          <h3>Assignees:</h3>
          {assignment.Assignees
            ? assignees.map((stud, i) => {
                return (
                  <div key={i} className="ass-assignee">
                    <FontAwesomeIcon
                      style={{ color: "#3E00F9" }}
                      icon={faArrowRight}
                    />
                    <p style={{ marginLeft: "10px", fontWeight: "800" }}>
                      {stud}
                    </p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  };
  const handleAssignmentType = () => {
    if (assignment.Type === "Textual") {
      return (
        <div className="ass-block">
          <h3 className="ass-type-head">Assignment:</h3>
          <p className="ass-type-text">{assignment.Text}</p>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div className="ass-block">
          <div>
            <h3 className="ass-type-head">Assignment:</h3>
            <p className="ass-type-text">{assignment.Text}</p>
          </div>
          <div>
            <h3 className="ass-type-head">Repertoire:</h3>
            <p className="ass-type-text">{assignment.Repertoire}</p>
          </div>
          <div>
            <h3 className="ass-type-head">Composer:</h3>
            <p className="ass-type-text">{assignment.Composer}</p>
          </div>
          <div>
            <h3 className="ass-type-head">Tempo:</h3>
            <p className="ass-type-text">{assignment.Tempo}</p>
          </div>
          <div>
            <h3 className="ass-type-head">Max Practice Time</h3>
            <p className="ass-type-text">{assignment.MaxTime}</p>
          </div>
        </div>
      );
    }
  };
  const handleAssigneeForm = () => {
    if (assignees.length > 0) {
      const studs = [...students];
      const distinct = studs.filter(
        (item) => !assignees.includes(`${item.FirstName} ${item.LastName}`)
      );

      return distinct.map((dis, i) => {
        return (
          <div className="assignee-block" key={i}>
            <p className="assignee-line">
              {dis.FirstName} {dis.LastName}{" "}
              <span className="assignee-id">{dis.id}</span>
            </p>
            <button
              className="btnAssignee-add"
              onClick={addAssignee}
              id={`${dis.FirstName} ${dis.LastName} ${dis.id}`}
            >
              Assign
            </button>
          </div>
        );
      });
    } else {
      return students.map((stud, i) => {
        return (
          <div className="assignee-block" key={i}>
            <p className="assignee-line">
              {stud.FirstName} {stud.LastName}{" "}
              <span className="assignee-id">{stud.id}</span>
            </p>
            <button
              className="btnAssignee-add"
              onClick={addAssignee}
              id={`${stud.FirstName} ${stud.LastName} ${stud.id}`}
            >
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
    const studArr = event.target.getAttribute("id").split(" ");
    const studID = studArr[2];
    const studFull = `${studArr[0]} ${studArr[1]}`;

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
          Assignees: firebase.firestore.FieldValue.arrayUnion(studFull),
        })
        .catch((err) => console.log(err));

      const allAssignees = [...assignment.Assignees];
      allAssignees.push(studFull);
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

      <div className="content">
        <div className="white-background">
          <button
            className="btn-back"
            onClick={() => history.push("/teacher-assignments")}
          >
            Back
          </button>
          <button className="btn-edit-ass" onClick={navAssignmentEdit}>
            Edit Assignment
          </button>
          <p className="ass-name">{assignment.Name}</p>
          <p>{assignment.Desc}</p>
          <div>{handleAssignment()}</div>
          <br />
          <div>
            <button
              onClick={() => dispatch(toggleAssigneeFormAction())}
              className="add-assignee"
            >
              {toggleAssigneeForm ? "Close" : "Add Assignee"}
            </button>
            {toggleAssigneeForm ? handleAssigneeForm() : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
