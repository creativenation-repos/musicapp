import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherMeDataAction,
  storeTeacherMessageRecipientAction,
  storeTeacherMessageThreadAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

import { firebaseLooper } from "../../../utils/tools";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function MessagesView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);

  const connection = useSelector(
    (state) => state.storeTeacherMessageConnectionReducer
  );
  const thread = useSelector((state) => state.storeTeacherMessageThreadReducer);
  const rec = useSelector((state) => state.storeTeacherMessageRecipientReducer);
  const messages = useSelector(
    (state) => state.storeTeacherMessagesGeneralInfoReducer
  );

  // GET
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
  const handleThread = () => {
    return thread.map((t, i) => {
      return (
        <div
          className={
            t.Sender === `${meData.FirstName} ${meData.LastName}`
              ? "mess-sender"
              : "mess-recipient"
          }
          key={i}
        >
          <p className="thread-sender">{t.Sender}</p>
          <p className="thread-date">
            {t.Date ? t.Date.toDate().toString().substr(4, 11) : null}
          </p>
          <p className="thread-text">{t.Text}</p>
        </div>
      );
    });
  };

  // POST
  const sendMessage = () => {
    const message = document.querySelector("#tbMessage").value;
    let messageData;
    console.log(messageData);
    messages.forEach((mess) => {
      if (mess.RecipientID === rec.AuthID) {
        messageData = mess;
      }
    });
    // Save in my DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const messageID = `Mess${rand1}${rand2}`;

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .doc(messageData.id)
      .collection("MessageBlocks")
      .doc(messageID)
      .set({
        Recipient: `${rec.FirstName} ${rec.LastName}`,
        Sender: `${meData.FirstName} ${meData.LastName}`,
        Text: message,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    // Save in his DB
    if (rec.AccountType === "Student") {
      students_Collection
        .doc(rec.AuthID)
        .collection("Messages")
        .where("RecipientID", "==", teacherAuthID)
        .get()
        .then((snapshot) => {
          const studMessData = firebaseLooper(snapshot);
          const studMessSize = snapshot.size;

          if (studMessSize === 0) {
            // No thread
            const rand3 = RandomString();
            const rand4 = RandomString();
            const threadID = `Thread${rand3}${rand4}`;

            students_Collection
              .doc(rec.AuthID)
              .collection("Messages")
              .doc(threadID)
              .set({
                RecipientID: teacherAuthID,
                SenderID: rec.AuthID,
                Date: GetToday(),
              })
              .catch((err) => console.log(err));

            students_Collection
              .doc(rec.AuthID)
              .collection("Messages")
              .doc(threadID)
              .collection("MessageBlocks")
              .doc(messageID)
              .set({
                Recipient: `${rec.FirstName} ${rec.LastName}`,
                Sender: `${meData.FirstName} ${meData.LastName}`,
                Text: message,
                Date: GetToday(),
              })
              .catch((err) => console.log(err));
          } else {
            // Yes thread
            studMessData.forEach((messD) => {
              students_Collection
                .doc(rec.AuthID)
                .collection("Messages")
                .doc(messD.id)
                .collection("MessageBlocks")
                .doc(messageID)
                .set({
                  Recipient: `${rec.FirstName} ${rec.LastName}`,
                  Sender: `${meData.FirstName} ${meData.LastName}`,
                  Text: message,
                  Date: GetToday(),
                })
                .catch((err) => console.log(err));
            });
          }
        })
        .catch((err) => console.log(err));
    }

    // Dispatch

    const allThreads = [...thread];
    allThreads.push({
      Recipient: `${rec.FirstName} ${rec.LastName}`,
      Sender: `${meData.FirstName} ${meData.LastName}`,
      Text: message,
      Date: GetToday(),
    });

    dispatch(storeTeacherMessageThreadAction(allThreads));
    document.querySelector("#tbMessage").value = "";
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getMeData();
    console.log(messages);
  }, [thread]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>
          {rec.FirstName} {rec.LastName}
        </h1>
        <button
          className="btn-back"
          onClick={() => {
            dispatch(storeTeacherMessageRecipientAction({}));
            dispatch(storeTeacherMessageThreadAction([]));
            history.push("/teacher-messages");
          }}
        >
          Back
        </button>

        <div className="white-background">{handleThread()}</div>
        <div className="white-background">
          <input
            className="tb-mess"
            id="tbMessage"
            type="text"
            placeholder="Type message here..."
          />
          <button onClick={sendMessage} className="btn-send">
            Send
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
