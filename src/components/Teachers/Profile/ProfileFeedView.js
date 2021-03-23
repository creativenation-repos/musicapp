import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeProfileFeedPostDataAction,
  storeProfileFeedSinglePostDataAction,
} from "../../../redux/actions";

import ProfileFeedViewBlock from "./ProfileFeedViewBlock";

export default function ProfileFeedView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   States
  const feedDataState = useSelector(
    (state) => state.storeProfileFeedPostDataReducer
  );

  const getProfileFeedData = () => {
    const feed_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts");
    feed_Collection
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        const feedPostArray = [];
        data.forEach((d, i) => {
          const comments_Collection = teachers_Collection
            .doc(teacherAuthID)
            .collection("Profile")
            .doc("Feed")
            .collection("Posts")
            .doc(d.id)
            .collection("Comments");
          comments_Collection
            .orderBy("Date", "desc")
            .get()
            .then((snapshot) => {
              const commentData = firebaseLooper(snapshot);
              d = {
                ...d,
                commentData,
              };
              feedPostArray.push(d);
              // Dispatch feedPostArray
              if (i === data.length - 1) {
                dispatch(storeProfileFeedPostDataAction(feedPostArray));
              }
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  const storeSinglePost = (event) => {
    const postID = event.target.getAttribute("id");
    feedDataState.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeProfileFeedSinglePostDataAction(post));
        history.push("/teacher-profile/edit-feed");
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getProfileFeedData();
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => history.push("/teacher-profile/new-feed")}>
          Create New Post
        </button>
      </div>
      <hr />
      <div>
        {feedDataState.map((post, i) => {
          return (
            <div key={i}>
              <button id={post.id} onClick={storeSinglePost}>
                Edit
              </button>
              <ProfileFeedViewBlock post={post} />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
