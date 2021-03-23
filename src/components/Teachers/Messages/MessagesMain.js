import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import MessageThumbBlock from "./MessageThumbBlock";
import MessagesThread from "./MessagesThread";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeTeacherMessagesAction,
  storeSingleThreadAction,
} from "../../../redux/actions";

export default function MessagesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const messageState = useSelector(
    (state) => state.storeTeacherMessagesGeneralInfoReducer
  );
  const messagesData = useSelector(
    (state) => state.storeTeacherMessagesReducer
  );
  const threadData = useSelector((state) => state.storeSingleThreadReducer);

  const getThumbnailMessageData = () => {
    const messageData = [];
    messageState.forEach((mess, i) => {
      const messages_Collection = teachers_Collection
        .doc(teacherAuthID)
        .collection("Messages")
        .doc(mess.id)
        .collection("MessageBlocks");
      messages_Collection
        .orderBy("Date", "desc")
        .get()
        .then((snapshot) => {
          const data = firebaseLooper(snapshot);
          mess = {
            key: i,
            ...mess,
            messages: data,
          };
          messageData.push(mess);
          dispatch(storeTeacherMessagesAction(messageData));
        })
        .catch((err) => console.log(err));
    });
  };
  const OnThreadClick = (event) => {
    const threadID = event.target.getAttribute("id");
    messagesData.forEach((thread) => {
      if (thread.id === threadID) {
        dispatch(storeSingleThreadAction(thread));
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getThumbnailMessageData();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <div>
          <input id="tbMessageSearch" type="text" placeholder="Search" />
          <button>Send New Message</button>
        </div>
        {/* Main */}
        <div>
          {/* Left */}
          <div>
            {messagesData.map((thread, i) => {
              return (
                <div>
                  <MessageThumbBlock
                    key={i}
                    recipient={thread.RecipientID}
                    firstMessage={thread.messages[0].Text}
                    firstDate={thread.messages[0].Date}
                  />
                  <button id={thread.id} onClick={OnThreadClick}>
                    View
                  </button>
                </div>
              );
            })}
          </div>
          {/* Right */}
          <div>
            {threadData.messages ? (
              <MessagesThread
                user={teacherAuthID}
                recipient={threadData.RecipientID}
                messages={threadData.messages}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
