import React from "react";
import "./Login/Login.css";

import { useHistory } from "react-router-dom";
import {
  loginRegisterToggleAction,
  isLoggedInAction,
  storeTeacherAuthIDAction,
  storeStudentAuthIDAction,
  storeAccountTypeAction,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { users_Collection } from "../utils/firebase";
import { firebaseLooper } from "../utils/tools";

import "./Login.css";

export default function Login() {
  const loginSwitchState = useSelector(
    (state) => state.loginRegisterSwitchReducer
  );
  const isLoggedInState = useSelector((state) => state.isLoggedInReducer);
  const accountTypeState = useSelector(
    (state) => state.storeAccountTypeReducer
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const handleRouteClick = () => {
    const username = document.querySelector("#tbUsername").value;
    const password = document.querySelector("#tbPassword").value;

    // Check if they exist in the DB
    users_Collection
      .get()
      .then((snapshot) => {
        const userData = firebaseLooper(snapshot);
        userData.forEach((user) => {
          if (user.Username === username && user.Password === password) {
            // If they do exist and are correct, then do the stuffs

            document.querySelector("#mainMenu").classList.add("hide");

            // Choose between teacher or student depending on their credentials

            dispatch(isLoggedInAction());

            if (user.AccountType === "Teacher") {
              // Save authID
              dispatch(storeTeacherAuthIDAction(username));
              dispatch(storeAccountTypeAction("Teacher"));
              document
                .querySelector("#teacherMainMenu")
                .classList.remove("hide");
              history.push("/teacherdash");
            } else if (user.AccountType === "Student") {
              // Save authID
              dispatch(storeStudentAuthIDAction(username));
              dispatch(storeAccountTypeAction("Student"));
              document
                .querySelector("#studentMainMenu")
                .classList.remove("hide");
              history.push("/studentdash");
            }
          }
        });
      })
      .catch((err) => console.log(err));
  };

  const handleLoginSwitch = () => {
    if (loginSwitchState === "login") {
      return (
        <div>
          <div className="login-text">
            <h2>Welcome back!</h2>
            <p>Please log in to begin your musical adventures!</p>
          </div>
          <div className="login-form">
            <div>
              <label>Username or Email</label>
              <input
                className="login-tb"
                id="tbUsername"
                type="text"
                placeholder="jdoe123! or johndoe@gmail.com"
              />
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <label>Password</label>
                <button
                  id="btn-forgot"
                  onClick={() => dispatch(loginRegisterToggleAction("forgot"))}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                className="login-tb"
                id="tbPassword"
                type="password"
                placeholder="Password"
              />
            </div>
            <div>
              <button class="btn-login" onClick={handleRouteClick}>
                Login
              </button>
            </div>
            <div className="login-reg">
              <p>Are you new to Musicademy? </p>
              <button
                onClick={() => dispatch(loginRegisterToggleAction("register"))}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      );
    } else if (loginSwitchState === "register") {
      return (
        <div>
          <div>
            <h2>A new musical adventure begins here!</h2>
            <p>
              Make sure to enter correct information for proper registration.
            </p>
          </div>
          <div>
            <div>
              <div>
                <label>First Name</label>
                <input id="tbFname" type="text" placeholder="John" />
              </div>
              <div>
                <label>Last Name</label>
                <input id="tbLname" type="text" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label>Email</label>
              <input
                id="tbRegisEmail"
                type="text"
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div>
              <label>Username</label>
              <input id="tbRegisUser" type="text" placeholder="jdoe123!" />
            </div>
            <div>
              <label>Password</label>
              <input id="tbRegisPass" type="text" placeholder="Password" />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                id="tbRegisPassConf"
                type="password"
                placeholder="Password Confirmation"
              />
            </div>
            <div>
              <button>Register</button>
            </div>
            <div>
              <p>Already a member?</p>
              <button
                onClick={() => dispatch(loginRegisterToggleAction("login"))}
              >
                Login to account
              </button>
            </div>
          </div>
        </div>
      );
    } else if (loginSwitchState === "forgot") {
      return (
        <div>
          <div>
            <h2>Forgot Password?</h2>
            <p>Enter your email and we will email you instructions shortly.</p>
          </div>
          <div>
            <div>
              <label>Email</label>
              <input
                id="tbForgotEmail"
                type="text"
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div>
              <button>Send reset link</button>
            </div>
          </div>
          <div>
            <button
              onClick={() => dispatch(loginRegisterToggleAction("login"))}
            >
              {"<"} Back to Login
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="login-wrapper">
      {/* Form */}
      <div className="login-box">{handleLoginSwitch()}</div>
    </div>
  );
}
