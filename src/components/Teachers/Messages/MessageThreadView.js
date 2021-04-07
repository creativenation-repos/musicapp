import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { storeTeacherSingleThreadAction } from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function MessageThreadView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const thread = useSelector((state) => state.storeTeacherSingleThreadReducer);

  //   HANDLE
  const handleMessageList = () => {
    if (thread.Messages) {
      return thread.Messages.map((message, i) => {
        return (
          <div key={i}>
            <h4
              style={
                message.Sender === teacherAuthID
                  ? { color: "blue" }
                  : { color: "rgba(0,0,0,0.6)" }
              }
            >
              {message.Sender}
            </h4>
            <p>{message.Text}</p>
          </div>
        );
      });
    }
  };

  //   POST
  const sendMessage = () => {
    const message = document.querySelector("#tbMessage").value;
    const rand1 = RandomString();
    const rand2 = RandomString();
    const messID = `Mess${rand1}${rand2}`;
    // Save to Teacher DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .doc(thread.id)
      .collection("MessageBlocks")
      .doc(messID)
      .set({
        Sender: teacherAuthID,
        Text: message,
        Receiver: thread.Recipient,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    // Save to Student DB
    students_Collection
      .doc(thread.Recipient)
      .collection("Messages")
      .where("Recipient", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        if (snapshot.size > 0) {
          data.forEach((d) => {
            if (d.Recipient === teacherAuthID) {
              students_Collection
                .doc(thread.Recipient)
                .collection("Messages")
                .doc(d.id)
                .collection("MessageBlocks")
                .doc(messID)
                .set({
                  Sender: teacherAuthID,
                  Text: message,
                  Receiver: thread.Recipient,
                  Date: GetToday(),
                })
                .catch((err) => console.log(err));
            }
          });
        } else {
          students_Collection
            .doc(thread.Recipient)
            .collection("Messages")
            .doc(thread.id)
            .set({
              Recipient: thread.Recipient,
            })
            .catch((err) => console.log(err));

          students_Collection
            .doc(thread.Recipient)
            .collection("Messages")
            .doc(thread.id)
            .collection("MessageBlocks")
            .doc(messID)
            .set({
              Sender: teacherAuthID,
              Text: message,
              Receiver: thread.Recipient,
              Date: GetToday(),
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    //   Dispatch
    let allMess = [...thread.Messages];
    allMess.push({
      id: messID,
      Sender: teacherAuthID,
      Text: message,
      Receiver: thread.Recipient,
      Date: GetToday(),
    });

    const tempObj = { ...thread };
    tempObj.Messages = allMess;

    dispatch(storeTeacherSingleThreadAction(tempObj));
    document.querySelector("#tbMessage").value = "";
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Thread */}
      <div>
        <div>
          <button onClick={() => history.push("/teacher-messages")}>
            Back
          </button>
          <h1>Recipient: {thread.Recipient}</h1>
        </div>

        <div>{handleMessageList()}</div>
        <hr />
        <div>
          <input
            id="tbMessage"
            type="text"
            placeholder="Type message here..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
