import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import { storeTeacherQuizComponentsAction } from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RandomString from "../../RandomString";
import firebase, { courses_Collection } from "../../../utils/firebase";

export default function WizardNewQuiz() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const course = useSelector((state) => state.storeTeacherSingleCourseReducer);

  const components = useSelector(
    (state) => state.storeTeacherQuizComponentsReducer
  );

  // HANDLE
  const handleComponents = () => {
    return components.map((comp, i) => {
      if (comp.Type === "multiple") {
        return (
          <div className="comps purple-border" key={i}>
            <div style={{ display: "flex" }}>
              <h2>Multiple Choice</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>

            <p className="compLabel">Question:</p>
            <input
              className="tbComp question"
              id={`tbQuestion${i}`}
              type="text"
              placeholder="Question"
            />

            <p className="compLabel">Options:</p>
            <input
              className="tbComp opt"
              id={`tbOption1-${i}`}
              type="text"
              placeholder="Option 1"
            />
            <input
              className="tbComp opt"
              id={`tbOption2-${i}`}
              type="text"
              placeholder="Option 2"
            />
            <input
              className="tbComp opt"
              id={`tbOption3-${i}`}
              type="text"
              placeholder="Option 3"
            />
            <input
              className="tbComp opt"
              id={`tbOption4-${i}`}
              type="text"
              placeholder="Option 4"
            />

            <p className="compLabel">Answer:</p>
            <input
              className="tbComp answer"
              id={`tbAnswer${i}`}
              type="text"
              placeholder="Answer"
            />
          </div>
        );
      } else if (comp.Type === "short") {
        return (
          <div className="comps red-border" key={i}>
            <div style={{ display: "flex" }}>
              <h2>Short Answer</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>
            <p className="compLabel">Prompt:</p>
            <input
              className="tbComp prompt"
              id={`tbShortPrompt${i}`}
              type="text"
              placeholder="Prompt"
            />

            <p className="compLabel">Answer:</p>
            <input
              className="tbComp short"
              id={`tbShortAns${i}`}
              type="text"
              placeholder="Answer"
            />
          </div>
        );
      } else if (comp.Type === "long") {
        return (
          <div className="comps yellow-border" key={i}>
            <div style={{ display: "flex" }}>
              <h2>Long Answer</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>
            <p className="compLabel">Prompt:</p>
            <input
              className="tbComp prompt"
              id={`tbLongPrompt${i}`}
              type="text"
              placeholder="Prompt"
            />

            <h3 className="compLabel">Answer:</h3>
            <textarea
              className="ta long"
              id={`taLongAns${i}`}
              placeholder="Answer"
            ></textarea>
          </div>
        );
      } else if (comp.Type === "trueFalse") {
        return (
          <div className="comps aqua-border">
            <div style={{ display: "flex" }}>
              <h2>True or False</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>

            <p className="compLabel">Prompt:</p>
            <input
              className="tbComp prompt"
              id={`tbTrueFalsePrompt${i}`}
              type="text"
              placeholder="Prompt"
            />

            <div className="ras">
              <div className="raGroup">
                <input
                  className="ra"
                  type="radio"
                  id={`raTrue${i}`}
                  name={`raTrueFalse${i}`}
                  value="True"
                />
                <label for="male">True</label>
              </div>
              <div className="raGroup">
                <input
                  className="ra"
                  type="radio"
                  id={`raFalse${i}`}
                  name={`raTrueFalse${i}`}
                  value="False"
                />
                <label for="male">False</label>
              </div>
            </div>
            <br />
          </div>
        );
      } else if (comp.Type === "audio") {
        return (
          <div className="comps orange-border">
            <div style={{ display: "flex" }}>
              <h2>Audio</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>

            <div className="wizardPair">
              <h3 className="h3">Question Audio:</h3>
              <div>
                <input id={`select${i}`} type="file" />
                <p className="smallDesc">
                  Enter an optional custom file name. Leaving the field blank
                  will use the current file name.
                </p>
                <input
                  id={`fileName${i}`}
                  type="text"
                  placeholder="Type file name.."
                />
              </div>
            </div>
            <br />
            <p className="compLabel">Question:</p>
            <input
              className="tbComp question"
              id={`tbQuestion${i}`}
              type="text"
              placeholder="Question"
            />

            <p className="compLabel">Options:</p>
            <input
              className="tbComp opt"
              id={`tbOption1-${i}`}
              type="text"
              placeholder="Option 1"
            />
            <input
              className="tbComp opt"
              id={`tbOption2-${i}`}
              type="text"
              placeholder="Option 2"
            />
            <input
              className="tbComp opt"
              id={`tbOption3-${i}`}
              type="text"
              placeholder="Option 3"
            />
            <input
              className="tbComp opt"
              id={`tbOption4-${i}`}
              type="text"
              placeholder="Option 4"
            />

            <p className="compLabel">Answer:</p>
            <input
              className="tbComp answer"
              id={`tbAnswer${i}`}
              type="text"
              placeholder="Answer"
            />
          </div>
        );
      } else if (comp.Type === "video") {
        return (
          <div className="comps pink-border">
            <div style={{ display: "flex" }}>
              <h2>Video</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>

            <div className="wizardPair">
              <h3 className="h3">Question Video:</h3>
              <div>
                <input id={`select${i}`} type="file" />
                <p className="smallDesc">
                  Enter an optional custom file name. Leaving the field blank
                  will use the current file name.
                </p>
                <input
                  id={`fileName${i}`}
                  type="text"
                  placeholder="Type file name.."
                />
              </div>
            </div>
            <br />
            <p className="compLabel">Question:</p>
            <input
              className="tbComp question"
              id={`tbQuestion${i}`}
              type="text"
              placeholder="Question"
            />

            <p className="compLabel">Options:</p>
            <input
              className="tbComp opt"
              id={`tbOption1-${i}`}
              type="text"
              placeholder="Option 1"
            />
            <input
              className="tbComp opt"
              id={`tbOption2-${i}`}
              type="text"
              placeholder="Option 2"
            />
            <input
              className="tbComp opt"
              id={`tbOption3-${i}`}
              type="text"
              placeholder="Option 3"
            />
            <input
              className="tbComp opt"
              id={`tbOption4-${i}`}
              type="text"
              placeholder="Option 4"
            />

            <p className="compLabel">Answer:</p>
            <input
              className="tbComp answer"
              id={`tbAnswer${i}`}
              type="text"
              placeholder="Answer"
            />
          </div>
        );
      } else if (comp.Type === "image") {
        return (
          <div className="comps green-border">
            <div style={{ display: "flex" }}>
              <h2>Image</h2>
              <button onClick={onCompDel} id={comp.CompID} className="compDel">
                <FontAwesomeIcon className="compDelIcon" icon={faTimes} />
              </button>
            </div>

            <div className="wizardPair">
              <h3 className="h3">Question Image:</h3>
              <div>
                <input id={`select${i}`} type="file" />
                <p className="smallDesc">
                  Enter an optional custom file name. Leaving the field blank
                  will use the current file name.
                </p>
                <input
                  id={`fileName${i}`}
                  type="text"
                  placeholder="Type file name.."
                />
              </div>
            </div>
            <br />
            <p className="compLabel">Question:</p>
            <input
              className="tbComp question"
              id={`tbQuestion${i}`}
              type="text"
              placeholder="Question"
            />

            <p className="compLabel">Options:</p>
            <input
              className="tbComp opt"
              id={`tbOption1-${i}`}
              type="text"
              placeholder="Option 1"
            />
            <input
              className="tbComp opt"
              id={`tbOption2-${i}`}
              type="text"
              placeholder="Option 2"
            />
            <input
              className="tbComp opt"
              id={`tbOption3-${i}`}
              type="text"
              placeholder="Option 3"
            />
            <input
              className="tbComp opt"
              id={`tbOption4-${i}`}
              type="text"
              placeholder="Option 4"
            />

            <p className="compLabel">Answer:</p>
            <input
              className="tbComp answer"
              id={`tbAnswer${i}`}
              type="text"
              placeholder="Answer"
            />
          </div>
        );
      }
    });
  };

  // CLICK
  const onCompDel = (event) => {
    const compID = event.target.getAttribute("id");

    const allComps = [...components];
    const filtered = allComps.filter((c) => c.CompID !== compID);

    dispatch(storeTeacherQuizComponentsAction(filtered));
  };
  const onChooseComp = (event) => {
    const choice = event.target.getAttribute("id");
    const rand1 = RandomString();
    const rand2 = RandomString();
    const compID = `Comp${rand1}${rand2}`;

    if (choice === "btnMultiple") {
      const allComps = [...components];
      allComps.push({
        Type: "multiple",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnShort") {
      const allComps = [...components];
      allComps.push({
        Type: "short",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnLong") {
      const allComps = [...components];
      allComps.push({
        Type: "long",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnTrueFalse") {
      const allComps = [...components];
      allComps.push({
        Type: "trueFalse",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnAudio") {
      const allComps = [...components];
      allComps.push({
        Type: "audio",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnVideo") {
      const allComps = [...components];
      allComps.push({
        Type: "video",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    } else if (choice === "btnImage") {
      const allComps = [...components];
      allComps.push({
        Type: "image",
        CompID: compID,
      });

      dispatch(storeTeacherQuizComponentsAction(allComps));
    }
  };

  // POST
  const saveQuiz = () => {
    const quizName = document.querySelector("#tbQuizName").value;
    const quizDesc = document.querySelector("#taQuizDesc").value;

    const allComponents = [];

    // Fill up components array
    components.forEach((comp, i) => {
      if (comp.Type === "multiple") {
        const question = document.querySelector(`#tbQuestion${i}`).value;
        const options = [];
        for (let a = 1; a <= 4; a = a + 1) {
          const opt = document.querySelector(`#tbOption${a}-${i}`).value;
          options.push(opt);
        }
        const answer = document.querySelector(`#tbAnswer${i}`).value;

        const tempObj = {
          Type: "multiple",
          Question: question,
          Options: options,
          Answer: answer,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "short") {
        const prompt = document.querySelector(`#tbShortPrompt${i}`).value;
        const answer = document.querySelector(`#tbShortAns${i}`).value;

        const tempObj = {
          Type: "short",
          Prompt: prompt,
          Answer: answer,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "long") {
        const prompt = document.querySelector(`#tbLongPrompt${i}`).value;
        const answer = document.querySelector(`#taLongAns${i}`).value;

        const tempObj = {
          Type: "long",
          Prompt: prompt,
          Answer: answer,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "trueFalse") {
        const prompt = document.querySelector(`#tbTrueFalsePrompt${i}`).value;
        const raTrue = document.querySelector(`#raTrue${i}`).checked;
        const raFalse = document.querySelector(`#raFalse${i}`).checked;

        let res = false;
        if (raTrue) {
          res = true;
        }

        const tempObj = {
          Type: "trueFalse",
          Prompt: prompt,
          Answer: res,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "audio") {
        const audio = programUpload(i);

        const question = document.querySelector(`#tbQuestion${i}`).value;
        const options = [];
        for (let a = 1; a <= 4; a = a + 1) {
          const opt = document.querySelector(`#tbOption${a}-${i}`).value;
          options.push(opt);
        }
        const answer = document.querySelector(`#tbAnswer${i}`).value;

        const tempObj = {
          Type: "audio",
          Audio: audio,
          Question: question,
          Options: options,
          Answer: answer,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "video") {
        const video = programUpload(i);

        const question = document.querySelector(`#tbQuestion${i}`).value;
        const options = [];
        for (let a = 1; a <= 4; a = a + 1) {
          const opt = document.querySelector(`#tbOption${a}-${i}`).value;
          options.push(opt);
        }
        const answer = document.querySelector(`#tbAnswer${i}`).value;

        const tempObj = {
          Type: "video",
          Video: video,
          Question: question,
          Options: options,
          Answer: answer,
        };

        allComponents.push(tempObj);
      } else if (comp.Type === "image") {
        const imagePath = programUpload(i);

        const question = document.querySelector(`#tbQuestion${i}`).value;
        const options = [];
        for (let a = 1; a <= 4; a = a + 1) {
          const opt = document.querySelector(`#tbOption${a}-${i}`).value;
          options.push(opt);
        }
        const answer = document.querySelector(`#tbAnswer${i}`).value;

        const tempObj = {
          Type: "image",
          Image: imagePath,
          Question: question,
          Options: options,
          Answer: answer,
        };

        allComponents.push(tempObj);
      }
    });

    // Save in DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const quizID = `Quiz${rand1}${rand2}`;

    courses_Collection
      .doc(course.id)
      .collection("Quizzes")
      .doc(quizID)
      .set({
        Name: quizName,
        Desc: quizDesc,
      })
      .catch((err) => console.log(err));

    allComponents.forEach((comp) => {
      const rand3 = RandomString();
      const rand4 = RandomString();
      const compID = `Comp${rand3}${rand4}`;

      if (comp.Type === "multiple") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "multiple",
            Question: comp.Question,
            Options: comp.Options,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "short") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "short",
            Prompt: comp.Prompt,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "long") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "long",
            Prompt: comp.Prompt,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "trueFalse") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "trueFalse",
            Prompt: comp.Prompt,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "audio") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "audio",
            Audio: comp.Audio,
            Question: comp.Question,
            Options: comp.Options,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "video") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "video",
            Video: comp.Video,
            Question: comp.Question,
            Options: comp.Options,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      } else if (comp.Type === "image") {
        courses_Collection
          .doc(course.id)
          .collection("Quizzes")
          .doc(quizID)
          .collection("Components")
          .doc(compID)
          .set({
            Type: "image",
            Image: comp.Image,
            Question: comp.Question,
            Options: comp.Options,
            Answer: comp.Answer,
          })
          .catch((err) => console.log(err));
      }
    });
  };

  // PROGRAM
  const programUpload = (idx) => {
    const file = document.querySelector(`#select${idx}`).files[0];

    if (file) {
      let name = document.querySelector(`#fileName${idx}`).value;
      if (name === "") {
        name = file.name;
      }
      const metadata = {
        contentType: file.type,
      };

      // Storage Ref
      let ref;

      if (file.type === "video/mp4") {
        ref = firebase.storage().ref("Videos/");
        if (name !== file.name) {
          name = name + ".mp4";
        }
      } else if (file.type === "audio/mpeg") {
        ref = firebase.storage().ref("Audio/");
        if (name !== file.name) {
          name = name + ".mp3";
        }
      } else if (file.type === "image/jpeg") {
        ref = firebase.storage().ref("Images/");
        if (name !== file.name) {
          name = name + ".jpg";
        }
      } else if (file.type === "image/png") {
        ref = firebase.storage().ref("Images/");
        if (name !== file.name) {
          name = name + ".png";
        }
      } else if (file.type === "application/pdf") {
        ref = firebase.storage().ref("PDF/");
        if (name !== file.name) {
          name = name + ".pdf";
        }
      }

      const task = ref.child(name).put(file, metadata);
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          console.log(url);
        })
        .catch(console.error);

      return name;
    }
  };

  //   NAV
  const navCreateLesson = () => {
    saveQuiz();
    dispatch(storeTeacherQuizComponentsAction([]));
    history.push("/teacher-new-lesson");
  };
  const navSaveExit = () => {
    saveQuiz();
    dispatch(storeTeacherQuizComponentsAction([]));
    history.push("/teacher-courses");
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

      <div className="content">
        <h1>New Course: Quiz Details</h1>

        {/* Quiz Components Panel */}
        <div className="compPanel">
          <h3>Quiz Components</h3>
          <button onClick={onChooseComp} id="btnMultiple" className="btnComp">
            Multiple Choice
          </button>
          <button onClick={onChooseComp} id="btnShort" className="btnComp">
            Short Answer
          </button>
          <button onClick={onChooseComp} id="btnLong" className="btnComp">
            Long Answer
          </button>
          <button onClick={onChooseComp} id="btnTrueFalse" className="btnComp">
            True or False
          </button>
          <button onClick={onChooseComp} id="btnAudio" className="btnComp">
            Audio
          </button>
          <button onClick={onChooseComp} id="btnVideo" className="btnComp">
            Video
          </button>
          <button onClick={onChooseComp} id="btnImage" className="btnComp">
            Image
          </button>
        </div>

        {/* Quiz Content */}
        <div className="bodyWrapper">
          <div className="wizardPair">
            <h3 className="h3">Quiz Name:</h3>
            <input
              className="tb"
              id="tbQuizName"
              type="text"
              placeholder="Quiz Name"
            />
          </div>

          <div className="wizardPair">
            <h3 className="h3">Quiz Description:</h3>
            <textarea
              className="ta"
              id="taQuizDesc"
              placeholder="Quiz Description"
            ></textarea>
          </div>

          <div>
            {/* Add Components here */}
            {handleComponents()}
          </div>

          <div className="btnFlex">
            <button onClick={navSaveExit} className="btnFormSecondary">
              Save &amp; Exit
            </button>
            <button onClick={navCreateLesson} className="btnFormPrimary">
              Create Lesson {`>`}
            </button>
          </div>
        </div>

        {/* END */}
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
