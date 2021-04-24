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
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  storeAccountTypeAction,
  storeTeacherAuthIDAction,
  isLoggedInAction,
  storeTeacherNotificationsAction,
  toggleTeacherNotificationsWindowAction,
  storeTeacherAddStudentSearchResultAction,
} from "../../../redux/actions";

import "./TopBar.css";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

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
                <button className="btnReq reqAccept">Accept</button>
                <button className="btnReq reqDecline">Decline</button>
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

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
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
        <p>Jesus Jimenez</p>
        <p>Teacher</p>
      </div>
      <div>
        <button onClick={onLogOut} class="btn-topbar red">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
}
