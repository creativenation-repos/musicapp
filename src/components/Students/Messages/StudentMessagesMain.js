import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import RandomString from "../../RandomString";
import { students_Collection } from "../../../utils/firebase";
import {
  storeStudentMessagesAction,
  storeStudentSingleThreadAction,
  toggleStudentNewMessageAction,
  storeStudentTeachersListAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentMessagesMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleNewMessageForm = useSelector(
    (state) => state.toggleStudentNewMessageReducer
  );

  const messages = useSelector((state) => state.storeStudentMessagesReducer);
  const teachers = useSelector(
    (state) => state.storeStudentTeachersListReducer
  );

  //   GET
  const getAllMessages = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Messages")
      .get()
      .then((snapshot) => {
        const messData = firebaseLooper(snapshot);
        const messCount = snapshot.size;
        let tempArray = [];

        messData.forEach((mess, i) => {
          students_Collection
            .doc(studentAuthID)
            .collection("Messages")
            .doc(mess.id)
            .collection("MessageBlocks")
            .orderBy("Date", "asc")
            .get()
            .then((snapshot) => {
              const messageBlocks = firebaseLooper(snapshot);

              const temp = {
                ...mess,
                Messages: messageBlocks,
              };
              tempArray.push(temp);
              if (i + 1 === messCount) {
                dispatch(storeStudentMessagesAction(tempArray));
              }
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllTeachers = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Teachers")
      .get()
      .then((snapshot) => {
        const teachersList = firebaseLooper(snapshot);
        dispatch(storeStudentTeachersListAction(teachersList));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleThreadList = () => {
    return messages.map((mess, i) => {
      return (
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            padding: "0.1% 3%",
            borderRadius: "5px",
            marginBottom: "1%",
          }}
          key={i}
        >
          <h3>{mess.Recipient}</h3>
          <p>
            {mess.Messages[mess.Messages.length - 1]
              ? mess.Messages[mess.Messages.length - 1].Text
              : "Empty"}
          </p>
          <button id={mess.id} onClick={navThreadView}>
            View Thread
          </button>
          <button id={mess.id} onClick={removeThread} className="btn-salmon">
            Remove
          </button>
        </div>
      );
    });
  };
  const handleNewMessageForm = () => {
    return (
      <div>
        <p>Choose Recipient:</p>
        {teachers.map((teach, i) => {
          return (
            <button
              key={i}
              id={teach.TeacherID}
              onClick={navNewThreadView}
              className="btn-navy"
            >
              {teach.FirstName} {teach.LastName}
            </button>
          );
        })}
      </div>
    );
  };

  // NAV
  const navThreadView = (event) => {
    const threadID = event.target.getAttribute("id");

    messages.forEach((thread) => {
      if (thread.id === threadID) {
        dispatch(storeStudentSingleThreadAction(thread));
      }
    });

    history.push("/student-message-thread");
  };
  const navNewThreadView = (event) => {
    const connID = event.target.getAttribute("id");
    let found = false;
    messages.forEach((thread) => {
      if (thread.Recipient === connID) {
        found = true;
      }
    });

    if (found) {
      messages.forEach((thread) => {
        if (thread.Recipient === connID) {
          dispatch(storeStudentSingleThreadAction(thread));
        }
      });
    } else {
      const rand1 = RandomString();
      const rand2 = RandomString();
      const threadID = `Thread${rand1}${rand2}`;

      students_Collection
        .doc(studentAuthID)
        .collection("Messages")
        .doc(threadID)
        .set({
          Recipient: connID,
        })
        .catch((err) => console.log(err));

      const tempObj = {
        id: threadID,
        Recipient: connID,
      };

      dispatch(storeStudentSingleThreadAction(tempObj));
    }
    history.push("/student-message-thread");
  };

  // REMOVE
  const removeThread = (event) => {
    const threadID = event.target.getAttribute("id");

    // Remove to DB
    students_Collection
      .doc(studentAuthID)
      .collection("Messages")
      .doc(threadID)
      .collection("MessageBlocks")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          students_Collection
            .doc(studentAuthID)
            .collection("Messages")
            .doc(threadID)
            .collection("MessageBlocks")
            .doc(d.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
    students_Collection
      .doc(studentAuthID)
      .collection("Messages")
      .doc(threadID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allMess = [...messages];
    const filtered = allMess.filter((thread) => thread.id !== threadID);

    dispatch(storeStudentMessagesAction(filtered));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllMessages();
    getAllTeachers();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <h1>Messages</h1>
        <div>
          {/* New Message */}
          <button onClick={() => dispatch(toggleStudentNewMessageAction())}>
            {toggleNewMessageForm ? "Close" : "New Message"}
          </button>
          {toggleNewMessageForm ? handleNewMessageForm() : null}
        </div>
        <br />
        <div>{handleThreadList()}</div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
