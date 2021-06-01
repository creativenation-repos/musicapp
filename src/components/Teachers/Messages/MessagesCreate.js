import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection, users_Collection } from "../../../utils/firebase";
import {
  storeTeacherMessageConnectionsAction,
  storeTeacherMessageThreadAction,
  storeTeacherMessageRecipientAction,
  storeTeacherMessagesGeneralInfoAction,
} from "../../../redux/actions";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { firebaseLooper } from "../../../utils/tools";

import "./Messages.css";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function MessagesCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const connections = useSelector(
    (state) => state.storeTeacherMessageConnectionsReducer
  );
  const messages = useSelector(
    (state) => state.storeTeacherMessagesGeneralInfoReducer
  );

  //  GET
  const getAllConnections = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Connections")
      .orderBy("LastName", "asc")
      .get()
      .then((snapshot) => {
        const connData = firebaseLooper(snapshot);
        let allCons = [];
        connData.forEach((c) => {
          allCons.push(c);
        });

        teachers_Collection
          .doc(teacherAuthID)
          .collection("Students")
          .get()
          .then((snapshot) => {
            const studData = firebaseLooper(snapshot);
            const studSize = snapshot.size;
            if (studSize > 0) {
              studData.forEach((stud, i) => {
                const tempObj = {
                  Email: stud.Email,
                  FirstName: stud.FirstName,
                  LastName: stud.LastName,
                  AuthID: stud.id,
                };

                allCons.push(tempObj);
                if (i + 1 === studSize) {
                  dispatch(storeTeacherMessageConnectionsAction(allCons));
                }
              });
            } else {
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleConnectionList = () => {
    if (connections) {
      return connections.map((conn, i) => {
        return (
          <div className="conn-block" key={i}>
            <p className="conn-name">
              {conn.LastName}, {conn.FirstName}
            </p>
            <p className="conn-auth">{conn.AuthID}</p>
            <button onClick={navMessageView} id={conn.id} className="conn-send">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        );
      });
    }
  };

  //   NAV
  const navMessageView = (event) => {
    const connID = event.currentTarget.getAttribute("id");
    connections.forEach((conn) => {
      if (conn.id === connID) {
        users_Collection
          .where("AuthID", "==", conn.AuthID)
          .get()
          .then((snapshot) => {
            const userData = firebaseLooper(snapshot);
            userData.forEach((u) => {
              dispatch(storeTeacherMessageRecipientAction(u));
            });
          })
          .catch((err) => console.log(err));

        dispatch(storeTeacherMessageConnectionsAction(conn));

        teachers_Collection
          .doc(teacherAuthID)
          .collection("Messages")
          .where("RecipientID", "==", conn.AuthID)
          .get()
          .then((snapshot) => {
            const messData = firebaseLooper(snapshot);
            const messSize = snapshot.size;
            if (messSize === 0) {
              const rand1 = RandomString();
              const rand2 = RandomString();
              const threadID = `Thread${rand1}${rand2}`;

              teachers_Collection
                .doc(teacherAuthID)
                .collection("Messages")
                .doc(threadID)
                .set({
                  RecipientID: conn.AuthID,
                  SenderID: teacherAuthID,
                  Date: GetToday(),
                })
                .catch((err) => console.log(err));

              const allThreads = [...messages];
              allThreads.push({
                id: threadID,
                RecipientID: conn.AuthID,
                SenderID: teacherAuthID,
                Date: GetToday(),
              });
              console.log(allThreads);
              dispatch(storeTeacherMessagesGeneralInfoAction(allThreads));
            } else {
              messData.forEach((mess) => {
                teachers_Collection
                  .doc(teacherAuthID)
                  .collection("Messages")
                  .doc(mess.id)
                  .collection("MessageBlocks")
                  .get()
                  .then((snapshot) => {
                    const threadData = firebaseLooper(snapshot);
                    dispatch(storeTeacherMessageThreadAction(threadData));
                  })
                  .catch((err) => console.log(err));
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });

    history.push("/teacher-message-view");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllConnections();
  }, [connections]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>New Message</h1>
        <div className="white-background">{handleConnectionList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
