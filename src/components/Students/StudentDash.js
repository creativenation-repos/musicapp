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
import "./StudentDash.css";
import { users_Collection } from "../../utils/firebase";
import { firebaseLooper } from "../../utils/tools";

export default function StudentDash() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

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

      <div className="content">
        <h1>Dashboard</h1>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
