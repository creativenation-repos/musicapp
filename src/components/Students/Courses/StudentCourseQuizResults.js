import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import RandomString from "../../RandomString";

export default function StudentCourseQuizResults() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const quizResults = useSelector(
    (state) => state.storeStudentQuizFinalResultsReducer
  );


  // HANDLE
  const handleResults = () => {
    return quizResults.Results.map((res, i) => {
      return (
        <div
          className={`resBlock ${
            res.Result === "Correct"
              ? "green-background"
              : res.Result === "Incorrect"
              ? "red-background"
              : "purple-background"
          }`}
          key={i}
        >
          <span className="quizNum">{i + 1}</span>
          <p className="quizGiven">Your Answer: {res.Given.toString()}</p>
          <p className="quizAnswer">Correct Answer: {res.Answer.toString()}</p>
          <p className="quizPoints">
            Points Earned: {res.Earned} / {res.Points}
          </p>
          <span className="quizResult">{res.Result}</span>
        </div>
      );
    });
  };

  // NAV
  const navCourseOverview = () => {
    history.push("/student-course-overview");
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

      <div className="content">
        <h1>Results</h1>

        <div className="resWrapper">
          <p className="resTopHead">
            {quizResults.CourseName} :{" "}
            <span style={{ color: "#3E00F9" }}>{quizResults.QuizName}</span>
          </p>
          <br />
          <br />
          {handleResults()}
          <br />
          <button onClick={navCourseOverview} className="btnResultFinish">
            Finish
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
