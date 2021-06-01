import "./TopBar.css";
import { firebaseLooper } from "../../utils/tools";
import {
  connectionReqQueue_Collection,
  studentReqQueue_Collection,
  students_Collection,
  teachers_Collection,
  users_Collection,
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
  faUsers,
  faStar,
  faExclamationCircle,
  faTimes,
  faPlusCircle,
  faChalkboardTeacher,
  faBookReader,
  faBookOpen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  storeAccountTypeAction,
  storeTeacherAuthIDAction,
  isLoggedInAction,
  storeStudentNotificationsAction,
  toggleStudentNotificationsWindowAction,
  storeStudentMeDataAction,
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
  const meData = useSelector((state) => state.storeStudentMeDataReducer);

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
  const getMeData = () => {
    users_Collection
      .where("AuthID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeStudentMeDataAction(me));
        });
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
                  : notif.Icon === "faBookOpen"
                  ? faBookOpen
                  : notif.Icon === "faSpinner"
                  ? faSpinner
                  : notif.Icon === "faUsers"
                  ? faUsers
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
            {notif.Action === "studrequest" ? (
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
            ) : notif.Action === "connrequest" ? (
              <div className="btnsNotifReq">
                <button
                  id={notif.id}
                  onClick={onAcceptConnClick}
                  className="btnReq reqAccept"
                >
                  Accept
                </button>
                <button
                  id={notif.id}
                  onClick={onDeclineConnClick}
                  className="btnReq reqDecline"
                >
                  Decline
                </button>
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
  const onAcceptConnClick = (event) => {
    // User Accepts Connection
    const notifID = event.target.getAttribute("id");

    // Find user and add connection data to both accounts
    connectionReqQueue_Collection
      .where("ConnID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const connData = firebaseLooper(snapshot);
        connData.forEach((c) => {
          // My request
          const senderID = c.SenderID;
          // Get their data
          users_Collection
            .where("AuthID", "==", senderID)
            .get()
            .then((snapshot) => {
              const senderData = firebaseLooper(snapshot);
              senderData.forEach((s) => {
                const rand1 = RandomString();
                const rand2 = RandomString();
                const connID = `Conn${rand1}${rand2}`;
                // Send to sender
                students_Collection
                  .doc(studentAuthID)
                  .collection("Connections")
                  .doc(connID)
                  .set({
                    FirstName: s.FirstName,
                    LastName: s.LastName,
                    Email: s.Email,
                    AuthID: s.AuthID,
                  })
                  .catch((err) => console.log(err));

                // Send my data
                users_Collection
                  .where("AuthID", "==", studentAuthID)
                  .get()
                  .then((snapshot) => {
                    const myData = firebaseLooper(snapshot);
                    myData.forEach((me) => {
                      const newNotifID = `Notif${rand1}${rand2}`;
                      if (s.AccountType === "Student") {
                        students_Collection
                          .doc(s.AuthID)
                          .collection("Connections")
                          .doc(connID)
                          .set({
                            FirstName: me.FirstName,
                            LastName: me.LastName,
                            AuthID: me.AuthID,
                            Email: me.Email,
                          })
                          .catch((err) => console.log(err));

                        // Send Notification

                        students_Collection
                          .doc(s.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has accepted your connection request.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));
                      } else if (s.AccountType === "Teacher") {
                        teachers_Collection
                          .doc(s.AuthID)
                          .collection("Connections")
                          .doc(connID)
                          .set({
                            FirstName: me.FirstName,
                            LastName: me.LastName,
                            AuthID: me.AuthID,
                            Email: me.Email,
                          })
                          .catch((err) => console.log(err));

                        // Send notification
                        teachers_Collection
                          .doc(s.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has accepted your connection request.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));
                      }
                    });
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          connectionReqQueue_Collection
            .doc(c.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })

      .catch((err) => console.log(err));

    students_Collection
      .doc(studentAuthID)
      .collection("Notifications")
      .doc(notifID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);

    dispatch(storeStudentNotificationsAction(filtered));
  };
  const onDeclineConnClick = (event) => {
    // User Declines Connection
    const notifID = event.target.getAttribute("id");

    connectionReqQueue_Collection
      .where("ConnID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const reqData = firebaseLooper(snapshot);
        reqData.forEach((req) => {
          // Send Notif
          users_Collection
            .where("AuthID", "==", req.SenderID)
            .get()
            .then((snapshot) => {
              const senderData = firebaseLooper(snapshot);
              senderData.forEach((s) => {
                const rand1 = RandomString();
                const rand2 = RandomString();
                const newNotifID = `Notif${rand1}${rand2}`;

                users_Collection
                  .where("AuthID", "==", studentAuthID)
                  .get()
                  .then((snapshot) => {
                    const myData = firebaseLooper(snapshot);
                    myData.forEach((me) => {
                      if (s.AccountType === "Student") {
                        students_Collection
                          .doc(s.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has declined your connection request.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));
                      } else if (s.AccountType === "Teacher") {
                        teachers_Collection
                          .doc(s.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has declined your connection request.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));
                      }
                    });
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          connectionReqQueue_Collection
            .doc(req.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    // Remove notification
    students_Collection
      .doc(studentAuthID)
      .collection("Notifications")
      .doc(notifID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);

    dispatch(storeStudentNotificationsAction(filtered));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllNotifications();
    getMeData();
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
          {meData.FirstName} {meData.LastName}
        </p>
        <p>{meData.AccountType}</p>
      </div>
      <div>
        <button onClick={onLogOut} class="btn-topbar red">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
}
