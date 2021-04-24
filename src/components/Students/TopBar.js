import "./TopBar.css";
import { firebaseLooper } from "../../utils/tools";
import {
  studentReqQueue_Collection,
  students_Collection,
  teachers_Collection,
} from "../../utils/firebase";
import React, { useEffect } from "react";
import RandomString from "../RandomString";
import GetToday from "../GetToday";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faBell,
  faSignOutAlt,
  faUser,
  faStar,
  faExclamationCircle,
  faTimes,
  faPlusCircle,
  faChalkboardTeacher,
  faBookReader,
} from "@fortawesome/free-solid-svg-icons";
import {
  storeAccountTypeAction,
  storeTeacherAuthIDAction,
  isLoggedInAction,
  storeStudentNotificationsAction,
  toggleStudentNotificationsWindowAction,
} from "../../redux/actions";

export default function TopBar() {
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const toggleNotifWin = useSelector(
    (state) => state.toggleStudentNotificationsWindowReducer
  );
  const notifications = useSelector(
    (state) => state.storeStudentNotificationsReducer
  );

  // GET
  const getAllNotifications = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Notifications")
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const notifData = firebaseLooper(snapshot);
        dispatch(storeStudentNotificationsAction(notifData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleNotificationsList = () => {
    return notifications.map((notif, i) => {
      return (
        <div className="notifPanel" key={i}>
          <div className="topPanel">
            <FontAwesomeIcon
              className="iconNotif"
              icon={
                notif.Icon === "faBell"
                  ? faBell
                  : notif.Icon === "faUser"
                  ? faUser
                  : notif.Icon === "faStar"
                  ? faStar
                  : notif.Icon === "faExclamationCircle"
                  ? faExclamationCircle
                  : null
              }
            />
            <p className="notifText">{notif.Text}</p>
            <p className="notifDate">
              {notif.Date ? notif.Date.toDate().toString().substr(4, 11) : null}
            </p>
            <button className="notifDel">
              <FontAwesomeIcon className="notifDelIcon" icon={faTimes} />
            </button>
          </div>
          <div className="bottomPanel">
            {notif.Action === "request" ? (
              <div className="btnsNotifReq">
                <button
                  id={notif.id}
                  onClick={onAcceptReqClick}
                  className="btnReq reqAccept"
                >
                  Accept
                </button>
                <button
                  id={notif.id}
                  onClick={onDeclineReqClick}
                  className="btnReq reqDecline"
                >
                  Decline
                </button>
              </div>
            ) : notif.Action === "navigate" ? (
              <div className="btnNotifNav">
                <button className="btnReq notifNav">Go to Page</button>
              </div>
            ) : null}
          </div>
        </div>
      );
    });
  };

  // CLICK
  const onAcceptReqClick = (event) => {
    // Remove Notification
    const notifID = event.target.getAttribute("id");
    students_Collection
      .doc(studentAuthID)
      .collection("Notifications")
      .doc(notifID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch notif removal
    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);

    dispatch(storeStudentNotificationsAction(filtered));

    // Remove Request
    studentReqQueue_Collection
      .where("StudentID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const studReq = firebaseLooper(snapshot);
        studReq.forEach((req) => {
          // Send Student Data
          teachers_Collection
            .doc(req.TeacherID)
            .collection("Students")
            .doc(studentAuthID)
            .set({
              FirstName: user.FirstName,
              LastName: user.LastName,
              Email: user.Email,
            })
            .catch((err) => console.log(err));

          // Add Teacher to list
          const rand1 = RandomString();
          const rand2 = RandomString();
          const teachID = `Teach${rand1}${rand2}`;
          const nID = `Notif${rand1}${rand2}`;

          students_Collection
            .doc(studentAuthID)
            .collection("Teachers")
            .doc(teachID)
            .set({
              FirstName: req.TFirstName,
              LastName: req.TLastName,
              TeacherID: req.TeacherID,
            })
            .catch((err) => console.log(err));

          // Send teacher notification

          teachers_Collection
            .doc(req.TeacherID)
            .collection("Notifications")
            .doc(nID)
            .set({
              Action: "",
              Date: GetToday(),
              Text: `${user.FirstName} ${user.LastName} has accepted your request.`,
              Icon: "faUser",
            })
            .catch((err) => console.log(err));

          // Remove from queue
          studentReqQueue_Collection
            .doc(req.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const onDeclineReqClick = (event) => {
    // Remove Notification
    const notifID = event.target.getAttribute("id");

    students_Collection
      .doc(studentAuthID)
      .collection("Notifications")
      .doc(notifID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch notif
    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);

    dispatch(storeStudentNotificationsAction(filtered));

    // Remove from Requests
    studentReqQueue_Collection
      .where("StudentID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const studReq = firebaseLooper(snapshot);
        studReq.forEach((req) => {
          // Send Notification
          const rand1 = RandomString();
          const rand2 = RandomString();
          const nID = `Notif${rand1}${rand2}`;
          teachers_Collection
            .doc(req.TeacherID)
            .collection("Notifications")
            .doc(nID)
            .set({
              Action: "",
              Date: GetToday(),
              Text: `${user.FirstName} ${user.LastName} has declined your request.`,
              Icon: "faUser",
            })
            .catch((err) => console.log(err));

          // Remove from queue
          studentReqQueue_Collection
            .doc(req.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllNotifications();
  }, []);
  const onLogOut = () => {
    dispatch(storeAccountTypeAction(""));
    dispatch(storeTeacherAuthIDAction(""));
    dispatch(isLoggedInAction());
    history.push("/login");
  };

  return (
    <div className="topbar-wrapper">
      <div>
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faCommentAlt} />
        </button>

        <button class="btn-topbar">
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faChalkboardTeacher} />
        </button>
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faBookReader} />
        </button>
      </div>
      <div id="search-input">
        <input id="tbSearch" type="text" placeholder="Search..." />
      </div>
      <div>
        <button
          onClick={() => dispatch(toggleStudentNotificationsWindowAction())}
          id="btnNotif"
          class="btn-topbar"
        >
          <FontAwesomeIcon icon={faBell} />
        </button>
        {toggleNotifWin ? (
          <div id="winNotifications">{handleNotificationsList()}</div>
        ) : null}
      </div>
      <div className="topbar-user">
        <p>
          {user.FirstName} {user.LastName}
        </p>
        <p>{user.AccountType}</p>
      </div>
      <div>
        <button onClick={onLogOut} class="btn-topbar red">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
}
