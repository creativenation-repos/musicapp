import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./Students.css";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";
import {
  students_Collection,
  teachers_Collection,
  studentReqQueue_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherStudentGeneralInfoAction,
  storeTeacherSingleStudentAction,
  storeTeacherQueueRequestsAction,
  storeTeacherExistingStudentsAction,
  toggleTeacherAddStudentFormAction,
  storeTeacherAddStudentSearchResultAction,
} from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faSearch,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function StudentsMain() {
  const user = useSelector((state) => state.userDataReducer);
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // TOGGLE
  const toggleAddStudentForm = useSelector(
    (state) => state.toggleTeacherAddStudentFormReducer
  );

  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );

  const existingStuds = useSelector(
    (state) => state.storeTeacherExistingStudentsReducer
  );
  const queueRequests = useSelector(
    (state) => state.storeTeacherQueueRequestsReducer
  );
  const searchRes = useSelector(
    (state) => state.storeTeacherAddStudentSearchResultReducer
  );

  // GET
  const getAllStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentList = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentGeneralInfoAction(studentList));
      })
      .catch((err) => console.log(err));
  };
  const checkForExistingStudents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);
        const studentArr = [];
        studentData.forEach((stud) => {
          studentArr.push(stud.id);
        });
        dispatch(storeTeacherExistingStudentsAction(studentArr));

        studentReqQueue_Collection
          .get()
          .then((snapshot) => {
            const queueData = firebaseLooper(snapshot);
            const queueArr = [];
            queueData.forEach((que) => {
              queueArr.push(que.StudentID);
            });

            dispatch(storeTeacherQueueRequestsAction(queueArr));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleStudentList = () => {
    return students.map((stud, i) => {
      return (
        <div className="studListBlock" key={i}>
          <h3 className="studListComp studName">
            {stud.FirstName} {stud.LastName}
          </h3>
          <p className="studListComp studID">{stud.id}</p>
          <p className="studListComp studEmail">{stud.Email}</p>
          <div className="rightSide" style={{ display: "flex" }}>
            <button
              className="btnStudList btnStudOver"
              onClick={navStudentOverview}
              id={stud.id}
            >
              Overview
            </button>
            <button className="btnStudList btnStudRemove">
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        </div>
      );
    });
  };
  const handleAddStudentForm = () => {
    return (
      <div className="addStudForm">
        <p className="addStudDesc">Search using student username.</p>
        <div className="flex">
          <input id="tbStudSearch" type="text" placeholder="Search" />
          <button className="btnAddStudForm" onClick={onAddStudentClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div>
          {/* Student search thing */}
          {searchRes ? handleSearchResult() : null}
        </div>
      </div>
    );
  };
  const handleSearchResult = () => {
    return (
      <div className="searchResWrapper">
        <p className="reqBox">
          {searchRes.FirstName} {searchRes.LastName}
        </p>
        <p className="reqBox">{searchRes.StudentID}</p>
        {searchRes.StudentID !== "" ? (
          <button className="btnSendReq" onClick={sendRequest}>
            Send Request
          </button>
        ) : null}
      </div>
    );
  };

  // CLICK
  const onAddStudentClick = () => {
    const studRes = document.querySelector("#tbStudSearch").value;
    const allExistingStuds = existingStuds.concat(queueRequests);

    if (allExistingStuds.includes(studRes)) {
      // Exists
      const student = {
        FirstName: "Student is not available for request.",
        LastName: "",
        StudentID: "",
      };
      dispatch(storeTeacherAddStudentSearchResultAction(student));
    } else {
      // Does not exist

      // Search for student in DB
      students_Collection
        .get()
        .then((snapshot) => {
          const studentList = firebaseLooper(snapshot);
          studentList.forEach((stud) => {
            if (studRes === stud.id) {
              dispatch(storeTeacherAddStudentSearchResultAction(stud));
            }
          });
          if (!searchRes) {
            const student = {
              FirstName: "Student ID does not exist",
              LastName: "",
              StudentID: "",
            };
            dispatch(storeTeacherAddStudentSearchResultAction(student));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const sendRequest = () => {
    // Send Request here
    const rand1 = RandomString();
    const rand2 = RandomString();

    const reqID = `Req${rand1}${rand2}`;
    const notifID = `Notif${rand1}${rand2}`;

    studentReqQueue_Collection
      .doc(reqID)
      .set({
        StudentID: searchRes.StudentID,
        TeacherID: teacherAuthID,
        TFirstName: user.FirstName,
        TLastName: user.LastName,
      })
      .catch((err) => console.log(err));

    students_Collection
      .doc(searchRes.StudentID)
      .collection("Notifications")
      .doc(notifID)
      .set({
        Action: "studrequest",
        Date: GetToday(),
        Icon: "faUser",
        Text: `You have received a request from ${user.FirstName} ${user.LastName} as your instructor.`,
      })
      .catch((err) => console.log(err));

    document.querySelector("#tbStudSearch").value = "";

    const student = {
      FirstName: "Request has been sent.",
      LastName: "",
      StudentID: "",
    };
    dispatch(storeTeacherAddStudentSearchResultAction(student));

    // Dispatch
    const allReqs = [...queueRequests];
    allReqs.push({
      StudentID: searchRes.StudentID,
      TeacherID: teacherAuthID,
      TFirstName: user.FirstName,
      TLastName: user.LastName,
    });
    dispatch(storeTeacherQueueRequestsAction(allReqs));
  };

  // NAV
  const navStudentOverview = (event) => {
    const studID = event.target.getAttribute("id");

    students.forEach((stud) => {
      if (stud.id === studID) {
        students_Collection
          .where("StudentID", "==", stud.id)
          .get()
          .then((snapshot) => {
            const student = firebaseLooper(snapshot);
            student.forEach((s) => {
              dispatch(storeTeacherSingleStudentAction(s));
            });
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/teacher-student-overview");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllStudents();
    checkForExistingStudents();
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
          <h1>Students</h1>
          <button
            className="btnAddStud"
            onClick={() => dispatch(toggleTeacherAddStudentFormAction())}
          >
            {toggleAddStudentForm ? "Close" : "Add New Student"}
          </button>
          {toggleAddStudentForm ? handleAddStudentForm() : null}
        </div>

        {/* Student List */}
        <div className="studListWrapper">{handleStudentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
