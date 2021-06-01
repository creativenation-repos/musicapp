import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentAssignmentRatingAction,
  storeStudentCompletedAssignmentsAction,
  storeStudentIncompleteAssignmentsAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";
import Footer from "../Footer";
import TopBar from "../TopBar";

import { firebaseLooper } from "../../../utils/tools";

export default function StudentAssignmentsView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assignment = useSelector(
    (state) => state.storeStudentAssignmentReducer
  );
  const rating = useSelector(
    (state) => state.storeStudentAssignmentRatingReducer
  );

  const completed = useSelector(
    (state) => state.storeStudentCompletedAssignmentsReducer
  );
  const incomplete = useSelector(
    (state) => state.storeStudentIncompleteAssignmentsReducer
  );

  // HANDLE
  const handleAssignment = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <p className="ass-view-head">Prompt</p>
          <p className="ass-view-desc">{assignment.Text}</p>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <p className="ass-view-head">Repertoire</p>
          <p className="ass-view-desc">{assignment.Repertoire}</p>
          <br />
          <p className="ass-view-head">Composer</p>
          <p className="ass-view-desc">{assignment.Composer}</p>
          <br />
          <p className="ass-view-head">Tempo</p>
          <p className="ass-view-desc">{assignment.Tempo}</p>
          <br />
          <p className="ass-view-head">Details</p>
          <p className="ass-view-desc">{assignment.Text}</p>
        </div>
      );
    }
  };
  const handleInput = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <p className="ass-view-head">Response</p>
          <textarea
            className="ta"
            id="taAssResponse"
            placeholder="Type response here..."
          ></textarea>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <p className="ass-view-head">
            How was your practice? Rate from 1 through 10.
          </p>
          <div className="btn-ass-rate">
            <button onClick={onRatingClick} id={1}>
              1
            </button>
            <button onClick={onRatingClick} id={2}>
              2
            </button>
            <button onClick={onRatingClick} id={3}>
              3
            </button>
            <button onClick={onRatingClick} id={4}>
              4
            </button>
            <button onClick={onRatingClick} id={5}>
              5
            </button>
            <button onClick={onRatingClick} id={6}>
              6
            </button>
            <button onClick={onRatingClick} id={7}>
              7
            </button>
            <button onClick={onRatingClick} id={8}>
              8
            </button>
            <button onClick={onRatingClick} id={9}>
              9
            </button>
            <button onClick={onRatingClick} id={10}>
              10
            </button>
          </div>

          {rating > 0 ? handleRatingChoice() : null}
          <br />
          <p className="ass-view-head">Any questions or concerns?</p>
          <textarea
            id="taPracticeComment"
            className="ta"
            placeholder="Type comments here..."
          ></textarea>
        </div>
      );
    }
  };
  const handleRatingChoice = () => {
    return (
      <div>
        <p className="ass-view-rating">
          You give your practice a {rating} out of 10.
        </p>
      </div>
    );
  };

  // CLICK
  const onRatingClick = (event) => {
    const rating = event.currentTarget.getAttribute("id");

    dispatch(storeStudentAssignmentRatingAction(rating));
  };

  // POST
  const submitAssignment = () => {
    if (assignment.Type === "Textual") {
      const response = document.querySelector("#taAssResponse").value;

      // Save to DB
      const rand1 = RandomString();
      const rand2 = RandomString();
      const assID = `Ass${rand1}${rand2}`;

      console.log(assignment.Teacher)

      students_Collection
        .doc(studentAuthID)
        .collection("AssignmentResults")
        .doc(assID)
        .set({
          AssID: assignment.id,
          Response: response,
          Date: GetToday(),
          Name: assignment.Name,
          Type: assignment.Type,
          Teacher: assignment.Teacher,
        })
        .catch((err) => console.log(err));

      // Send notification
      const rand3 = RandomString();
      const rand4 = RandomString();
      const notifID = `Notif${rand3}${rand4}`;

      teachers_Collection
        .doc(assignment.Teacher)
        .collection("Notifications")
        .doc(notifID)
        .set({
          Icon: "faBookOpen",
          Action: "",
          Text: `${user.FirstName} ${user.LastName} has completed the assignment: ${assignment.Name}.`,
          Date: GetToday(),
        })
        .catch((err) => console.log(err));
    } else if (assignment.Type === "Practice") {
      const rand1 = RandomString();
      const rand2 = RandomString();
      const assID = `Ass${rand1}${rand2}`;

      const comments = document.querySelector("#taPracticeComment").value;

      students_Collection
        .doc(studentAuthID)
        .collection("AssignmentResults")
        .doc(assID)
        .set({
          AssID: assignment.id,
          Rating: rating,
          Comments: comments,
          Date: GetToday(),
          Name: assignment.Name,
          Type: assignment.Type,
          Teacher: assignment.Teacher,
        })
        .catch((err) => console.log(err));

      // Send notification
      const rand3 = RandomString();
      const rand4 = RandomString();
      const notifID = `Notif${rand3}${rand4}`;

      teachers_Collection
        .doc(assignment.Teacher)
        .collection("Notifications")
        .doc(notifID)
        .set({
          Icon: "faBookOpen",
          Action: "",
          Text: `${user.FirstName} ${user.LastName} has completed the assignment: ${assignment.Name}.`,
          Date: GetToday(),
        })
        .catch((err) => console.log(err));
    }

    students_Collection
      .doc(studentAuthID)
      .collection("AssignmentsInfo")
      .where("AssID", "==", assignment.id)
      .get()
      .then((snapshot) => {
        const assInfo = firebaseLooper(snapshot);
        assInfo.forEach((a) => {
          students_Collection
            .doc(studentAuthID)
            .collection("AssignmentsInfo")
            .doc(a.id)
            .update({
              isComplete: true,
            })
            .catch((err) => console.log(err));

          const allComp = [...completed];
          const allIncomp = [...incomplete];

          let filtered = [];
          // Remove from Inc
          filtered = allIncomp.filter((sharon) => sharon.id !== a.id);
          dispatch(storeStudentIncompleteAssignmentsAction(filtered));

          // Add to comp
          allComp.push({
            ...a,
            isComplete: true,
          });
          dispatch(storeStudentCompletedAssignmentsAction(allComp));
        });
      })
      .catch((err) => console.log(err));

    history.push("/student-assignments");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    console.log(assignment);
  }, [assignment]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>{assignment.Name}</h1>
        <button
          className="btn-back"
          onClick={() => history.push("/student-assignments")}
        >
          Back
        </button>

        <div className="white-background">
          <p className="ass-view-head">Overview</p>
          <p className="ass-view-desc">{assignment.Desc}</p>
        </div>
        <div className="white-background">{handleAssignment()}</div>
        <div className="white-background">{handleInput()}</div>
        <button onClick={submitAssignment} className="btnSaveChanges">
          Submit
        </button>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
