import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function WizardEditQuiz() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const course = useSelector((state) => state.storeTeacherSingleCourseReducer);
  const quizzes = useSelector(
    (state) => state.storeTeacherSingleCourseQuizzesReducer
  );
  const quiz = useSelector(
    (state) => state.storeTeacherSingleCourseQuizReducer
  );

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
        <h1>Edit Quiz</h1>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
