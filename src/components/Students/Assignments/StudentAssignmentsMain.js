import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TopBar from "../TopBar";
import Footer from "../Footer";

import { firebaseLooper } from "../../../utils/tools";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import {
  storeStudentAssignmentsAction,
  storeStudentIncompleteAssignmentsAction,
  storeStudentAssignmentAction,
  storeStudentCompletedAssignmentsAction,
} from "../../../redux/actions";

import "./Assignments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function StudentAssignmentsMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const completed = useSelector(
    (state) => state.storeStudentCompletedAssignmentsReducer
  );
  const incomplete = useSelector(
    (state) => state.storeStudentIncompleteAssignmentsReducer
  );

  // GET
  const getAllCompletedAssignments = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("AssignmentsInfo")
      .where("isComplete", "==", true)
      .get()
      .then((snapshot) => {
        const assData = firebaseLooper(snapshot);
        dispatch(storeStudentCompletedAssignmentsAction(assData));
      })
      .catch((err) => console.log(err));
  };
  const getAllIncompleteAssignments = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("AssignmentsInfo")
      .where("isComplete", "==", false)
      .get()
      .then((snapshot) => {
        const assData = firebaseLooper(snapshot);
        dispatch(storeStudentIncompleteAssignmentsAction(assData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleCompletedList = () => {
    if (completed) {
      return completed.map((ass, i) => {
        return (
          <div className="ass-main-block" key={i}>
            <div>
              <p className="ass-main-name">{ass.Name}</p>
              <p className="ass-main-teach">Teacher: {ass.Teacher}</p>
            </div>
            <div>
              <p className="ass-main-due"></p>
            </div>
          </div>
        );
      });
    }
  };
  const handleIncompleteList = () => {
    if (incomplete) {
      return incomplete.map((ass, i) => {
        return (
          <div className="ass-main-block" key={i}>
            <div>
              <p className="ass-main-name">{ass.Name}</p>
              <p className="ass-main-teach">Teacher: {ass.Teacher}</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button
                id={ass.id}
                onClick={navAssignmentView}
                className="btn-ass-go"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        );
      });
    }
  };

  //   NAV
  const navAssignmentView = (event) => {
    const assID = event.currentTarget.getAttribute("id");

    incomplete.forEach((ass) => {
      if (ass.id === assID) {
        teachers_Collection
          .doc(ass.Teacher)
          .collection("Assignments")
          .get()
          .then((snapshot) => {
            const assData = firebaseLooper(snapshot);
            assData.forEach((a) => {
              if (a.id === ass.AssID) {
                a = {
                  ...a,
                  Teacher: ass.Teacher,
                };
                dispatch(storeStudentAssignmentAction(a));
              }
            });
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/student-assignment-view");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllCompletedAssignments();
    getAllIncompleteAssignments();
  }, [completed, incomplete]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Assignments</h1>
        <div className="white-background">
          <p className="ass-main-head">Incomplete</p>
          {handleIncompleteList()}
        </div>
        <div className="white-background">
          <p className="ass-main-head">Complete</p>
          {handleCompletedList()}
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
