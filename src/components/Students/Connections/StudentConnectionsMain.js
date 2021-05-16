import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./Connections.css";
import {
  students_Collection,
  users_Collection,
  connectionReqQueue_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import {
  storeStudentAllConnectionsAction,
  storeStudentUserDataAction,
  storeStudentAllSearchUsersAction,
  storeStudentAllConnReqsAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function StudentCoursesMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const connections = useSelector(
    (state) => state.storeStudentAllConnectionsReducer
  );
  const allSearchUsers = useSelector(
    (state) => state.storeStudentAllSearchUsersReducer
  );
  const userState = useSelector((state) => state.storeStudentUserDataReducer);
  const allConnReqs = useSelector(
    (state) => state.storeStudentAllConnReqsReducer
  );

  // GET
  const getAllConnections = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Connections")
      .get()
      .then((snapshot) => {
        const connData = firebaseLooper(snapshot);
        dispatch(storeStudentAllConnectionsAction(connData));
      })
      .catch((err) => console.log(err));
  };
  const getAllConnRequests = () => {
    connectionReqQueue_Collection
      .get()
      .then((snapshot) => {
        const queueData = firebaseLooper(snapshot);
        dispatch(storeStudentAllConnReqsAction(queueData));
      })
      .catch((err) => console.log(err));
  };
  const getMyUserData = () => {
    users_Collection
      .where("AuthID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeStudentUserDataAction(me));
        });
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleConnectionsList = () => {
    return connections.map((conn, i) => {
      return (
        <div className="connBlock" key={i}>
          <p className="connName">
            {conn.FirstName} {conn.LastName}
          </p>
          <p className="connEmail">{conn.Email}</p>

          <div className="btnsConn">
            <button className="btnConnMessage">Message</button>
            <button
              id={conn.AuthID}
              onClick={navConnProfile}
              className="btnConnProfile"
            >
              Profile
            </button>
            <button id={conn.id} className="btnConnRemove">
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        </div>
      );
    });
  };
  const handleSearchList = () => {
    return allSearchUsers.map((user, i) => {
      return (
        <div className="searchResBlock" key={i}>
          <p className="searchResName">
            {user.FirstName} {user.LastName}
          </p>
          <p className="searchResAuth">{user.AuthID}</p>
          <p className="searchResType">{user.AccountType}</p>
          {handleRequest(user.AuthID)}
        </div>
      );
    });
  };
  const handleRequest = (authID) => {
    let found = false;
    connections.forEach((conn) => {
      if (conn.AuthID === authID) {
        found = true;
      } else {
        // Do Nothing
      }
    });

    // Search in connection request
    allConnReqs.forEach((req) => {
      // Check if authID matches any of the reqs in here
      if (req.ConnID === authID) {
        found = true;
      } else {
        // Do Nothing
      }
    });

    if (found) {
      return <p className="reqSent">Request Sent</p>;
    } else {
      return (
        <button id={authID} onClick={sendRequest} className="btnSearchResReq">
          Send Request
        </button>
      );
    }
  };

  // SEARCH
  const searchUser = () => {
    const search = document.querySelector("#tbConnSearch").value.toLowerCase();

    const searchArr = search.split(" ");

    if (searchArr.length === 1) {
      document.querySelector("#searchListBlock").classList.remove("hide");
      // Assume they entered a first name or username
      const word = searchArr[0];
      const capitalized = word.replace(/^./, word[0].toUpperCase());

      users_Collection
        .where("FirstName", "==", capitalized)
        .get()
        .then((snapshot) => {
          const usersFirst = firebaseLooper(snapshot);
          if (usersFirst.length > 0) {
            // Found some first names
            dispatch(storeStudentAllSearchUsersAction(usersFirst));
          } else {
            // Did  not find first names
            users_Collection
              .where("AuthID", "==", word)
              .get()
              .then((snapshot) => {
                const usersAuth = firebaseLooper(snapshot);
                if (usersAuth.length > 0) {
                  // Found some usernames
                  dispatch(storeStudentAllSearchUsersAction(usersAuth));
                } else {
                  // Found nothing!
                  dispatch(storeStudentAllSearchUsersAction([]));
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    } else if (searchArr.length === 2) {
      const firstName = searchArr[0];
      const lastName = searchArr[1];
      const firstCap = firstName.replace(/^./, firstName[0].toUpperCase());
      const lastCap = lastName.replace(/^./, lastName[0].toUpperCase());

      // Assume they entered a full name
      users_Collection
        .where("FirstName", "==", firstCap)
        .get()
        .then((snapshot) => {
          const usersFirst = firebaseLooper(snapshot);
          const userCount = snapshot.size;
          if (userCount > 0) {
            let fullUsers = [];
            // Found first names
            usersFirst.forEach((u, i) => {
              if (u.LastName === lastCap) {
                // Found user
                fullUsers.push(u);
              }
              if (i + 1 === userCount) {
                dispatch(storeStudentAllSearchUsersAction(fullUsers));
                document
                  .querySelector("#searchListBlock")
                  .classList.remove("hide");
              }
            });
          } else {
            // Did not find last name
            dispatch(storeStudentAllSearchUsersAction([]));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // REQUEST
  const sendRequest = (event) => {
    const authID = event.target.getAttribute("id");

    users_Collection.where('AuthID','==',studentAuthID).get().then((snapshot) => {
      const myData = firebaseLooper(snapshot);
      myData.forEach(me => {
        allSearchUsers.forEach((u) => {
          if (u.AuthID === authID) {
            // First store request in req queue
            const rand1 = RandomString();
            const rand2 = RandomString();
            const connReqID = `ConnReq${rand1}${rand2}`;
    
            connectionReqQueue_Collection
              .doc(connReqID)
              .set({
                ConnID: u.AuthID,
                SenderID: studentAuthID,
                CFirstName: userState.FirstName,
                CLastName: userState.LastName,
              })
              .catch((err) => console.log(err));
    
            if (u.AccountType === "Student") {
              // User is Student
              // Send Notification
              const notifID = `Notif${rand1}${rand2}`;
    
              students_Collection
                .doc(u.AuthID)
                .collection("Notifications")
                .doc(notifID)
                .set({
                  Action: "connrequest",
                  Text: `You have received a request from ${me.FirstName} ${me.LastName} to connect.`,
                  Date: GetToday(),
                  Icon: "faUser",
                })
                .catch((err) => console.log(err));
            } else if (u.AccountType === "Teacher") {
              // User is Teacher
              // Send Notification
              const notifID = `Notif${rand1}${rand2}`;
    
              teachers_Collection
                .doc(u.AuthID)
                .collection("Notifications")
                .doc(notifID)
                .set({
                  Action: "connrequest",
                  Text: `You have received a request from ${me.FirstName} ${me.LastName} to connect.`,
                  Date: GetToday(),
                  Icon: "faUser",
                })
                .catch((err) => console.log(err));
            }
    
            // Dispatch
            const allReqs = [...allConnReqs];
            allReqs.push({
              ConnID: u.AuthID,
              SenderID: studentAuthID,
              CFirstName: userState.FirstName,
              CLastName: userState.LastName,
            });
            dispatch(storeStudentAllConnReqsAction(allReqs));
          }
        });
      })
    }).catch(err => console.log(err));
  };

  // NAV
  const navConnProfile = (event) => {
    const authID = event.target.getAttribute("id");

    users_Collection
      .where("AuthID", "==", authID)
      .get()
      .then((snapshot) => {
        const userData = firebaseLooper(snapshot);
        userData.forEach((user) => {
          dispatch(storeStudentUserDataAction(user));
        });
      })
      .catch((err) => console.log(err));

    history.push("/student-profile");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllConnections();
    getAllConnRequests();
    getMyUserData();
    document.querySelector("#searchListBlock").classList.add("hide");
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Connections</h1>

        <div className="white-background">
          <h3 className="headSearch">Search for Connections</h3>
          <input
            className="tbConnSearch"
            id="tbConnSearch"
            type="text"
            placeholder="Type Name or ID here.  'Jack Milton' or 'jckmltn"
          />
          <button className="btnConnSearch" onClick={searchUser}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          {/* Search List */}
          <div id="searchListBlock" className="searchListBlock">
            <FontAwesomeIcon
              onClick={() => {
                document
                  .querySelector("#searchListBlock")
                  .classList.add("hide");
              }}
              className="closeSearchList"
              icon={faTimes}
            />
            {handleSearchList()}
          </div>
        </div>

        <div className="white-background">{handleConnectionsList()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
