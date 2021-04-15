import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import ForumBlocks from "./ForumBlocks";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { groups_Collection, forums_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import { storeSingleForumAction } from "../../../redux/actions";
import ForumSingleBlock from "./ForumSingleBlock";

export default function ForumsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const forumState = useSelector(
    (state) => state.storeTeacherForumsGeneralInfoReducer
  );
  const singleForumState = useSelector(
    (state) => state.storeSingleForumReducer
  );

  const groupState = useSelector(
    (state) => state.storeTeacherGroupGeneralInfoReducer
  );

  const getSingleForum = (event) => {
    const id = event.target.getAttribute("id");
    let singleForum = {};
    forumState.forEach((f) => {
      if (f.id === id) {
        const posts_Collection = forums_Collection.doc(id).collection("Posts");
        posts_Collection
          .get()
          .then((snapshot) => {
            const postData = firebaseLooper(snapshot);
            const newPosts = [];
            postData.forEach((pd) => {
              const comments_Collection = forums_Collection
                .doc(id)
                .collection("Posts")
                .doc(pd.id)
                .collection("Comments");
              comments_Collection
                .get()
                .then((snapshot) => {
                  const commentData = firebaseLooper(snapshot);
                  newPosts.push({
                    ...pd,
                    commentData,
                  });
                  singleForum = {
                    ...f,
                    newPosts,
                  };
                  dispatch(storeSingleForumAction(singleForum));
                })
                .catch((err) => console.log(err));
            });
          })
          .catch((err) => console.log(err));
      }
    });
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

      <div>
        <div>
          <input id="tbForumSearch" type="text" placeholder="Search" />
          <button>Search</button>
        </div>

        {/* Forum Content */}
        <div>
          {singleForumState.Topic ? (
            <ForumSingleBlock
              topic={singleForumState.Topic}
              desc={singleForumState.Desc}
              date={singleForumState.DateCreated}
              posts={singleForumState.newPosts}
            />
          ) : null}
        </div>

        <div>
          {forumState.map((f, i) => {
            return (
              <div>
                <ForumBlocks key={i} topic={f.Topic} />
                <button id={f.id} onClick={getSingleForum}>
                  View Discussion
                </button>
                <button>Remove</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
