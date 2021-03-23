import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  teachers_Collection,
  students_Collection,
  studentReqQueue_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherStudentGeneralInfoAction,
  toggleStudentOverviewAction,
  toggleSearchUsernameAction,
  toggleSendRequestButtonAction,
  storeNewStudentAction,
  storeSingleStudentInfoAction,
  storeTeacherStudentLessonsAction,
  storeTeacherStudentExercisesAction,
  storeTeacherStudentQuizzesAction,
  storeTeacherStudentExamsAction,
} from "../../../redux/actions";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import RandomString from "../../RandomString";

export default function StudentsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // Toggles
  const toggleStudentOverview = useSelector(
    (state) => state.toggleStudentOverviewReducer
  );
  const toggleSearchUsername = useSelector(
    (state) => state.toggleSearchUsernameReducer
  );
  const toggleSendRequestState = useSelector(
    (state) => state.toggleSendRequestButtonReducer
  );
  // Data

  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );
  const student = useSelector((state) => state.storeSingleStudentInfoReducer);
  const searchResult = useSelector((state) => state.storeNewStudentReducer);

  const lessons = useSelector(
    (state) => state.storeTeacherStudentLessonsReducer
  );
  const exercises = useSelector(
    (state) => state.storeTeacherStudentExercisesReducer
  );
  const quizzes = useSelector(
    (state) => state.storeTeacherStudentQuizzesReducer
  );
  const exams = useSelector((state) => state.storeTeacherStudentExamsReducer);

  const getAllStudentGeneralInfo = () => {
    const student_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Students");
    student_Collection
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);
        const studCount = snapshot.size;
        // You now have student IDs, now get their data from the student table
        let studentArray = [];
        let count = 0;

        studentData.forEach((stud) => {
          students_Collection
            .where("StudentID", "==", stud.id)
            .get()
            .then((snapshot2) => {
              const studData = firebaseLooper(snapshot2);
              studentArray.push(studData[0]);

              if (studCount - 1 === count) {
                dispatch(storeTeacherStudentGeneralInfoAction(studentArray));
              }
              count = count + 1;
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  const getSingleStudentInfo = (event) => {
    const studentID = event.target.getAttribute("id");

    students.forEach((student) => {
      if (studentID === student.id) {
        dispatch(storeSingleStudentInfoAction(student));
        dispatch(toggleStudentOverviewAction());
        getStudentLessons(student.id);
        getStudentExercises(student.id);
        getStudentQuizzes(student.id);
        getStudentExams(student.id);
      }
    });
  };

  const getStudentLessons = (studentID) => {
    const lessons_Collection = students_Collection
      .doc(studentID)
      .collection("Lessons");
    lessons_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentLessonsAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getStudentExercises = (studentID) => {
    const exercises_Collection = students_Collection
      .doc(studentID)
      .collection("Exercises");
    exercises_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentExercisesAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getStudentQuizzes = (studentID) => {
    const quizzes_Collection = students_Collection
      .doc(studentID)
      .collection("Quizzes");

    quizzes_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentQuizzesAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getStudentExams = (studentID) => {
    const exams_Collection = students_Collection
      .doc(studentID)
      .collection("Exams");

    exams_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherStudentExamsAction(data));
      })
      .catch((err) => console.log(err));
  };

  const handleNewStudent = () => {
    // Hide Send Request button if necessary
    if (toggleSendRequestState) {
      dispatch(toggleSendRequestButtonAction());
    }

    const username = document.querySelector("#tbSearchUsername").value;

    // Get all Students
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Students")
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);

        studentData.forEach((student) => {
          if (student.id === username) {
            dispatch(storeNewStudentAction("Student is already enrolled."));
          }
        });
      })
      .catch((err) => console.log(err));

    // Get all Queues
    studentReqQueue_Collection
      .get()
      .then((snapshot) => {
        const queueData = firebaseLooper(snapshot);
        let found = false;
        queueData.forEach((que) => {
          if (que.StudentID === username) {
            found = true;
            dispatch(storeNewStudentAction("Request has been sent."));
          }
        });
        if (!found) {
          let doubleFound = false;
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Students")
            .get()
            .then((snapshot) => {
              const studentList = firebaseLooper(snapshot);
              studentList.forEach((s) => {
                if (s.id === username) {
                  doubleFound = true;
                }
              });

              if (!doubleFound) {
                students_Collection
                  .get()
                  .then((snapshot) => {
                    const studs = firebaseLooper(snapshot);
                    let valid = false;
                    studs.forEach((stud) => {
                      if (stud.id === username) {
                        valid = true;
                        const fullname = `${stud.FirstName} ${stud.LastName}`;
                        dispatch(storeNewStudentAction(fullname));
                        dispatch(toggleSendRequestButtonAction());
                      }
                    });
                    if (!valid) {
                      dispatch(storeNewStudentAction("Not found."));
                    }
                  })
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    //
  };
  const sendRequest = () => {
    const username = document.querySelector("#tbSearchUsername").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const reqID = `StudReq${rand1}${rand2}`;

    studentReqQueue_Collection
      .doc(reqID)
      .set({
        StudentID: username,
        TeacherID: teacherAuthID,
        isAccepted: false,
      })
      .catch((err) => console.log(err));

    dispatch(storeNewStudentAction("Request has been sent."));
    if (toggleSendRequestState) {
      dispatch(toggleSendRequestButtonAction());
    }
  };
  const closeForm = () => {
    if (toggleSearchUsername) {
      dispatch(toggleSearchUsernameAction());
    }
    if (toggleSendRequestState) {
      dispatch(toggleSendRequestButtonAction());
    }
    dispatch(storeNewStudentAction(""));
  };

  const OnStudentSearch = () => {
    const searchInput = document.querySelector("#tbStudentSearch").value;

    let filtered = [];

    if (searchInput !== "") {
      students.forEach((stud) => {
        let studID = stud.id;
        let fullName = `${stud.FirstName.toLowerCase()} ${stud.LastName.toLowerCase()}`;
        let email = stud.Email;

        if (studID.includes(searchInput)) {
          filtered.push(stud);
        } else if (fullName.includes(searchInput)) {
          filtered.push(stud);
        } else if (email.includes(searchInput)) {
          filtered.push(stud);
        }
      });

      dispatch(storeTeacherStudentGeneralInfoAction(filtered));
    } else {
      getAllStudentGeneralInfo();
    }
  };
  const handleStudentList = () => {
    return students.map((student, i) => {
      return (
        <div key={i}>
          <p>
            {student.FirstName} {student.LastName}
          </p>
          <p>{student.Email}</p>
          <p>{student.OverallGrade}</p>
          <button id={student.id} onClick={getSingleStudentInfo}>
            Overview
          </button>
          <button>Remove</button>
        </div>
      );
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllStudentGeneralInfo();
  }, []);

  return (
    <div>
      {/* TopBar */}
      <div>
        <TopBar />
      </div>

      {/* Main Content */}
      <div>
        <div>
          <h1>Students</h1>
        </div>

        <hr />

        <div>
          {toggleStudentOverview ? (
            <div>
              <div>
                <button onClick={() => dispatch(toggleStudentOverviewAction())}>
                  Close
                </button>
              </div>
              <h1>
                {student.FirstName} {student.LastName}
              </h1>
              <p>Email: {student.Email}</p>
              <p>Overall Grade: {student.OveralGrade}</p>
              <p>Subscriptions: </p>
              <ul>
                {student.Subscriptions.map((sub, i) => {
                  return <li key={i}>{sub}</li>;
                })}
              </ul>
              {/* Educational Info */}
              <div>
                {/* Lessons */}
                <div>
                  <h3>Lessons</h3>
                  {lessons.map((lesson, i) => {
                    return (
                      <div key={i}>
                        <p>
                          {lesson.id.replaceAll("_", " ")}:{" "}
                          {lesson.Completed ? "Complete" : "Not Complete"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Exercises */}
                <div>
                  <h3>Exercises</h3>
                  {exercises.map((exer, i) => {
                    return (
                      <div key={i}>
                        <p>
                          {exer.id.replaceAll("_", " ")}:{" "}
                          {exer.Completed ? "Complete" : "Not Complete"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Quizzes */}
                <div>
                  <h3>Quizzes</h3>
                  {quizzes.map((quiz, i) => {
                    return (
                      <div key={i}>
                        <p>
                          {quiz.id.replaceAll("_", " ")}:{" "}
                          {quiz.Completed ? "Complete" : "Not Complete"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Exams */}
                <div>
                  <h3>Exams</h3>
                  {exams.map((exam, i) => {
                    return (
                      <div key={i}>
                        <p>
                          {exam.id.replaceAll("_", " ")}:{" "}
                          {exam.Completed ? "Complete" : "Not Complete"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <hr />

        {/* Student Search */}
        <div>
          <input
            id="tbStudentSearch"
            type="text"
            onChange={OnStudentSearch}
            placeholder="Search for one of your students."
          />

          <div>
            <button
              onClick={() => {
                dispatch(toggleSearchUsernameAction());
              }}
            >
              Add New Student
            </button>
          </div>
          <br />
          {/* Request Stuff */}
          {toggleSearchUsername ? (
            <div>
              <button onClick={closeForm}>Close</button>
              <input
                id="tbSearchUsername"
                type="text"
                placeholder="Search by username"
              />
              <button onClick={handleNewStudent}>Search</button>
            </div>
          ) : null}
          <div>
            <br />
            {searchResult}
            {toggleSendRequestState ? (
              <button onClick={sendRequest}>Send Request</button>
            ) : null}
            <br />
            <hr />
          </div>
        </div>

        {/* Student List */}
        <div>{handleStudentList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
