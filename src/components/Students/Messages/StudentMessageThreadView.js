import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { storeStudentSingleThreadAction } from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentMessageThreadView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const thread = useSelector((state) => state.storeStudentSingleThreadReducer);

  //   HANDLE
  const handleMessages = () => {
    if (thread.Messages) {
      return thread.Messages.map((mess, i) => {
        return (
          <div key={i}>
            <h4
              style={
                mess.Sender === studentAuthID
                  ? { color: "blue" }
                  : { color: "rgba(0,0,0,0.6)" }
              }
            >
              {mess.Sender}
            </h4>
            <p>{mess.Text}</p>
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
    students_Collection
      .doc(studentAuthID)
      .collection("Messages")
      .doc(thread.id)
      .collection("MessageBlocks")
      .doc(messID)
      .set({
        Sender: studentAuthID,
        Text: message,
        Receiver: thread.Recipient,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    // Save to Teacher DB
    teachers_Collection
      .doc(thread.Recipient)
      .collection("Messages")
      .where("Recipient", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          if (d.Recipient === studentAuthID) {
            teachers_Collection
              .doc(thread.Recipient)
              .collection("Messages")
              .doc(d.id)
              .collection("MessageBlocks")
              .doc(messID)
              .set({
                Sender: studentAuthID,
                Text: message,
                Receiver: thread.Recipient,
                Date: GetToday(),
              })
              .catch((err) => console.log(err));
          }
        });
      })
      .catch((err) => console.log(err));

    //   Dispatch
    let allMess = [...thread.Messages];
    allMess.push({
      id: messID,
      Sender: studentAuthID,
      Text: message,
      Receiver: thread.Recipient,
      Date: GetToday(),
    });

    const tempObj = { ...thread };
    tempObj.Messages = allMess;

    dispatch(storeStudentSingleThreadAction(tempObj));
    document.querySelector("#tbMessage").value = "";
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <button onClick={() => history.push("/student-messages")}>Back</button>
        <h1>Recipient: {thread.Recipient}</h1>

        {/* Messaages */}
        <div>{handleMessages()}</div>

        {/* input */}
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
        <Footer />
      </div>
    </div>
  );
}
