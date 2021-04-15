import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faClipboardCheck,
  faCalendarDay,
  faComments,
  faBell,
  faSignOutAlt,
  faBookOpen,
  faCalendarAlt,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import {
  storeAccountTypeAction,
  storeTeacherAuthIDAction,
  isLoggedInAction,
} from "../../../redux/actions";

import "./TopBar.css";

export default function TopBar() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
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
        <button class="btn-topbar">
          <FontAwesomeIcon icon={faBell} />
        </button>
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
