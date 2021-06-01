import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherMessageRecipientAction,
  storeTeacherMessagesGeneralInfoAction,
  storeTeacherMessageThreadAction,
} from "../../../redux/actions";
import { teachers_Collection, users_Collection } from "../../../utils/firebase";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

import { firebaseLooper } from "../../../utils/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faMinus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function MessagesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const messages = useSelector(
    (state) => state.storeTeacherMessagesGeneralInfoReducer
  );

  // GET
  const getAllMessages = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .get()
      .then((snapshot) => {
        const messageData = firebaseLooper(snapshot);
        const messSize = snapshot.size;
        messageData.forEach((mess, i) => {
          let allMess = [];
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Messages")
            .doc(mess.id)
            .collection("MessageBlocks")
            .orderBy("Date", "desc")
            .get()
            .then((snapshot) => {
              const messBlockData = firebaseLooper(snapshot);
              const lastMessObj = messBlockData[0];

              users_Collection
                .where("AuthID", "==", mess.RecipientID)
                .get()
                .then((snapshot) => {
                  const userData = firebaseLooper(snapshot);
                  userData.forEach((u) => {
                    mess = {
                      ...mess,
                      LastMessage: lastMessObj.Text,
                      RecipientFullName: `${u.FirstName} ${u.LastName}`,
                    };
                    allMess.push(mess);
                    if (i + 1 === messSize) {
                      dispatch(storeTeacherMessagesGeneralInfoAction(allMess));
                    }
                  });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  // HANDLE
  const handleMessageList = () => {
    return messages.map((mess, i) => {
      return (
        <div className="mess-thread-block" key={i}>
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
              <p className="mess-thread-recipient">{mess.RecipientFullName}</p>
              <p className="mess-thread-message">{mess.LastMessage}</p>
            </div>
            <div class="margin-left">
              <button
                id={mess.id}
                onClick={navMessageView}
                className="btn-open"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              <button
                onClick={removeMessage}
                id={`${mess.RecipientID} ${mess.id}`}
                className="btn-del-mess"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          </div>
        </div>
      );
    });
  };
  // REMOVE
  const removeMessage = (event) => {
    const idArr = event.currentTarget.getAttribute("id").split(" ");
    const recID = idArr[0];
    const meID = idArr[1];

    // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Messages")
      .where("RecipientID", "==", recID)
      .get()
      .then((snapshot) => {
        const messData = firebaseLooper(snapshot);
        messData.forEach((m) => {
          teachers_Collection
            .doc(teacherAuthID)
            .collection("Messages")
            .doc(m.id)
            .collection("MessageBlocks")
            .get()
            .then((snapshot) => {
              const messBlockData = firebaseLooper(snapshot);
              messBlockData.forEach((mb) => {
                teachers_Collection
                  .doc(teacherAuthID)
                  .collection("Messages")
                  .doc(m.id)
                  .collection("MessageBlocks")
                  .doc(mb.id)
                  .delete()
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          teachers_Collection
            .doc(teacherAuthID)
            .collection("Messages")
            .doc(m.id)
            .delete()
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allMess = [...messages];
    const filtered = allMess.filter((m) => m.id !== meID);

    dispatch(storeTeacherMessagesGeneralInfoAction(filtered));
  };
  // NAV
  const navMessageView = (event) => {
    const messID = event.currentTarget.getAttribute("id");

    messages.forEach((mess) => {
      if (mess.id === messID) {
        users_Collection
          .where("AuthID", "==", mess.RecipientID)
          .get()
          .then((snapshot) => {
            const recData = firebaseLooper(snapshot);
            recData.forEach((re) => {
              dispatch(storeTeacherMessageRecipientAction(re));
            });
          })
          .catch((err) => console.log(err));

        teachers_Collection
          .doc(teacherAuthID)
          .collection("Messages")
          .doc(mess.id)
          .collection("MessageBlocks")
          .get()
          .then((snapshot) => {
            const messBlocksData = firebaseLooper(snapshot);
            dispatch(storeTeacherMessageThreadAction(messBlocksData));
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

    getAllMessages();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Messages</h1>
        <button
          onClick={() => history.push("/teacher-message-create")}
          className="btnCreate"
        >
          Create New Message
        </button>

        <div className="white-background">{handleMessageList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
