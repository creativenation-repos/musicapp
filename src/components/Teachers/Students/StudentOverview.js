import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import "./Students.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherSingleStudentExersAction,
  storeTeacherSingleStudentLessonsAction,
  storeTeacherSingleStudentQuizzesAction,
  storeTeacherSingleStudentAssAction,
  storeTeacherSingleStudentMilestonesAction,
  toggleTeacherSingleStudentCompAction,
} from "../../../redux/actions";

export default function StudentOverview() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const student = useSelector(
    (state) => state.storeTeacherSingleStudentReducer
  );
  const compType = useSelector(
    (state) => state.toggleTeacherSingleStudentCompReducer
  );
  const lessons = useSelector(
    (state) => state.storeTeacherSingleStudentLessonsReducer
  );
  const exers = useSelector(
    (state) => state.storeTeacherSingleStudentExersReducer
  );
  const quizzes = useSelector(
    (state) => state.storeTeacherSingleStudentQuizzesReducer
  );
  const assignments = useSelector(
    (state) => state.storeTeacherSingleStudentAssReducer
  );
  const milestones = useSelector(
    (state) => state.storeTeacherSingleStudentMilestonesReducer
  );

  // GET
  const getAllLessons = () => {
    students_Collection
      .doc(student.id)
      .collection("CourseProgress")
      .get()
      .then((snapshot) => {
        const lessons = firebaseLooper(snapshot);
        let lessonArr = [];
        lessons.forEach((less) => {
          if (less.CompType === "Lesson") {
            lessonArr.push(less);
          }
        });
        dispatch(storeTeacherSingleStudentLessonsAction(lessonArr));
      })
      .catch((err) => console.log(err));
  };
  const getAllExercises = () => {
    students_Collection
      .doc(student.id)
      .collection("Exercises")
      .get()
      .then((snapshot) => {
        const exerData = firebaseLooper(snapshot);
        exerData.sort((a, b) => (a.Course > b.Course ? 1 : -1));
        dispatch(storeTeacherSingleStudentExersAction(exerData));
      })
      .catch((err) => console.log(err));
  };
  const getAllQuizzes = () => {
    students_Collection
      .doc(student.id)
      .collection("Quizzes")
      .get()
      .then((snapshot) => {
        const quizData = firebaseLooper(snapshot);
        const quizCount = snapshot.size;
        let allQuizzes = [];
        quizData.forEach((q, i) => {
          students_Collection
            .doc(student.id)
            .collection("Quizzes")
            .doc(q.id)
            .collection("Results")
            .get()
            .then((snapshot) => {
              const quizResults = firebaseLooper(snapshot);
              q = {
                ...q,
                Results: quizResults,
              };
              allQuizzes.push(q);
              if (i + 1 === quizCount) {
                dispatch(storeTeacherSingleStudentQuizzesAction(allQuizzes));
              }
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllAssignments = () => {
    students_Collection
      .doc(student.id)
      .collection("AssignmentsInfo")
      .get()
      .then((snapshot) => {
        const assData = firebaseLooper(snapshot);
        dispatch(storeTeacherSingleStudentAssAction(assData));
      })
      .catch((err) => console.log(err));
  };
  const getAllMilestones = () => {
    if (student.id) {
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Milestones")
        .where("AssignedTo", "array-contains", student.id)
        .get()
        .then((snapshot) => {
          const milestoneData = firebaseLooper(snapshot);
          const mileCount = snapshot.size;
          let mileArr = [];
          milestoneData.forEach((ms, i) => {
            teachers_Collection
              .doc(teacherAuthID)
              .collection("Milestones")
              .doc(ms.id)
              .collection("MilestoneTasks")
              .get()
              .then((snapshot) => {
                const msTasks = firebaseLooper(snapshot);
                ms = { ...ms, Tasks: msTasks };
                mileArr.push(ms);
                if (i + 1 === mileCount) {
                  dispatch(storeTeacherSingleStudentMilestonesAction(mileArr));
                }
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => console.log(err));
    }
  };

  //   HANDLE
  const handleCompType = () => {
    if (compType === "lessons") {
      return <div>{handleLessonBlock()}</div>;
    } else if (compType === "exercises") {
      return <div>{handleExersBlock()}</div>;
    } else if (compType === "quizzes") {
      return <div>{handleQuizzesBlock()}</div>;
    } else if (compType === "assignments") {
      return <div>{handleAssBlock()}</div>;
    } else if (compType === "milestones") {
      return <div>{handleMilestoneBlock()}</div>;
    } else if (compType === "all") {
      return (
        <div>
          <div>{handleLessonBlock()}</div>
          <div>{handleExersBlock()}</div>
          <div>{handleQuizzesBlock()}</div>
          <div>{handleAssBlock()}</div>
          <div>{handleMilestoneBlock()}</div>
        </div>
      );
    }
  };

  const handleStudentPersonal = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">
          {student.FirstName} {student.LastName}
        </h2>
        <p className="small-text">{student.Email}</p>
        <div className="overall-grade">
          {/* icon */}
          <FontAwesomeIcon className="icon-grade" icon={faGraduationCap} />
          <p>{student.OverallGrade ? student.OverallGrade : null}%</p>
        </div>
      </div>
    );
  };
  const handleLessonBlock = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">Lessons</h2>
        <table className="comp-table">
          <tr className="comp-table-row">
            <th>Course</th>
            <th>Lesson</th>
            <th>Completion Time</th>
          </tr>
          {handleLessonList()}
        </table>
      </div>
    );
  };
  const handleLessonList = () => {
    return lessons.map((less, i) => {
      return (
        <tr key={i} className="comp-table-row">
          <td className="list-head">{less.CourseName}</td>
          <td className="list-head">{less.CompName}</td>
          <td className="list-head">30 MIN</td>
        </tr>
      );
    });
  };
  const handleExersBlock = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">Exercises</h2>
        <table className="comp-table">
          <tr className="comp-table-row">
            <th>Course</th>
            <th>Exercise</th>
            <th>Completion Time</th>
            <th>Response</th>
          </tr>
          {handleExerList()}
        </table>
      </div>
    );
  };
  const handleExerList = () => {
    return exers.map((exer, i) => {
      return (
        <tr key={i} className="comp-table-row">
          <td className="list-head">{exer.Course}</td>
          <td className="list-head">{exer.Name}</td>
          <td className="list-head">35 MIN</td>
          <td className="list-head">{exer.Response}</td>
        </tr>
      );
    });
  };
  const handleQuizzesBlock = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">Quizzes</h2>
        {handleQuizzesList()}
      </div>
    );
  };
  const handleQuizzesList = () => {
    return quizzes.map((quiz, i) => {
      return (
        <div key={i}>
          <h2 className="quiz-head">{quiz.Name}</h2>
          <table className="comp-table">
            <tr className="comp-table-row">
              <th>Student Answer</th>
              <th>Correct Answer</th>
              <th>Result</th>
            </tr>
            {handleQuizResults(quiz.Results)}
          </table>
        </div>
      );
    });
  };
  const handleQuizResults = (results) => {
    return results.map((res, i) => {
      return (
        <tr className="comp-table-row" key={i}>
          <td className="list-head">{res.Given}</td>
          <td className="list-head">{res.Answer}</td>
          <td
            style={
              res.Result === "Correct"
                ? { color: "green" }
                : res.Result === "Incorrect"
                ? { color: "red" }
                : { color: "rgba(0,0,0,0.3" }
            }
            className="list-head"
          >
            {res.Result}
          </td>
        </tr>
      );
    });
  };
  const handleAssBlock = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">Assignments</h2>
        <table className="comp-table">
          <tr className="comp-table-row">
            <th>Name</th>
            <th>Completion Date</th>
            <th>Description</th>
            <th>Response</th>
            <th>Rating</th>
            <th>Concerns</th>
            <th>Time</th>
          </tr>
          {handleAssList()}
        </table>
      </div>
    );
  };
  const handleAssList = () => {
    return assignments.map((ass, i) => {
      if (ass.Rating) {
        return (
          <tr key={i} className="comp-table-row">
            <td className="list-head">{ass.Name}</td>
            <td className="list-head">
              {ass.CompletionDate
                ? ass.CompletionDate.toDate().toString().substr(4, 11)
                : null}
            </td>
            <td className="list-head">{ass.Desc}</td>
            <td className="list-head">N/A</td>
            <td className="list-head">{ass.Rating}</td>
            <td className="list-head">{ass.Concerns}</td>
            <td className="list-head">{ass.Time}</td>
          </tr>
        );
      } else {
        // Textual Assignment
        <tr key={i} className="comp-table-row">
          <td className="list-head">{ass.Name}</td>
          <td className="list-head">
            {ass.CompletionDate
              ? ass.CompletionDate.toDate().toString().substr(4, 11)
              : "N/A"}
          </td>
          <td className="list-head">{ass.Desc}</td>
          <td className="list-head">{ass.Response}</td>
          <td className="list-head">N/A</td>
          <td className="list-head">N/A</td>
          <td className="list-head">{ass.Time}</td>
        </tr>;
      }
    });
  };
  const handleMilestoneBlock = () => {
    return (
      <div className="student-block">
        <h2 className="block-head">Milestones</h2>
        <table className="comp-table">
          <tr className="comp-table-row">
            <th>Segment Name</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Complete</th>
          </tr>
          {handleMilestoneList()}
        </table>
      </div>
    );
  };
  const handleMilestoneList = () => {
    return milestones.map((ms, i) => {
      return handleMilestoneTasks(i);
    });
  };
  const handleMilestoneTasks = (milestoneIdx) => {
    return milestones[milestoneIdx].Tasks.map((task, i) => {
      return (
        <tr key={i} className="comp-table-row">
          <td className="list-head">{milestones[milestoneIdx].Name}</td>
          <td className="list-head">{task.Task}</td>
          <td className="list-head">{task.Desc}</td>
          <td className="list-head">
            <input
              id={`${milestones[milestoneIdx].id}-${task.id}`}
              onChange={onMilestoneChange}
              type="checkbox"
            />
          </td>
        </tr>
      );
    });
  };

  // POST
  const onMilestoneChange = (event) => {
    const cbID = event.target.getAttribute("id");
    const idArr = event.target.getAttribute("id").split("-");
    // Change the isComplete to true and mark it as complete in their milestones page.
    const segID = idArr[0];
    const taskID = idArr[1];

    const cbStatus = document.querySelector(`#${cbID}`).checked;

    // Mark as complete in DB
    students_Collection
      .doc(student.id)
      .collection("Milestones")
      .doc(segID)
      .collection("MilestoneTasks")
      .doc(taskID)
      .update({
        isComplete: cbStatus,
      })
      .catch((err) => console.log(err));
  };

  const rerender = () => {
    getAllLessons();
    getAllExercises();
    getAllQuizzes();
    getAllAssignments();
    getAllMilestones();
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllLessons();
    getAllExercises();
    getAllQuizzes();
    getAllAssignments();
    getAllMilestones();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div className="content">
      <h1>Student Overview</h1>
        <button style={{ display: "none" }} onClick={rerender()}>
          Rerender
        </button>
        {/* Personal */}
        {handleStudentPersonal()}
        <button
          id="btnLessons"
          className="btn-comp"
          onClick={() =>
            dispatch(toggleTeacherSingleStudentCompAction("lessons"))
          }
        >
          Lessons
        </button>
        <button
          id="btnExers"
          className="btn-comp"
          onClick={() =>
            dispatch(toggleTeacherSingleStudentCompAction("exercises"))
          }
        >
          Exercises
        </button>
        <button
          id="btnQuizzes"
          className="btn-comp"
          onClick={() =>
            dispatch(toggleTeacherSingleStudentCompAction("quizzes"))
          }
        >
          Quizzes
        </button>
        <button
          id="btnAss"
          className="btn-comp"
          onClick={() =>
            dispatch(toggleTeacherSingleStudentCompAction("assignments"))
          }
        >
          Assignments
        </button>
        <button
          id="btnMiles"
          className="btn-comp"
          onClick={() =>
            dispatch(toggleTeacherSingleStudentCompAction("milestones"))
          }
        >
          Milestones
        </button>
        <button
          id="btnAll"
          className="btn-comp"
          onClick={() => dispatch(toggleTeacherSingleStudentCompAction("all"))}
        >
          All
        </button>

        {/* Comps */}
        <div>{handleCompType()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
