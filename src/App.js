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
import StudentOverview from "./components/Teachers/Students/StudentOverview";
import GroupsMain from "./components/Teachers/Groups/GroupsMain";
import GroupsPage from "./components/Teachers/Groups/GroupsPage";
import ConnectionsMain from "./components/Teachers/Connections/ConnectionsMain";
import CoursesMain from "./components/Teachers/Courses/CoursesMain";
import WizardNewCourse from "./components/Teachers/Courses/WizardNewCourse";
import WizardNewLesson from "./components/Teachers/Courses/WizardNewLesson";
import WizardNewQuiz from "./components/Teachers/Courses/WizardNewQuiz";
import CourseOverview from "./components/Teachers/Courses/CourseOverview";
import WizardEditLesson from "./components/Teachers/Courses/WizardEditLesson";
import AssignmentsMain from "./components/Teachers/Assignments/AssignmentsMain";
import AssignmentView from "./components/Teachers/Assignments/AssignmentView";
import AssignmentEdit from "./components/Teachers/Assignments/AssignmentEdit";
import AssignmentNew from "./components/Teachers/Assignments/AssignmentNew";
import MilestonesMain from "./components/Teachers/Milestones/MilestonesMain";
import MilestoneView from "./components/Teachers/Milestones/MilestoneView";
import MilestoneEdit from "./components/Teachers/Milestones/MilestoneEdit";
import MilestoneAssign from "./components/Teachers/Milestones/MilestoneAssign";
import ForumsMain from "./components/Teachers/Forums/ForumsMain";
import ArticlesMain from "./components/Teachers/Articles/ArticlesMain";
import MessagesMain from "./components/Teachers/Messages/MessagesMain";
import MessageThreadView from "./components/Teachers/Messages/MessageThreadView";
import FileManagerMain from "./components/Teachers/FileManager/FileManagerMain";
import EventsMain from "./components/Teachers/Events/EventsMain";
import EventView from "./components/Teachers/Events/EventView";
import EventEdit from "./components/Teachers/Events/EventEdit";
import EventNew from "./components/Teachers/Events/EventNew";
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
import StudentAssignmentsMain from "./components/Students/Assignments/StudentAssignmentsMain";
import StudentAssignmentView from "./components/Students/Assignments/StudentAssignmentView";
import StudentMessagesMain from "./components/Students/Messages/StudentMessagesMain";
import StudentMessageThreadView from "./components/Students/Messages/StudentMessageThreadView";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faChartPie,
  faIdBadge,
  faUserFriends,
  faUsers,
  faChalkboard,
  faBookOpen,
  faSpinner,
  faCommentAlt,
  faCalendarAlt,
  faCog,
  faFileVideo,
  faHeadset,
  faArrowRight,
  faArrowLeft,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
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
    const teacherMenu = document.querySelector("#keep-left");
    const mainName = document.querySelector(".main-name");

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
      teacherMenu.classList.add("keep-left-small");
      teacherMenu.classList.remove("keep-left");
      mainName.classList.add("hide");
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
      teacherMenu.classList.remove("keep-left-small");
      teacherMenu.classList.add("keep-left");
      mainName.classList.remove("hide");
    }
  };

  return (
    <Router>
      <div id="main-wrapper">
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
                    <FontAwesomeIcon
                      id="mainmenuburger-icon"
                      icon={faChevronCircleDown}
                    />
                  </button>
                </div>
                {/* Nav */}
                {menuState ? (
                  <div>
                    <ul class="main-list-item">
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
                <div className="flex menu-head">
                  <div>
                    <h1 className="main-name">Violin Assist</h1>
                  </div>
                  <div>
                    <button id="dash-burger-icon" onClick={handleDashMenuText}>
                      {dashMenuTextState ? (
                        <FontAwesomeIcon icon={faArrowLeft} />
                      ) : (
                        <FontAwesomeIcon icon={faArrowRight} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link className="list-item-link" to="/teacherdash">
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faTachometerAlt} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Dashboard</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-statistics"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faChartPie} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Statistics</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-profile"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faIdBadge} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Profile</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">MAIN</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-students"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faUserFriends} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Students</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        {/* <li>
                          <Link className="list-item-link" to="/teacher-groups">
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faUsers} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Groups</p>
                              </div>
                            </div>
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-connections"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faUsers} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Connections</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-courses"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faChalkboard} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Courses</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-assignments"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faBookOpen} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Assignments</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-milestones"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faSpinner} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Milestones</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">GENERAL</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-messages"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faCommentAlt} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Messages</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link className="list-item-link" to="/teacher-events">
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Events</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-settings"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faCog} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Settings</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">INFO</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-tutorials"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faFileVideo} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Tutorials</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/teacher-support"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faHeadset} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Support</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Student Main Menu */}
          {accountTypeState === "Student" ? (
            <div>
              <div id="studentMainMenu">
                <div className="flex menu-head">
                  <div>
                    <h1 className="main-name">Violin Assist</h1>
                  </div>
                  <div>
                    <button id="dash-burger-icon" onClick={handleDashMenuText}>
                      {dashMenuTextState ? (
                        <FontAwesomeIcon icon={faArrowLeft} />
                      ) : (
                        <FontAwesomeIcon icon={faArrowRight} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link className="list-item-link" to="/studentdash">
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faTachometerAlt} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Dashboard</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-statistics"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faChartPie} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Statistics</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-profile"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faIdBadge} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Profile</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">MAIN</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-connections"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faUsers} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Connections</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-courses"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faChalkboard} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Courses</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-assignments"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faBookOpen} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Assignments</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-milestones"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faSpinner} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Milestones</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">GENERAL</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-messages"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faCommentAlt} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Messages</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-settings"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faCog} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Settings</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h4 className="menu-heading">INFO</h4>
                      {dashMenuTextState ? null : (
                        <h4 className="dash">. . .</h4>
                      )}
                    </div>
                    <div>
                      <ul className="list-item">
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-tutorials"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faFileVideo} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Tutorials</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="list-item-link"
                            to="/student-support"
                          >
                            <div className="dash-links">
                              <div className="dash-icon">
                                <FontAwesomeIcon icon={faHeadset} />
                              </div>
                              <div className="dash-text">
                                <p className="menuText">Support</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
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
            {/* Students */}
            <Route path="/teacher-students">
              <StudentsMain />
            </Route>
            <Route path="/teacher-student-overview">
              <StudentOverview />
            </Route>
            {/* Groups */}
            <Route path="/teacher-groups">
              <GroupsMain />
            </Route>
            <Route path="/teacher-group-page">
              <GroupsPage />
            </Route>
            {/* Connections */}
            <Route path="/teacher-connections">
              <ConnectionsMain />
            </Route>
            {/* Courses */}
            <Route path="/teacher-courses">
              <CoursesMain />
            </Route>
            <Route path="/teacher-new-course">
              <WizardNewCourse />
            </Route>
            <Route path="/teacher-new-lesson">
              <WizardNewLesson />
            </Route>
            <Route path="/teacher-new-quiz">
              <WizardNewQuiz />
            </Route>
            <Route path="/teacher-course-overview">
              <CourseOverview />
            </Route>
            <Route path="/teacher-edit-lesson">
              <WizardEditLesson />
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
            <Route path="/teacher-assignment-new">
              <AssignmentNew />
            </Route>
            {/* Milestones */}
            <Route path="/teacher-milestones">
              <MilestonesMain />
            </Route>
            <Route path="/teacher-milestone-view">
              <MilestoneView />
            </Route>
            <Route path="/teacher-milestone-edit">
              <MilestoneEdit />
            </Route>
            <Route path="/teacher-milestone-assign">
              <MilestoneAssign />
            </Route>
            {/* Forums */}
            <Route path="/teacher-forums">
              <ForumsMain />
            </Route>
            <Route path="/teacher-articles">
              <ArticlesMain />
            </Route>
            {/* Messages */}
            <Route path="/teacher-messages">
              <MessagesMain />
            </Route>
            <Route path="/teacher-message-thread">
              <MessageThreadView />
            </Route>
            <Route path="/teacher-filemanager">
              <FileManagerMain />
            </Route>
            {/* Events */}
            <Route path="/teacher-events">
              <EventsMain />
            </Route>
            <Route path="/teacher-event-view">
              <EventView />
            </Route>
            <Route path="/teacher-event-edit">
              <EventEdit />
            </Route>
            <Route path="/teacher-event-new">
              <EventNew />
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
            {/* Courses */}
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
            {/* Assignments */}
            <Route path="/student-assignments">
              <StudentAssignmentsMain />
            </Route>
            <Route path="/student-assignment-view">
              <StudentAssignmentView />
            </Route>
            {/* Messages */}
            <Route path="/student-messages">
              <StudentMessagesMain />
            </Route>
            <Route path="/student-message-thread">
              <StudentMessageThreadView />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
