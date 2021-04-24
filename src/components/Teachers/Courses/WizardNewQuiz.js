import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function WizardNewQuiz() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

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
          <button className="btnComp">Multiple Choice</button>
          <button className="btnComp">Short Answer</button>
          <button className="btnComp">Long Answer</button>
          <button className="btnComp">True or False</button>
          <button className="btnComp">Audio</button>
          <button className="btnComp">Video</button>
          <button className="btnComp">Image</button>
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
