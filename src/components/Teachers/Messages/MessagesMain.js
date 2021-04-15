import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import {
  teachers_Collection,
  students_Collection,
} from "../../../utils/firebase";
import {
  storeTeacherMessagesGeneralInfoAction,
  storeTeacherSingleThreadAction,
  toggleTeacherNewMessageAction,
  storeTeacherStudentGeneralInfoAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import RandomString from "../../RandomString";

export default function MessagesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const toggleNewMessageForm = useSelector(
    (state) => state.toggleTeacherNewMessageReducer
  );

  const messages = useSelector(
    (state) => state.storeTeacherMessagesGeneralInfoReducer
  );
  const students = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );

  // GET
  const getAllMessages = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .get()
      .then((snapshot) => {
        const threads = firebaseLooper(snapshot);
        const threadCount = snapshot.size;
        let tempArray = [];
        threads.forEach((thread, i) => {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Messages")
            .doc(thread.id)
            .collection("MessageBlocks")
            .orderBy("Date", "asc")
            .get()
            .then((snapshot) => {
              const messageBlocks = firebaseLooper(snapshot);
              thread = {
                ...thread,
                Messages: messageBlocks,
              };
              tempArray.push(thread);
              if (i + 1 === threadCount) {
                dispatch(storeTeacherMessagesGeneralInfoAction(tempArray));
              }
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllStudentGeneralInfo = () => {
    const student_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Students");
    student_Collection
      .get()
      .then((snapshot) => {
        const studentData = firebaseLooper(snapshot);
        const studCount = snapshot.size;
        // You now have student IDs, now get their data from the student table
        let studentArray = [];
        let count = 0;

        studentData.forEach((stud) => {
          students_Collection
            .where("StudentID", "==", stud.id)
            .get()
            .then((snapshot2) => {
              const studData = firebaseLooper(snapshot2);
              studentArray.push(studData[0]);

              if (studCount - 1 === count) {
                dispatch(storeTeacherStudentGeneralInfoAction(studentArray));
              }
              count = count + 1;
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
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
        {students.map((stud, i) => {
          return (
            <button
              key={i}
              id={stud.id}
              onClick={navNewThreadView}
              className="btn-navy"
            >
              {stud.FirstName} {stud.LastName}
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
        dispatch(storeTeacherSingleThreadAction(thread));
      }
    });

    history.push("/teacher-message-thread");
  };
  const navNewThreadView = (event) => {
    const studID = event.target.getAttribute("id");
    let found = false;
    messages.forEach((thread) => {
      if (thread.Recipient === studID) {
        found = true;
      }
    });


    if (found) {
      messages.forEach((thread) => {
        if (thread.Recipient === studID) {
          dispatch(storeTeacherSingleThreadAction(thread));
        }
      });
    } else {
      const rand1 = RandomString();
      const rand2 = RandomString();
      const threadID = `Thread${rand1}${rand2}`;

      teachers_Collection
        .doc(teacherAuthID)
        .collection("Messages")
        .doc(threadID)
        .set({
          Recipient: studID,
        })
        .catch((err) => console.log(err));

      const tempObj = {
        id: threadID,
        Recipient: studID,
      };

      dispatch(storeTeacherSingleThreadAction(tempObj));
    }
    history.push("/teacher-message-thread");
  };

  // REMOVE
  const removeThread = (event) => {
    const threadID = event.target.getAttribute("id");

    // Remove to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .doc(threadID)
      .collection("MessageBlocks")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Messages")
            .doc(threadID)
            .collection("MessageBlocks")
            .doc(d.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .doc(threadID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allMess = [...messages];
    const filtered = allMess.filter((thread) => thread.id !== threadID);

    dispatch(storeTeacherMessagesGeneralInfoAction(filtered));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllStudentGeneralInfo();
    getAllMessages();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <h1>Messages</h1>
        <div>
          {/* New Message */}
          <button onClick={() => dispatch(toggleTeacherNewMessageAction())}>
            {toggleNewMessageForm ? "Close" : "New Message"}
          </button>
          {toggleNewMessageForm ? handleNewMessageForm() : null}
        </div>
        <br />
        <div>
          {/* Threads */}
          {handleThreadList()}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
