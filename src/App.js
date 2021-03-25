import Home from "./components/Home";
import Courses from "./components/Courses";
import Plans from "./components/Plans";
// Support
import Contact from "./components/Contact";
import Login from "./components/Login";

// Teachers
import TeacherDash from "./components/TeacherDash";
import StatisticsMain from "./components/Teachers/Statistics/StatisticsMain";
import ProfileMain from "./components/Teachers/Profile/ProfileMain";
import StudentsMain from "./components/Teachers/Students/StudentsMain";
import GroupsMain from "./components/Teachers/Groups/GroupsMain";
import GroupsPage from "./components/Teachers/Groups/GroupsPage";
import CoursesMain from "./components/Teachers/Courses/CoursesMain";
import CourseFullWizard from "./components/Teachers/Courses/CourseFullWizard";
import CourseEditWizard from "./components/Teachers/Courses/CourseEditWizard";
import AssignmentsMain from "./components/Teachers/Assignments/AssignmentsMain";
import AssignmentView from "./components/Teachers/Assignments/AssignmentView";
import AssignmentEdit from "./components/Teachers/Assignments/AssignmentEdit";
import MilestonesMain from "./components/Teachers/Milestones/MilestonesMain";
import ForumsMain from "./components/Teachers/Forums/ForumsMain";
import ArticlesMain from "./components/Teachers/Articles/ArticlesMain";
import MessagesMain from "./components/Teachers/Messages/MessagesMain";
import FileManagerMain from "./components/Teachers/FileManager/FileManagerMain";
import EventsMain from "./components/Teachers/Events/EventsMain";
import InvoicesMain from "./components/Teachers/Invoices/InvoicesMain";
import InvoiceView from "./components/Teachers/Invoices/InvoiceView";
import SettingsMain from "./components/Teachers/Settings/SettingsMain";
import TutorialsMain from "./components/Teachers/Tutorials/TutorialsMain";
import SupportMain from "./components/Teachers/Support/SupportMain";
// Students
import StudentDash from "./components/Students/StudentDash";
import StudentProfileMain from "./components/Students/Profile/StudentProfileMain";
import StudentCoursesMain from "./components/Students/Courses/StudentCoursesMain";
import StudentCoursePreview from "./components/Students/Courses/StudentCoursePreview";
import StudentCourseLesson from "./components/Students/Courses/StudentCourseLesson";
import StudentCourseExercise from "./components/Students/Courses/StudentCourseExercise";
import StudentCourseQuiz from "./components/Students/Courses/StudentCourseQuiz";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  menuAction,
  dashFullMenuAction,
  dashMenuTextAction,
} from "./redux/actions";

import "./App.css";

export default function App() {
  const menuState = useSelector((state) => state.menuReducer);
  const dashMenuState = useSelector((state) => state.dashFullMenuSwitchReducer);
  const dashMenuTextState = useSelector(
    (state) => state.dashMenuTextSwitchReducer
  );
  const accountTypeState = useSelector(
    (state) => state.storeAccountTypeReducer
  );

  const dispatch = useDispatch();

  const handleDashMenuText = () => {
    dispatch(dashMenuTextAction());

    const allTextObj = document.querySelectorAll(".menuText");
    const allDashObj = document.querySelectorAll(".dash");
    const allNavHeadings = document.querySelectorAll(".menu-heading");

    if (dashMenuTextState) {
      allTextObj.forEach((text) => {
        text.classList.add("hide");
      });
      allDashObj.forEach((dash) => {
        dash.classList.remove("hide");
      });
      allNavHeadings.forEach((head) => {
        head.classList.add("hide");
      });
    } else {
      allTextObj.forEach((text) => {
        text.classList.remove("hide");
      });
      allDashObj.forEach((dash) => {
        dash.classList.add("hide");
      });
      allNavHeadings.forEach((head) => {
        head.classList.remove("hide");
      });
    }
  };

  return (
    <Router>
      <div id="keep-left">
        {/* Main */}
        {accountTypeState.length < 1 ? (
          <div>
            {/* Main */}
            <div id="mainMenu">
              {/* Menu */}
              <div>
                <button
                  id="mainmenuburger"
                  onClick={() => dispatch(menuAction())}
                >
                  <FontAwesomeIcon id="mainmenuburger-icon" icon={faBars} />
                </button>
              </div>
              {/* Nav */}
              {menuState ? (
                <div>
                  <ul class="list-item">
                    <li>
                      <Link class="Link" to="/">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link class="Link" to="/courses">
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link class="Link" to="/plans">
                        Plans
                      </Link>
                    </li>
                    <li>
                      <Link class="Link" to="/support">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link class="Link" to="/contact">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link class="Link" to="/login">
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Teacher Main Menu */}
        {accountTypeState === "Teacher" ? (
          <div>
            <div id="teacherMainMenu">
              <div>
                <div>
                  <img src="" alt="" />
                  <h1>Musicademy</h1>
                </div>
                <div>
                  <button onClick={handleDashMenuText}>
                    {dashMenuTextState ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <ul className="list-item">
                  <li>
                    <Link to="/teacherdash">
                      <img src="" alt="" />
                      <p className="menuText">Dashboard</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-statistics">
                      <img src="" alt="" />
                      <p className="menuText">Statistics</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-profile">
                      <img src="" alt="" />
                      <p className="menuText">Profile</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">MAIN</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <ul className="list-item">
                  <li>
                    <Link to="/teacher-students">
                      <img src="" alt="" />
                      <p className="menuText">Students</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-groups">
                      <img src="" alt="" />
                      <p className="menuText">Groups</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-courses">
                      <img src="" alt="" />
                      <p className="menuText">Courses</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-assignments">
                      <img src="" alt="" />
                      <p className="menuText">Assignments</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-milestones">
                      <img src="" alt="" />
                      <p className="menuText">Milestones</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-forums">
                      <img src="" alt="" />
                      <p className="menuText">Forums</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/teacher-articles">
                      <img src="" alt="" />
                      <p className="menuText">Articles</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">GENERAL</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <div>
                  <ul className="list-item">
                    <li>
                      <Link to="/teacher-messages">
                        <img src="" alt="" />
                        <p className="menuText">Messages</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher-filemanager">
                        <img src="" alt="" />
                        <p className="menuText">File Manager</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher-events">
                        <img src="" alt="" />
                        <p className="menuText">Events</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher-invoices">
                        <img src="" alt="" />
                        <p className="menuText">Invoices</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher-settings">
                        <img src="" alt="" />
                        <p className="menuText">Settings</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">INFO</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <div>
                  <ul className="list-item">
                    <li>
                      <Link to="/teacher-tutorials">
                        <img src="" alt="" />
                        <p className="menuText">Tutorials</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher-support">
                        <img src="" alt="" />
                        <p className="menuText">Support</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Student Main Menu */}
        {accountTypeState === "Student" ? (
          <div>
            <div id="studentMainMenu">
              <div>
                <div>
                  <img src="" alt="" />
                  <h1>Musicademy</h1>
                </div>
                <div>
                  <button onClick={handleDashMenuText}>
                    {dashMenuTextState ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <ul className="list-item">
                  <li>
                    <Link to="/studentdash">
                      <img src="" alt="" />
                      <p className="menuText">Dashboard</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/student-statistics">
                      <img src="" alt="" />
                      <p className="menuText">Statistics</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/student-profile">
                      <img src="" alt="" />
                      <p className="menuText">Profile</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">MAIN</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <ul className="list-item">
                  <li>
                    <Link to="/student-connections">
                      <img src="" alt="" />
                      <p className="menuText">Connections</p>
                    </Link>
                    <Link to="/student-courses">
                      <img src="" alt="" />
                      <p className="menuText">Courses</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">GENERAL</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <div>
                  <ul className="list-item">
                    <li>
                      <Link to="/teacher-messages">
                        <img src="" alt="" />
                        <p className="menuText">Messages</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div>
                  <h4 className="menu-heading">INFO</h4>
                  {dashMenuTextState ? null : <h4 className="dash">-</h4>}
                </div>
                <div>
                  <ul className="list-item">
                    <li>
                      <Link to="/student-tutorials">
                        <img src="" alt="" />
                        <p className="menuText">Tutorials</p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-support">
                        <img src="" alt="" />
                        <p className="menuText">Support</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div id="keep-right">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/courses" exact>
            <Courses />
          </Route>
          <Route path="/plans">
            <Plans />
          </Route>
          {/* Support Component */}
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/login">
            <Login />
          </Route>

          {/* Teacher ************************************************** */}
          <Route path="/teacherdash">
            <TeacherDash />
          </Route>
          <Route path="/teacher-statistics">
            <StatisticsMain />
          </Route>
          <Route path="/teacher-profile">
            <ProfileMain />
          </Route>
          <Route path="/teacher-students">
            <StudentsMain />
          </Route>
          {/* Groups */}
          <Route path="/teacher-groups">
            <GroupsMain />
          </Route>
          <Route path="/teacher-group-page">
            <GroupsPage />
          </Route>
          {/* Courses */}
          <Route path="/teacher-courses">
            <CoursesMain />
          </Route>
          <Route path="/teacher-courses-wizard-full">
            <CourseFullWizard />
          </Route>
          <Route path="/teacher-courses-wizard-edit">
            <CourseEditWizard />
          </Route>
          {/* Assignments */}
          <Route path="/teacher-assignments">
            <AssignmentsMain />
          </Route>
          <Route path="/teacher-assignment-view">
            <AssignmentView />
          </Route>
          <Route path="/teacher-assignment-edit">
            <AssignmentEdit />
          </Route>
          {/* Milestones */}
          <Route path="/teacher-milestones">
            <MilestonesMain />
          </Route>
          <Route path="/teacher-forums">
            <ForumsMain />
          </Route>
          <Route path="/teacher-articles">
            <ArticlesMain />
          </Route>
          <Route path="/teacher-messages">
            <MessagesMain />
          </Route>
          <Route path="/teacher-filemanager">
            <FileManagerMain />
          </Route>
          <Route path="/teacher-events">
            <EventsMain />
          </Route>
          {/* Invoices */}
          <Route path="/teacher-invoices">
            <InvoicesMain />
          </Route>
          <Route path="/teacher-invoice-view">
            <InvoiceView />
          </Route>
          <Route path="/teacher-settings">
            <SettingsMain />
          </Route>
          <Route path="/teacher-tustorials">
            <TutorialsMain />
          </Route>
          <Route path="/teacher-support">
            <SupportMain />
          </Route>

          {/* Student ******************************************************** */}
          <Route path="/studentdash">
            <StudentDash />
          </Route>
          <Route path="/student-profile">
            <StudentProfileMain />
          </Route>
          <Route path="/student-courses">
            <StudentCoursesMain />
          </Route>
          <Route path="/student-course-preview">
            <StudentCoursePreview />
          </Route>
          <Route path="/student-course-lesson">
            <StudentCourseLesson />
          </Route>
          <Route path="/student-course-exercise">
            <StudentCourseExercise />
          </Route>
          <Route path="/student-course-quiz">
            <StudentCourseQuiz />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
