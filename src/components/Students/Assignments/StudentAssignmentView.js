import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import GetToday from "../../GetToday";

import Notice from "../../MiscComponents/Notice";

import {
  storeStudentAssignmentPracticeRatingAction,
  storeStudentAssignmentsInfoAction,
} from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentAssignmentView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const assignment = useSelector(
    (state) => state.storeStudentSingleAssignmentReducer
  );
  const rating = useSelector(
    (state) => state.storeStudentAssignmentPracticeRatingReducer
  );
  const assignmentsInfo = useSelector(
    (state) => state.storeStudentAssignmentsInfoReducer
  );

  // HANDLE
  const handleAssignmentDetails = () => {
    if (assignment.Type === "Textual") {
      return (
        <div>
          <h3>Prompt:</h3>
          <h4>{assignment.Text}</h4>

          <h3>Response:</h3>
          <textarea
            id="taTextualRes"
            placeholder="Type response here..."
          ></textarea>

          <button>Submit</button>
        </div>
      );
    } else if (assignment.Type === "Practice") {
      return (
        <div>
          <h3>Prompt:</h3>
          <h4>{assignment.Text}</h4>

          <h3>Repertoire:</h3>
          <p>{assignment.Repertoire}</p>

          <h3>Composer:</h3>
          <p>{assignment.Composer}</p>

          <h3>Tempo:</h3>
          <p>{assignment.Tempo}</p>

          <Notice message="Before you continue, please make sure to complete the assignment. The form below will require the results of your practice" />

          {/* Survey */}
          <div>
            <h3>How long did you practice this assignment?</h3>
            <input
              id="tbPracTime"
              type="text"
              placeholder="Practice Time"
            />{" "}
            minutes
            <h3>
              How would you rate your overall practice for this assignment?
            </h3>
            <p>
              1 - Practice was not effective. <br />
              10 - Practice was very effective.
            </p>
            <div>
              <button id="1" onClick={handleRating}>
                1
              </button>
              <button id="2" onClick={handleRating}>
                2
              </button>
              <button id="3" onClick={handleRating}>
                3
              </button>
              <button id="4" onClick={handleRating}>
                4
              </button>
              <button id="5" onClick={handleRating}>
                5
              </button>
              <button id="6" onClick={handleRating}>
                6
              </button>
              <button id="7" onClick={handleRating}>
                7
              </button>
              <button id="8" onClick={handleRating}>
                8
              </button>
              <button id="9" onClick={handleRating}>
                9
              </button>
              <button id="10" onClick={handleRating}>
                10
              </button>
            </div>
            <p>{rating !== "" ? `Rating: ${rating}` : null}</p>
            <h3>Any concerns with your practice?</h3>
            <textarea
              id="taPracticeConcerns"
              placeholder="Type message here..."
            ></textarea>
            <br />
            <br />
            <button className="btn-navy" onClick={submitAssignment}>
              Submit Assignment
            </button>
          </div>
        </div>
      );
    }
  };

  const handleRating = (event) => {
    const ra = event.target.getAttribute("id");

    dispatch(storeStudentAssignmentPracticeRatingAction(ra));
  };

  //   POST
  const submitAssignment = () => {
    if (assignment.Type === "Textual") {
      const response = document.querySelector("#taTextualRes").value;

      students_Collection
        .doc(studentAuthID)
        .collection("AssignmentsInfo")
        .where("Name", "==", assignment.Name)
        .get()
        .then((snapshot) => {
          const resData = firebaseLooper(snapshot);
          resData.forEach((data) => {
            students_Collection
              .doc(studentAuthID)
              .collection("AssignmentsInfo")
              .doc(data.id)
              .update({
                isComplete: true,
                Response: response,
                CompletionDate: GetToday(),
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => console.log(err));
    } else if (assignment.Type === "Practice") {
      const pracTime = parseInt(
        document.querySelector("#tbPracTime").value,
        10
      );
      const ra = rating;
      const concerns = document.querySelector("#taPracticeConcerns").value;

      // Save to DB

      students_Collection
        .doc(studentAuthID)
        .collection("AssignmentsInfo")
        .where("Name", "==", assignment.Name)
        .get()
        .then((snapshot) => {
          const resData = firebaseLooper(snapshot);
          resData.forEach((data) => {
            students_Collection
              .doc(studentAuthID)
              .collection("AssignmentsInfo")
              .doc(data.id)
              .update({
                isComplete: true,
                Time: pracTime,
                Rating: ra,
                Concerns: concerns,
                CompletionDate: GetToday(),
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => console.log(err));
    }

    const assignmentsInfoThings = [...assignmentsInfo];
    assignmentsInfoThings.forEach((a) => {
      if (a.Name === assignment.Name) {
        a.isComplete = true;
      }
    });
    dispatch(storeStudentAssignmentsInfoAction(assignmentsInfoThings));

    history.push("/student-assignments");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
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
      <div>
        <h1>{assignment.Name}</h1>
        <p>{assignment.Desc}</p>
        <div>{handleAssignmentDetails()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
