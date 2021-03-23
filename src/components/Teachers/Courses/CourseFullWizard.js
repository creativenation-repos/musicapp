import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

import {
  storeShortOptionsAction,
  toggleCourseFullWizardComponentAction,
  toggleExerciseTypeOptionAction,
  storeCourseIDFullWizardAction,
  storeLessonNameFullWizardAction,
  storeQuizComponentsAction,
} from "../../../redux/actions";
import { courses_Collection } from "../../../utils/firebase";

export default function CourseFullWizard() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const wizardState = useSelector(
    (state) => state.toggleCourseFullWizardComponentReducer
  );
  const courses = useSelector(
    (state) => state.storeTeacherCourseGeneralInfoReducer
  );
  const options = useSelector((state) => state.storeShortOptionsReducer);
  const exerciseTypeState = useSelector(
    (state) => state.toggleExerciseTypeOptionReducer
  );
  const courseIDState = useSelector(
    (state) => state.storeCourseIDFullWizardReducer
  );
  const lessonNameState = useSelector(
    (state) => state.storeLessonNameFullWizardReducer
  );
  const quizComponents = useSelector(
    (state) => state.storeQuizComponentsReducer
  );

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
  const chooseExercise = () => {
    const textualOpt = document.querySelector("#raTextual").checked;

    if (textualOpt) {
      dispatch(toggleExerciseTypeOptionAction("textual"));
    }
  };
  const handleFormWizard = () => {
    if (wizardState === "lesson") {
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
            <button onClick={saveAndExit}>Save &amp; Exit</button>
            <button onClick={saveAndContinue}>
              Save &amp; Create Exercise
            </button>
          </div>
        </div>
      );
    } else if (wizardState === "exercise") {
      return (
        <div>
          <h2>Create Exercise</h2>
          <p>
            Exercises can be used to further enhance the lesson that was
            provided. The exercise will be named after the lesson that was
            created beforehand.
          </p>
          <br />

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
            <button onClick={saveAndExit}>Save &amp; Exit</button>
            <button onClick={saveAndContinue}>Save &amp; Create Quiz</button>
          </div>
        </div>
      );
    } else if (wizardState === "quiz") {
      return (
        <div>
          <h2>Create Quiz</h2>
          <p>
            Quizzes are meant to be a way for students to test their knowledge
            on what they learned in the lesson and exercise.
          </p>
          <br />

          {/* Quiz Component Picker */}
          <div
            style={{
              position: "fixed",
              right: "0",
              backgroundColor: "gray",
              padding: "2%",
              margin: "2%",
              border: "2px solid black",
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
            <button onClick={saveAndExit}>Save &amp; Exit</button>
            <button onClick={saveAndContinue}>Save &amp; Create Lesson</button>
            <button onClick={saveAndExam}>Save &amp; Create Exam</button>
          </div>
        </div>
      );
    } else if (wizardState === "exam") {
      return (
        <div>
          <h2>Create Exam</h2>
          <p>
            Congratulations. You have reached the final part of the course
            wizard. At this point, the program is wrapping up all quizzes and
            combining them to one collection. In your course settings, you may
            choose to assign the method your students will be viewing the exam.
            Ex.
            <ul>
              <li>Randomized Questions</li>
              <li>
                Select specific number of questions from each quiz type/section
              </li>
              <li>Assign time limit</li>
              <li>Pick specific questions from each quiz</li>
            </ul>
          </p>
          <br />
          <div>
            <button onClick={saveAndExit}>Finish</button>
          </div>
        </div>
      );
    }
  };
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

  const saveLesson = () => {
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

    let courseID = "";

    if (courseIDState.length === 0) {
      const courseName = document.querySelector("#tbCourseName").value;
      const courseDesc = document.querySelector("#taCourseDesc").value;
      courseID = `Course${rand1}${rand2}`;
      // Create course document
      courses_Collection
        .doc(courseID)
        .set({
          Created: GetToday(),
          Name: courseName,
          Access: "Private",
          Creator: teacherAuthID,
          Desc: courseDesc,
          Type: "Teacher",
        })
        .catch((err) => console.log(err));

      //   Dispatch
      const allCourses = [...courses];
      allCourses.push({
        id: courseID,
        Created: GetToday(),
        Name: lessonName,
        Access: "private",
        Creator: teacherAuthID,
        Desc: courseDesc,
        Type: "Teacher",
      });
    } else {
      courseID = courseIDState;
    }

    if (courseIDState.length > 0) {
      courses_Collection
        .doc(courseIDState)
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
    } else {
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
          Order: 1,
        })
        .catch((err) => console.log(err));
    }

    // Save Course ID
    dispatch(storeCourseIDFullWizardAction(courseID));
    dispatch(storeLessonNameFullWizardAction(lessonName));
  };
  const saveExercise = () => {
    if (exerciseTypeState === "textual") {
      const text = document.querySelector("#taTextualExer").value;
      const exerciseName = `${lessonNameState} Exercise`;

      const rand1 = RandomString();
      const rand2 = RandomString();
      const exerID = `Exer${rand1}${rand2}`;

      if (courseIDState.length > 0) {
        courses_Collection
          .doc(courseIDState)
          .collection("Exercises")
          .get()
          .then((snapshot) => {
            const exerCount = snapshot.size;
            courses_Collection
              .doc(courseIDState)
              .collection("Exercises")
              .doc(exerID)
              .set({
                Type: "textual",
                Text: text,
                Name: exerciseName,
                Order: exerCount + 1,
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        courses_Collection
          .doc(courseIDState)
          .collection("Exercises")
          .doc(exerID)
          .set({
            Type: "textual",
            Text: text,
            Name: exerciseName,
            Order: 1,
          })
          .catch((err) => console.log(err));
      }
    }

    window.scrollTo(0, 0);
  };
  const saveQuiz = () => {
    let newComponents = [];
    const quizName = `${lessonNameState} Quiz`;
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
        const statement = document.querySelector(`#tbBoolStatement${i}`).value;
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

    dispatch(storeQuizComponentsAction(newComponents));

    // Save to DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const quizID = `Quiz${rand1}${rand2}`;

    if (courseIDState.length > 0) {
      courses_Collection
        .doc(courseIDState)
        .collection("Quizzes")
        .get()
        .then((snapshot) => {
          const quizCount = snapshot.size;
          courses_Collection
            .doc(courseIDState)
            .collection("Quizzes")
            .doc(quizID)
            .set({
              Name: quizName,
              Order: quizCount + 1,
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      courses_Collection
        .doc(courseIDState)
        .collection("Quizzes")
        .doc(quizID)
        .set({
          Name: quizName,
          Order: 1,
        })
        .catch((err) => console.log(err));
    }

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
          .doc(courseIDState)
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
          .doc(courseIDState)
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
          .doc(courseIDState)
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
        const statement = document.querySelector(`#tbBoolStatement${i}`).value;
        let answer = "";
        const raTrue = document.querySelector("#raTrue").checked;
        const raFalse = document.querySelector("#raFalse").checked;

        if (raTrue) {
          answer = "true";
        } else if (raFalse) {
          answer = "false";
        }
        courses_Collection
          .doc(courseIDState)
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

    dispatch(storeQuizComponentsAction([]));
    window.scrollTo(0, 0);
  };

  const saveAndExit = () => {
    if (wizardState === "lesson") {
      saveLesson();
    } else if (wizardState === "exercise") {
      saveExercise();
    } else if (wizardState === "quiz") {
      saveQuiz();
    } else if (wizardState === "exam") {
    }
    history.push("/teacher-courses");
  };
  const saveAndContinue = () => {
    if (wizardState === "lesson") {
      saveLesson();
      dispatch(toggleCourseFullWizardComponentAction("exercise"));
    } else if (wizardState === "exercise") {
      saveExercise();
      dispatch(toggleCourseFullWizardComponentAction("quiz"));
    } else if (wizardState === "quiz") {
      saveQuiz();
      dispatch(toggleCourseFullWizardComponentAction("lesson"));
    } else if (wizardState === "exam") {
    }
  };
  const saveAndExam = () => {
    saveQuiz();
    dispatch(toggleCourseFullWizardComponentAction("exam"));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <h1>Course Wizard</h1>
        <p>
          Create a course using this course wizard. At any point, you may save
          and exit.
        </p>
      </div>

      {courseIDState.length === 0 ? (
        <div>
          <div>
            <h3>Course Name</h3>
            <input id="tbCourseName" type="text" placeholder="Name" />
          </div>
          <div>
            <h3>Access</h3>
            <p>
              Course is automatically made private. If you would like to make
              public, go to your Settings under "Courses"
            </p>
          </div>
          <div>
            <h3>Description</h3>
            <p>
              Provide a description on what your course is about and what it
              covers.
            </p>
            <textarea
              id="taCourseDesc"
              placeholder="Type Description Here.."
            ></textarea>
          </div>
        </div>
      ) : null}

      <hr />

      {/* Form Wizard */}
      <div>{handleFormWizard()}</div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
