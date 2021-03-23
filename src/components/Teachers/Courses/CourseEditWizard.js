import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import RandomString from "../../RandomString";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Sortable } from "react-sortablejs";

import {
  toggleCourseTypeEditAction,
  storeShortOptionsAction,
  toggleExerciseTypeOptionAction,
  storeQuizComponentsAction,
  storeTeacherCourseGeneralInfoAction,
  toggleNewLessonFormAction,
  storeLessonCountAction,
  storeSingleCourseLessonsAction,
  toggleEditLessonFormAction,
  storeSingleCourseLessonAction,
  storeSingleCourseExersAction,
  storeSingleCourseExerAction,
  storeSingleCourseQuizzesAction,
} from "../../../redux/actions";
import { courses_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

import CourseEditWizardStyles from "./CourseEditWizardStyles.css";

export default function CourseEditWizard() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleCourseTypeState = useSelector(
    (state) => state.toggleCourseTypeEditReducer
  );
  const toggleNewCompFormState = useSelector(
    (state) => state.toggleNewLessonFormReducer
  );
  const toggleEditCompFormState = useSelector(
    (state) => state.toggleEditLessonFormReducer
  );
  const exerciseTypeState = useSelector(
    (state) => state.toggleExerciseTypeOptionReducer
  );

  const courses = useSelector(
    (state) => state.storeTeacherCourseGeneralInfoReducer
  );

  const course = useSelector((state) => state.storeSingleCourseReducer);
  const lessons = useSelector((state) => state.storeSingleCourseLessonsReducer);
  const exercises = useSelector((state) => state.storeSingleCourseExersReducer);
  const quizzes = useSelector((state) => state.storeSingleCourseQuizzesReducer);
  // Extras
  const options = useSelector((state) => state.storeShortOptionsReducer);
  const compCount = useSelector((state) => state.storeLessonCountReducer);
  const editLesson = useSelector(
    (state) => state.storeSingleCourseLessonReducer
  );
  const editExer = useSelector((state) => state.storeSingleCourseExerReducer);

  const quizComponents = useSelector(
    (state) => state.storeQuizComponentsReducer
  );

  const handleCourseType = () => {
    if (toggleCourseTypeState === "lessons") {
      return (
        <div>
          <div>
            <h3>Lessons</h3>
            <p>
              Choose or change the order of any lesson displayed below. Keep in
              mind that changing the order of the Lessons does not change the
              order of the Exercises or Quizzes.
            </p>
            <br />
            <button onClick={() => dispatch(toggleNewLessonFormAction())}>
              {toggleNewCompFormState ? "Close" : "Add New Lesson"}
            </button>
            {toggleNewCompFormState ? <div>{handleNewComp()}</div> : null}
            {toggleEditCompFormState ? <div>{handleEditComp()}</div> : null}
            <hr />
            {/* Lesson List */}
            <ul id="lessons">
              {lessons.map((lesson, i) => {
                return (
                  <li
                    id={lesson.id}
                    onDragEnd={dragEnd}
                    className="draggable"
                    key={i}
                  >
                    <FontAwesomeIcon className="dragIcon" icon={faBars} />
                    {lesson.Name}
                    <button id={lesson.id} className="btn btnRemove">
                      Remove
                    </button>
                    <button
                      id={lesson.id}
                      onClick={onCompEditClick}
                      className="btn btnEdit"
                    >
                      Edit
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else if (toggleCourseTypeState === "exercises") {
      return (
        <div>
          <div>
            <h3>Exercises</h3>
            <p>
              Choose or change the order of any exercise displayed below. Keep
              in mind that changing the order of the Exercises does not change
              the order of the Lessons or Quizzes.
            </p>
            <br />
            <button onClick={() => dispatch(toggleNewLessonFormAction())}>
              {toggleNewCompFormState ? "Close" : "Add New Exercise"}
            </button>
            {toggleNewCompFormState ? <div>{handleNewComp()}</div> : null}
            {toggleEditCompFormState ? <div>{handleEditComp()}</div> : null}
            <hr />
            {/* Lesson List */}
            <ul id="exercises">
              {exercises.map((exer, i) => {
                return (
                  <li
                    id={exer.id}
                    onDragEnd={dragEnd}
                    className="draggable"
                    key={i}
                  >
                    <FontAwesomeIcon className="dragIcon" icon={faBars} />
                    {exer.Name}
                    <button id={exer.id} className="btn btnRemove">
                      Remove
                    </button>
                    <button
                      id={exer.id}
                      onClick={onCompEditClick}
                      className="btn btnEdit"
                    >
                      Edit
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else if (toggleCourseTypeState === "quizzes") {
      return (
        <div>
          <div>
            <h3>Quizzes</h3>
            <p>
              Choose or change the order of any quiz displayed below. Keep in
              mind that changing the order of the Quizzes does not change the
              order of the Lessons or Exercises.
            </p>
            <br />
            <button onClick={() => dispatch(toggleNewLessonFormAction())}>
              {toggleNewCompFormState ? "Close" : "Add New Quiz"}
            </button>
            {toggleNewCompFormState ? <div>{handleNewComp()}</div> : null}
            <hr />
            {/* Lesson List */}
            <ul id="quizzes">
              {quizzes.map((quiz, i) => {
                return (
                  <li
                    id={quiz.id}
                    onDragEnd={dragEnd}
                    className="draggable"
                    key={i}
                  >
                    <FontAwesomeIcon className="dragIcon" icon={faBars} />
                    {quiz.Name}
                    <button id={quiz.id} className="btn btnRemove">
                      Remove
                    </button>
                    <button
                      id={quiz.id}
                      onClick={onCompEditClick}
                      className="btn btnEdit"
                    >
                      Edit
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  };
  // Lesson Stuffs
  const handleOptions = () => {
    return options.map((opt, i) => {
      return (
        <div key={i}>
          <input
            id={`tbShortOption${i}`}
            type="text"
            placeholder={`Option ${i + 1}`}
          />
          <button id={opt} onClick={removeOption}>
            -
          </button>
        </div>
      );
    });
  };
  const handleEditOptions = () => {
    return options.map((opt, i) => {
      return (
        <div key={i}>
          <input id={`tbShortOption${i}`} type="text" defaultValue={opt} />
          <button id={opt} onClick={removeOption}>
            -
          </button>
        </div>
      );
    });
  };
  const removeOption = (event) => {
    const optionText = event.target.getAttribute("id");

    const allOptions = [...options];
    const filtered = allOptions.filter((opt) => opt !== optionText);

    dispatch(storeShortOptionsAction(filtered));
  };
  const addOption = () => {
    const allOptions = [...options];
    const optionCount = allOptions.length;

    allOptions.push(`Option ${optionCount + 1}`);

    dispatch(storeShortOptionsAction(allOptions));
  };
  const getCompCount = () => {
    if (toggleCourseTypeState === "lessons") {
      courses_Collection
        .doc(course.id)
        .collection("Lessons")
        .get()
        .then((snapshot) => {
          const count = snapshot.size;
          dispatch(storeLessonCountAction(count));
        })
        .catch((err) => console.log(err));
    } else if (toggleCourseTypeState === "exercises") {
      courses_Collection
        .doc(course.id)
        .collection("Exercises")
        .get()
        .then((snapshot) => {
          const count = snapshot.size;
          dispatch(storeLessonCountAction(count));
        })
        .catch((err) => console.log(err));
    }
  };

  // Exercise Stuffs
  const handleExerciseWizard = () => {
    if (exerciseTypeState === "textual") {
      return (
        <div>
          <h2>Textual Exercise</h2>
          <p>
            Creating a textual exercise requires a prompt. This can be in the
            form of a question, sentence, or a paragraph. We recommend to
            provide a detailed prompt for the student to provide and adequate
            response.
          </p>
          <br />
          <textarea
            id="taTextualExer"
            placeholder="Type prompt here.."
          ></textarea>
        </div>
      );
    }
  };
  const handleEditExerciseWizard = () => {
    if (exerciseTypeState === "textual") {
      return (
        <div>
          <h2>Textual Exercise</h2>
          <p>
            Creating a textual exercise requires a prompt. This can be in the
            form of a question, sentence, or a paragraph. We recommend to
            provide a detailed prompt for the student to provide and adequate
            response.
          </p>
          <br />
          <textarea id="taTextualExer" defaultValue={editExer.Text}></textarea>
        </div>
      );
    }
  };
  const chooseExercise = () => {
    const textualOpt = document.querySelector("#raTextual").checked;

    if (textualOpt) {
      dispatch(toggleExerciseTypeOptionAction("textual"));
    }
  };

  // Quiz Stuffs
  const handleQuizComponents = () => {
    return quizComponents.map((q, i) => {
      if (q.Type === "multiple") {
        return (
          <div
            style={{
              border: "3px solid blue",
              padding: "2%",
              margin: "2%",
              backgroundColor: "rgba(0,0,255,0.2)",
            }}
          >
            <h3>Multiple Choice</h3>
            <div>
              <h4>Question</h4>
              <input id={`tbQui${i}`} type="text" placeholder="Question" />
            </div>
            <div>
              <h4>Options</h4>
              {q.Options.map((opt, a) => {
                return (
                  <div>
                    <input
                      id={`tbOpt${i}-${a}`}
                      type="text"
                      placeholder={opt}
                    />
                  </div>
                );
              })}
            </div>
            <div>
              <h4>Answer</h4>
              <input id={`tbAns${i}`} type="text" placeholder="Answer" />
            </div>

            <div>
              <button id={q.TempID} onClick={removeQuizComponent}>
                Remove
              </button>
            </div>
          </div>
        );
      } else if (q.Type === "short") {
        return (
          <div
            style={{
              border: "3px solid green",
              padding: "2%",
              margin: "2%",
              backgroundColor: "rgba(0,255,0,0.2)",
            }}
          >
            <h3>Short Answer</h3>
            <div>
              <h4>Prompt</h4>
              <textarea
                id={`taShortPrompt${i}`}
                placeholder="Prompt"
              ></textarea>
            </div>
            <div>
              <h4>Answer</h4>
              <input id={`tbShortAns${i}`} type="text" placeholder="Answer" />
            </div>

            <div>
              <button id={q.TempID} onClick={removeQuizComponent}>
                Remove
              </button>
            </div>
          </div>
        );
      } else if (q.Type === "long") {
        return (
          <div
            style={{
              border: "3px solid red",
              padding: "2%",
              margin: "2%",
              backgroundColor: "rgba(255,0,0,0.2)",
            }}
          >
            <h3>Long Answer</h3>
            <div>
              <h4>Prompt</h4>
              <textarea id={`taLongPrompt${i}`} placeholder="Prompt"></textarea>
            </div>
            <div>
              <h4>Answer</h4>
              <textarea id={`taLongAns${i}`} placeholder="Answer"></textarea>
            </div>

            <div>
              <button id={q.TempID} onClick={removeQuizComponent}>
                Remove
              </button>
            </div>
          </div>
        );
      } else if (q.Type === "boolean") {
        return (
          <div
            style={{
              border: "3px solid purple",
              padding: "2%",
              margin: "2%",
              backgroundColor: "rgba(50.2,0,50.2,0.2)",
            }}
          >
            <h3>True or False</h3>
            <div>
              <h4>Statement</h4>
              <input id={`tbBoolStatement${i}`} placeholder="Statement" />
            </div>
            <div>
              <h4>Answer</h4>
              <input type="radio" id="raTrue" name="raBool" value="true" />
              <label for="raTrue">True</label>
              <br />
              <input type="radio" id="raFalse" name="raBool" value="false" />
              <label for="raFalse">False</label>
            </div>

            <div>
              <button id={q.TempID} onClick={removeQuizComponent}>
                Remove
              </button>
            </div>
          </div>
        );
      }
    });
  };
  const removeQuizComponent = (event) => {
    const compID = event.target.getAttribute("id");
    const allQuizComps = [...quizComponents];

    const filtered = allQuizComps.filter((comp) => comp.TempID !== compID);
    console.log(filtered);
    dispatch(storeQuizComponentsAction(filtered));
  };

  // Extra Stuffs
  const handleNewComp = () => {
    if (toggleCourseTypeState === "lessons") {
      return (
        <div>
          <h2>Create a Lesson</h2>
          <br />

          {/* Lesson Name */}
          <div>
            <h3>Lesson Name</h3>
            <input id="tbLessonName" type="text" placeholder="Lesson Name" />
          </div>

          <br />
          {/* Upload Video */}
          <div>
            <h3>1. Upload a Video Lesson</h3>
            <p>Video Upload Here</p>
          </div>

          {/* Insert Text */}
          <div>
            <h3>2. Type your Textual Lesson</h3>
            <p>
              The text provided will be displayed beneath the video lesson. It
              is recommended to provide textual lesson reflecting the video for
              students who may experience auditory issues.
            </p>
            <div>
              <textarea
                id="taTextualLesson"
                placeholder="Type Textual Lesson here.."
              ></textarea>
            </div>
          </div>

          {/* Insert Question */}
          <div>
            <h3>3. Provide a Lesson Question</h3>
            <p>
              To make sure each student understands the lesson, we are providing
              this section where the teacher can insert a question. Not
              providing a question will allow the student to continue to the
              next component as soon as the video is over. However, answering
              the question will also be required to move on, if one was
              provided.
            </p>
            <br />
            <div>
              <label>Question</label>
              <input id="tbShortQuestion" type="text" placeholder="Question" />
            </div>
            <div>
              <label>Options</label>
              {handleOptions()}
              <button onClick={addOption}>+</button>
            </div>
            <div>
              <label>Answer</label>
              <input id="tbShortAnswer" type="text" placeholder="Answer" />
            </div>
          </div>

          <br />
          {/* Lesson Options */}
          <div>
            <button onClick={saveComp}>Save</button>
          </div>
        </div>
      );
    } else if (toggleCourseTypeState === "exercises") {
      return (
        <div>
          <h2>Create Exercise</h2>
          <p>
            Exercises can be used to further enhance the lesson that was
            provided. The exercise will be named after the lesson that was
            created beforehand.
          </p>
          <br />
          {/* Choose lesson to attach to */}
          <div>
            <h3>Exercise Name</h3>
            <p>
              Each exercise should be partnered with a lesson. Before you
              continue, please consider creating a lesson first to provide a
              secure flow to the course.
            </p>
            <br />
            {/* Show lessons without an exercise */}
            <input id="tbNewExerName" type="text" placeholder="Exercise Name" />
          </div>

          {/* Exercise Types */}

          <div>
            <h3>Choose your exercise type:</h3>
            <p>
              Below, you will find different exercise type options. Hover over
              the image to get a glimpse of what the student would be doing.
            </p>
            <br />
            <input
              onChange={chooseExercise}
              type="radio"
              id="raTextual"
              name="raExercises"
              value="textual"
              checked="checked"
            />
            <label for="textual">Textual</label>
          </div>

          {/* Here is the mini wizard for exercises depending on what the user chooses. */}
          <div>{handleExerciseWizard()}</div>

          <div>
            <button onClick={saveComp}>Save</button>
          </div>
        </div>
      );
    } else if (toggleCourseTypeState === "quizzes") {
      return (
        <div>
          <h2>Create Quiz</h2>
          <p>
            Quizzes are meant to be a way for students to test their knowledge
            on what they learned in the lesson and exercise.
          </p>
          <br />
          <div>
            <h3>Quiz Name</h3>
            <p>
              Each quiz should be partnered with a lesson and exercise. Before
              you continue, please consider creating a lesson and exercise first
              to provide a secure flow to the course.
            </p>

            <input id="tbQuizName" type="text" placeholder="Quiz Name" />
          </div>

          {/* Quiz Component Picker */}
          <div
            style={{
              border: "3px solid black",
              width: "15%",
              padding: "1%",
              backgroundColor: "rgba(0,0,0,0.15)",
              float: "right",
              marginRight: "2%",
            }}
          >
            <h3>Quiz Component Types</h3>
            <div>
              <button
                onClick={() => {
                  const tempID = `comp${RandomString()}`;
                  const obj = {
                    TempID: tempID,
                    Type: "multiple",
                    Question: "Question",
                    Options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    Answer: "Answer",
                  };
                  const allObjs = [...quizComponents];
                  allObjs.push(obj);
                  dispatch(storeQuizComponentsAction(allObjs));
                }}
              >
                Multiple Choice
              </button>
              <br />
              <button
                onClick={() => {
                  const tempID = `comp${RandomString()}`;
                  const obj = {
                    TempID: tempID,
                    Type: "short",
                    Text: "Prompt",
                    Answer: "",
                  };
                  const allObjs = [...quizComponents];
                  allObjs.push(obj);
                  dispatch(storeQuizComponentsAction(allObjs));
                }}
              >
                Short Answer
              </button>
              <br />
              <button
                onClick={() => {
                  const tempID = `comp${RandomString()}`;
                  const obj = {
                    TempID: tempID,
                    Type: "long",
                    Text: "Prompt",
                    Answer: "",
                  };
                  const allObjs = [...quizComponents];
                  allObjs.push(obj);
                  dispatch(storeQuizComponentsAction(allObjs));
                }}
              >
                Long Answer
              </button>
              <br />
              <button
                onClick={() => {
                  const tempID = `comp${RandomString()}`;
                  const obj = {
                    TempID: tempID,
                    Type: "boolean",
                    Statement: "",
                    Answer: "",
                  };
                  const allObjs = [...quizComponents];
                  allObjs.push(obj);
                  dispatch(storeQuizComponentsAction(allObjs));
                }}
              >
                True / False
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            <h3>Quiz Editor</h3>
            {/* Components */}
            <div>{handleQuizComponents()}</div>
            <br />

            {/* Quiz Options */}
            <button>Save</button>
          </div>
        </div>
      );
    }
  };
  const handleEditComp = () => {
    if (toggleCourseTypeState === "lessons") {
      return (
        <div>
          <h2>Edit Lesson</h2>
          <br />

          {/* Lesson Name */}
          <div>
            <h3>Lesson Name</h3>
            <input
              id="tbLessonName"
              type="text"
              defaultValue={editLesson.Name}
            />
          </div>

          <br />
          {/* Upload Video */}
          <div>
            <h3>1. Upload a Video Lesson</h3>
            <p>Video Upload Here</p>
          </div>

          {/* Insert Text */}
          <div>
            <h3>2. Type your Textual Lesson</h3>
            <p>
              The text provided will be displayed beneath the video lesson. It
              is recommended to provide textual lesson reflecting the video for
              students who may experience auditory issues.
            </p>
            <div>
              <textarea
                id="taTextualLesson"
                defaultValue={editLesson.Text}
              ></textarea>
            </div>
          </div>

          {/* Insert Question */}
          <div>
            <h3>3. Provide a Lesson Question</h3>
            <p>
              To make sure each student understands the lesson, we are providing
              this section where the teacher can insert a question. Not
              providing a question will allow the student to continue to the
              next component as soon as the video is over. However, answering
              the question will also be required to move on, if one was
              provided.
            </p>
            <br />
            <div>
              <label>Question</label>
              <input
                id="tbShortQuestion"
                type="text"
                defaultValue={editLesson.Question}
              />
            </div>
            <div>
              <label>Options</label>
              {handleEditOptions()}
              <button onClick={addOption}>+</button>
            </div>
            <div>
              <label>Answer</label>
              <input
                id="tbShortAnswer"
                type="text"
                defaultValue={editLesson.Answer}
              />
            </div>
          </div>

          <br />
          {/* Lesson Options */}
          <div>
            <button onClick={saveEditComp}>Save</button>
          </div>
        </div>
      );
    } else if (toggleCourseTypeState === "exercises") {
      return (
        <div>
          <h2>Create Exercise</h2>
          <p>
            Exercises can be used to further enhance the lesson that was
            provided. The exercise will be named after the lesson that was
            created beforehand.
          </p>
          <br />
          {/* Choose lesson to attach to */}
          <div>
            <h3>Choose the lesson to match with:</h3>
            <p>
              Each exercise should be partnered with a lesson. Before you
              continue, please consider creating a lesson first to provide a
              secure flow to the course.
            </p>
            <br />
            {/* Show lessons without an exercise */}
            <input
              id="tbNewExerName"
              type="text"
              defaultValue={editExer.Name}
            />
          </div>

          {/* Exercise Types */}

          <div>
            <h3>Choose your exercise type:</h3>
            <p>
              Below, you will find different exercise type options. Hover over
              the image to get a glimpse of what the student would be doing.
            </p>
            <br />
            <input
              onChange={chooseExercise}
              type="radio"
              id="raTextual"
              name="raExercises"
              value="textual"
              checked="checked"
            />
            <label for="textual">Textual</label>
          </div>

          {/* Here is the mini wizard for exercises depending on what the user chooses. */}
          <div>{handleEditExerciseWizard()}</div>

          <div>
            <button onClick={saveEditComp}>Save</button>
          </div>
        </div>
      );
    }
  };
  const onCompEditClick = (event) => {
    if (toggleCourseTypeState === "lessons") {
      dispatch(toggleEditLessonFormAction());
      const lessonID = event.target.getAttribute("id");
      let tempLesson = {};
      lessons.forEach((less) => {
        if (less.id === lessonID) {
          tempLesson = less;
        }
      });

      dispatch(storeShortOptionsAction(tempLesson.Options));

      dispatch(storeSingleCourseLessonAction(tempLesson));
    } else if (toggleCourseTypeState === "exercises") {
      dispatch(toggleEditLessonFormAction());
      const exerID = event.target.getAttribute("id");
      let tempExer = {};
      exercises.forEach((exer) => {
        if (exer.id === exerID) {
          tempExer = exer;
        }
      });

      dispatch(storeSingleCourseExerAction(tempExer));
    }
  };
  const saveComp = () => {
    if (toggleCourseTypeState === "lessons") {
      const lessonName = document.querySelector("#tbLessonName").value;

      //   Get Video Lesson Path here

      // Get Textual Lesson
      const lessonText = document.querySelector("#taTextualLesson").value;

      // Get Question components
      const shortQui = document.querySelector("#tbShortQuestion").value;
      const shortAns = document.querySelector("#tbShortAnswer").value;
      const opts = [];
      for (let i = 0; i < options.length; i = i + 1) {
        const opt = document.querySelector(`#tbShortOption${i}`).value;
        opts.push(opt);
      }

      // Save to DB
      const rand1 = RandomString();
      const rand2 = RandomString();
      const lessonID = `Lesson${rand1}${rand2}`;

      const courseID = course.id;

      courses_Collection
        .doc(courseID)
        .collection("Lessons")
        .get()
        .then((snapshot) => {
          const lessonCount = snapshot.size;
          courses_Collection
            .doc(courseID)
            .collection("Lessons")
            .doc(lessonID)
            .set({
              Name: lessonName,
              Video: "path",
              Text: lessonText,
              Question: shortQui,
              Answer: shortAns,
              Options: [...opts],
              Order: lessonCount + 1,
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      // Dispatch
      dispatch(toggleNewLessonFormAction());

      courses_Collection
        .doc(courseID)
        .collection("Lessons")
        .get()
        .then((snapshot) => {
          const lessonCount = snapshot.size;
          const allLessons = [...lessons];
          allLessons.push({
            id: lessonID,
            Name: lessonName,
            Video: "path",
            Text: lessonText,
            Question: shortQui,
            Answer: shortAns,
            Options: [...opts],
            Order: lessonCount,
          });
          dispatch(storeSingleCourseLessonsAction(allLessons));
        })
        .catch((err) => console.log(err));
    } else if (toggleCourseTypeState === "exercises") {
      getCompCount();
      if (exerciseTypeState === "textual") {
        const text = document.querySelector("#taTextualExer").value;
        // Place lessons name
        const exerciseName = document.querySelector("#tbNewExerName").value;

        const rand1 = RandomString();
        const rand2 = RandomString();
        const exerID = `Exer${rand1}${rand2}`;

        courses_Collection
          .doc(course.id)
          .collection("Exercises")
          .get()
          .then((snapshot) => {
            const exerCount = snapshot.size;
            courses_Collection
              .doc(course.id)
              .collection("Exercises")
              .doc(exerID)
              .set({
                Type: "textual",
                Text: text,
                Name: exerciseName,
                Order: exerCount,
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));

        // Dispatch

        courses_Collection
          .doc(course.id)
          .collection("Exercises")
          .get()
          .then((snapshot) => {
            const exerCount = snapshot.size;
            const allExers = [...exercises];
            allExers.push({
              id: exerID,
              Type: "textual",
              Text: text,
              Name: exerciseName,
              Order: exerCount + 1,
            });
            dispatch(toggleNewLessonFormAction());
            dispatch(storeSingleCourseExersAction(allExers));
          })
          .catch((err) => console.log(err));
      }
    } else if (toggleCourseTypeState === "quizzes") {
      let newComponents = [];
      getCompCount();

      const quizName = document.querySelector("#tbQuizName").value;
      quizComponents.forEach((q, i) => {
        if (q.Type === "multiple") {
          const qui = document.querySelector(`#tbQui${i}`).value;
          const opts = [];
          q.Options.forEach((opt, a) => {
            const newOpt = document.querySelector(`#tbOpt${i}-${a}`).value;
            opts.push(newOpt);
          });
          const ans = document.querySelector(`#tbAns${i}`).value;

          q = {
            ...q,
            Question: qui,
            Options: [...opts],
            Answer: ans,
          };

          newComponents.push(q);
        } else if (q.Type === "short") {
          const shortText = document.querySelector(`#taShortPrompt${i}`).value;
          const shortAns = document.querySelector(`#tbShortAns${i}`).value;

          q = {
            ...q,
            Text: shortText,
            Answer: shortAns,
          };

          newComponents.push(q);
        } else if (q.Type === "long") {
          const longText = document.querySelector(`#taLongPrompt${i}`).value;
          const longAns = document.querySelector(`#taLongAns${i}`).value;

          q = {
            ...q,
            Text: longText,
            Answer: longAns,
          };

          newComponents.push(q);
        } else if (q.Type === "boolean") {
          const statement = document.querySelector(`#tbBoolStatement${i}`)
            .value;
          let answer = "";
          const raTrue = document.querySelector("#raTrue").checked;
          const raFalse = document.querySelector("#raFalse").checked;

          if (raTrue) {
            answer = "true";
          } else if (raFalse) {
            answer = "false";
          }

          q = {
            ...q,
            Statement: statement,
            Answer: answer,
          };

          newComponents.push(q);
        }
      });

      // Save to DB
      const rand1 = RandomString();
      const rand2 = RandomString();
      const quizID = `Quiz${rand1}${rand2}`;

      courses_Collection
        .doc(course.id)
        .collection("Quizzes")
        .get()
        .then((snapshot) => {
          const quizCount = snapshot.size;
          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .set({
              Name: quizName,
              Order: quizCount + 1,
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      quizComponents.forEach((q, i) => {
        const rand3 = RandomString();
        const rand4 = RandomString();
        const compID = `Comp${rand3}${rand4}`;

        if (q.Type === "multiple") {
          const qui = document.querySelector(`#tbQui${i}`).value;
          const opts = [];
          q.Options.forEach((opt, a) => {
            const newOpt = document.querySelector(`#tbOpt${i}-${a}`).value;
            opts.push(newOpt);
          });
          const ans = document.querySelector(`#tbAns${i}`).value;

          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .collection("Components")
            .doc(compID)
            .set({
              Type: q.Type,
              Question: qui,
              Options: [...opts],
              Answer: ans,
            })
            .catch((err) => console.log(err));
        } else if (q.Type === "short") {
          const shortText = document.querySelector(`#taShortPrompt${i}`).value;
          const shortAns = document.querySelector(`#tbShortAns${i}`).value;

          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .collection("Components")
            .doc(compID)
            .set({
              Type: q.Type,
              Text: shortText,
              Answer: shortAns,
            })
            .catch((err) => console.log(err));
        } else if (q.Type === "long") {
          const longText = document.querySelector(`#taLongPrompt${i}`).value;
          const longAns = document.querySelector(`#taLongAns${i}`).value;

          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .collection("Components")
            .doc(compID)
            .set({
              Type: q.Type,
              Text: longText,
              Answer: longAns,
            })
            .catch((err) => console.log(err));
        } else if (q.Type === "boolean") {
          const statement = document.querySelector(`#tbBoolStatement${i}`)
            .value;
          let answer = "";
          const raTrue = document.querySelector("#raTrue").checked;
          const raFalse = document.querySelector("#raFalse").checked;

          if (raTrue) {
            answer = "true";
          } else if (raFalse) {
            answer = "false";
          }
          courses_Collection
            .doc(course.id)
            .collection("Quizzes")
            .doc(quizID)
            .collection("Components")
            .doc(compID)
            .set({
              Type: q.Type,
              Statement: statement,
              Answer: answer,
            })
            .catch((err) => console.log(err));
        }
      });

      courses_Collection
        .doc(course.id)
        .collection("Quizzes")
        .get()
        .then((snapshot) => {
          const quizCount = snapshot.size;
          const allQuizzes = [...quizzes];
          allQuizzes.push({
            id: quizID,
            Name: quizName,
            Order: quizCount + 1,
          });
        })
        .catch((err) => console.log(err));

      dispatch(storeQuizComponentsAction([]));
      dispatch(toggleNewLessonFormAction());
      dispatch(storeSingleCourseQuizzesAction());
    }
  };
  const saveEditComp = () => {
    if (toggleCourseTypeState === "lessons") {
      const lessonName = document.querySelector("#tbLessonName").value;
      const lessonText = document.querySelector("#taTextualLesson").value;

      const lessonQui = document.querySelector("#tbShortQuestion").value;
      const lessonOpts = [];
      for (let i = 0; i < options.length; i = i + 1) {
        const opt = document.querySelector(`#tbShortOption${i}`).value;
        lessonOpts.push(opt);
      }

      const lessonAns = document.querySelector("#tbShortAnswer").value;

      // Save to DB
      courses_Collection
        .doc(course.id)
        .collection("Lessons")
        .doc(editLesson.id)
        .update({
          Name: lessonName,
          Text: lessonText,
          Question: lessonQui,
          Options: lessonOpts,
          Answer: lessonAns,
          Video: "path",
        })
        .catch((err) => console.log(err));

      // Dispatch
      let allLessons = [...lessons];
      const newLesson = {
        ...editLesson,
        id: editLesson.id,
        Name: lessonName,
        Text: lessonText,
        Question: lessonQui,
        Options: lessonOpts,
        Answer: lessonAns,
        Video: "path",
      };

      let filtered = allLessons.filter((l) => l.id !== editLesson.id);
      filtered.push(newLesson);

      filtered.sort((a, b) => (a.Order > b.Order ? 1 : -1));

      dispatch(storeSingleCourseLessonsAction(filtered));

      dispatch(toggleEditLessonFormAction());
    } else if (toggleCourseTypeState === "exercises") {
      if (exerciseTypeState === "textual") {
        const text = document.querySelector("#taTextualExer").value;
        // Place lessons name
        const exerciseName = document.querySelector("#tbNewExerName").value;

        const exerID = editExer.id;

        const exerCount = editExer.Order;

        courses_Collection
          .doc(course.id)
          .collection("Exercises")
          .doc(exerID)
          .update({
            Type: "textual",
            Text: text,
            Name: exerciseName,
          })
          .catch((err) => console.log(err));

        // Dispatch

        const allExers = [...exercises];
        const newExer = {
          ...editExer,
          id: exerID,
          Type: "textual",
          Text: text,
          Name: exerciseName,
          Order: exerCount,
        };

        let filtered = allExers.filter((l) => l.id !== editExer.id);
        filtered.push(newExer);

        filtered.sort((a, b) => (a.Order > b.Order ? 1 : -1));

        dispatch(storeSingleCourseExersAction(filtered));

        dispatch(toggleEditLessonFormAction());
      }
    }

    // Quiz Stuffs
  };
  const dragComponents = () => {
    if (toggleCourseTypeState === "lessons") {
      new Sortable(document.querySelector("#lessons"));
    } else if (toggleCourseTypeState === "exercises") {
      new Sortable(document.querySelector("#exercises"));
    } else if (toggleCourseTypeState === "quizzes") {
      new Sortable(document.querySelector("#quizzes"));
    }
  };
  const dragEnd = () => {
    if (toggleCourseTypeState === "lessons") {
      let filteredLessons = [];
      const allLessons = document.querySelectorAll(".draggable");

      let count = 1;
      allLessons.forEach((less) => {
        const lessID = less.id;
        const lessonState = [...lessons];

        lessonState.forEach((lesson) => {
          if (lesson.id === lessID) {
            lesson = {
              ...lesson,
              Order: count,
            };
            filteredLessons.push(lesson);

            // Save to DB
            courses_Collection
              .doc(course.id)
              .collection("Lessons")
              .doc(lessID)
              .update({ Order: count })
              .catch((err) => console.log(err));
          }
        });

        count = count + 1;
      });
    } else if (toggleCourseTypeState === "exercises") {
      let filteredExers = [];
      const allExers = document.querySelectorAll(".draggable");

      let count = 1;
      allExers.forEach((exer) => {
        const exerID = exer.id;
        const exerState = [...exercises];

        exerState.forEach((ex) => {
          if (ex.id === exerID) {
            ex = {
              ...ex,
              Order: count,
            };
            filteredExers.push(ex);

            // Save to DB
            courses_Collection
              .doc(course.id)
              .collection("Exercises")
              .doc(exerID)
              .update({ Order: count })
              .catch((err) => console.log(err));
          }
        });

        count = count + 1;
      });
    }
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    dragComponents();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        {/* Header */}
        <div>
          <h1>Course Edit Wizard</h1>
          <p>Choose the course component type to view and edit.</p>
          <br />
          <h2>Course Details</h2>
          <h3>Course Name</h3>
          <input
            id="tbCourseName"
            type="text"
            defaultValue={course.Name}
          ></input>
          <br />
          <h3>Course Description</h3>
          <textarea id="taCourseDesc" defaultValue={course.Desc}></textarea>

          <hr />
        </div>

        {/* Wizard */}
        <div>
          <button
            onClick={() => {
              dispatch(toggleCourseTypeEditAction("lessons"));
            }}
          >
            Lessons
          </button>
          <button
            onClick={() => {
              dispatch(toggleCourseTypeEditAction("exercises"));
            }}
          >
            Exercises
          </button>
          <button
            onClick={() => {
              dispatch(toggleCourseTypeEditAction("quizzes"));
            }}
          >
            Quizzes
          </button>
          <button>Exam</button>
          <hr />
        </div>

        <div>{handleCourseType()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
