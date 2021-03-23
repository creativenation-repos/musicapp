import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  storeAccountTypeAction,
  storeStudentAuthIDAction,
  isLoggedInAction,
  storeStudentUserDataAction,
} from "../../redux/actions";

import TopBar from "./TopBar";
import Footer from "./Footer";
import { users_Collection } from "../../utils/firebase";
import { firebaseLooper } from "../../utils/tools";

export default function StudentDash() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States

  const onLogOut = () => {
    dispatch(storeAccountTypeAction(""));
    dispatch(storeStudentAuthIDAction(""));
    dispatch(isLoggedInAction());
    history.push("/login");
  };
  const getStudentUserData = () => {
    users_Collection
      .get()
      .then((snapshot) => {
        const userData = firebaseLooper(snapshot);
        userData.forEach((user) => {
          if (user.AuthID === studentAuthID) {
            dispatch(storeStudentUserDataAction(user));
          }
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/login");
      return;
    }

    getStudentUserData();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div style={{ float: "right" }}>
        <button onClick={onLogOut}>Log Out</button>
      </div>

      <h1>Dashboard</h1>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
