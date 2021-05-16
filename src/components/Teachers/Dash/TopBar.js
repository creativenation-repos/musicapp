import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faBell,
  faSignOutAlt,
  faBookOpen,
  faCalendarAlt,
  faUserFriends,
  faUser,
  faStar,
  faExclamationCircle,
  faTimes,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  storeAccountTypeAction,
  storeTeacherAuthIDAction,
  isLoggedInAction,
  storeTeacherNotificationsAction,
  toggleTeacherNotificationsWindowAction,
  storeTeacherMeDataAction,
} from "../../../redux/actions";

import "./TopBar.css";
import {
  connectionReqQueue_Collection,
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function TopBar() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const toggleNotifWin = useSelector(
    (state) => state.toggleTeacherNotificationsWindowReducer
  );
  const notifications = useSelector(
    (state) => state.storeTeacherNotificationsReducer
  );
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);

  // GET
  const getAllNotifications = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Notifications")
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const notifData = firebaseLooper(snapshot);
        dispatch(storeTeacherNotificationsAction(notifData));
      })
      .catch((err) => console.log(err));
  };
  const getMeData = () => {
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeTeacherMeDataAction(me));
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
            <button
              id={notif.id}
              onClick={removeNotification}
              className="notifDel"
            >
              <FontAwesomeIcon className="notifDelIcon" icon={faTimes} />
            </button>
          </div>
          <div className="bottomPanel">
            {notif.Action === "connrequest" ? (
              <div className="btnsNotifReq">
                <button
                  id={notif.id}
                  onClick={onAcceptConnRequest}
                  className="btnReq reqAccept"
                >
                  Accept
                </button>
                <button
                  id={notif.id}
                  onClick={onDeclineConnRequest}
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

  // REQUESTS
  const onAcceptConnRequest = (event) => {
    const notifID = event.target.getAttribute("id");

    // Get my data
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          connectionReqQueue_Collection
            .where("ConnID", "==", teacherAuthID)
            .get()
            .then((snapshot) => {
              const connData = firebaseLooper(snapshot);
              connData.forEach((s) => {
                users_Collection
                  .where("AuthID", "==", s.SenderID)
                  .get()
                  .then((snapshot) => {
                    const senderUserData = firebaseLooper(snapshot);
                    senderUserData.forEach((sender) => {
                      const rand1 = RandomString();
                      const rand2 = RandomString();
                      const newNotifID = `Notif${rand1}${rand2}`;
                      const connID = `Conn${rand1}${rand2}`;

                      if (sender.AccountType === "Student") {
                        students_Collection
                          .doc(sender.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has accepted your request to connect.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));

                        students_Collection
                          .doc(sender.AuthID)
                          .collection("Connections")
                          .doc(connID)
                          .set({
                            FirstName: me.FirstName,
                            LastName: me.LastName,
                            Email: me.Email,
                            AuthID: me.AuthID,
                          })
                          .catch((err) => console.log(err));
                      } else if (sender.AccountType === "Teacher") {
                        teachers_Collection
                          .doc(sender.AuthID)
                          .collection("Notifications")
                          .doc(newNotifID)
                          .set({
                            Action: "",
                            Icon: "faUser",
                            Text: `${me.FirstName} ${me.LastName} has accepted your request to connect.`,
                            Date: GetToday(),
                          })
                          .catch((err) => console.log(err));

                        teachers_Collection
                          .doc(sender.AuthID)
                          .collection("Connections")
                          .doc(connID)
                          .set({
                            FirstName: me.FirstName,
                            LastName: me.LastName,
                            Email: me.Email,
                            AuthID: me.AuthID,
                          })
                          .catch((err) => console.log(err));
                      }

                      teachers_Collection
                        .doc(teacherAuthID)
                        .collection("Connections")
                        .doc(connID)
                        .set({
                          FirstName: sender.FirstName,
                          LastName: sender.LastName,
                          Email: sender.Email,
                          AuthID: sender.AuthID,
                        })
                        .catch((err) => console.log(err));
                    });
                  })
                  .catch((err) => console.log(err));

                connectionReqQueue_Collection
                  .where("ConnID", "==", teacherAuthID)
                  .get()
                  .then((snapshot) => {
                    const myConnData = firebaseLooper(snapshot);
                    myConnData.forEach((myConn) => {
                      connectionReqQueue_Collection
                        .doc(myConn.id)
                        .delete()
                        .catch((err) => console.log(err));
                    });
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    // Remove Notification
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Notifications")
      .doc(notifID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);
    dispatch(storeTeacherNotificationsAction(filtered));
  };
  const onDeclineConnRequest = (event) => {
    const notifID = event.target.getAttribute("id");
  };

  // REMOVE
  const removeNotification = (event) => {
    const notifID = event.target.getAttribute("id");

    notifications.forEach((n) => {
      if (n.id === notifID) {
        if (n.Action === "") {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Notifications")
            .doc(n.id)
            .delete()
            .catch((err) => console.log(err));
        } else if (n.Action === "connrequest") {
          // What to do if you close conn req
        }
      }
    });

    const allNotifs = [...notifications];
    const filtered = allNotifs.filter((n) => n.id !== notifID);

    dispatch(storeTeacherNotificationsAction(filtered));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
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
          <FontAwesomeIcon icon={faBookOpen} />
        </button>
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faCalendarAlt} />
        </button>
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faUserFriends} />
        </button>
      </div>
      <div id="search-input">
        <input id="tbSearch" type="text" placeholder="Search..." />
      </div>
      <div>
        <button
          onClick={() => dispatch(toggleTeacherNotificationsWindowAction())}
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
