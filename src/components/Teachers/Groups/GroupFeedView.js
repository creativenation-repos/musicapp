import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeGroupFeedPostsAction,
  storeSingleGroupFeedPostAction,
} from "../../../redux/actions";

import { groups_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

import RandomString from "../../RandomString";
import GetToday from "../../GetToday";

export default function GroupFeedView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.storeSingleGroupReducer);
  const posts = useSelector((state) => state.storeGroupFeedPostsReducer);

  const getAllPosts = () => {
    groups_Collection
      .doc(group.id)
      .collection("Posts")
      .get()
      .then((snapshot) => {
        const posts = firebaseLooper(snapshot);
        const allPosts = [];
        posts.forEach((post) => {
          if (post.Poster) {
            allPosts.push(post);
          }
        });
        dispatch(storeGroupFeedPostsAction(allPosts));
      })
      .catch((err) => console.log(err));
  };

  const handleFeedPosts = () => {
    return posts.map((post, i) => {
      return (
        <div key={i}>
          <h3>{post.Poster}</h3>
          <p>{post.Text}</p>
          <p>{post.Date.toDate().toString().substr(4, 11)}</p>
          {post.Poster === teacherAuthID ? (
            <div>
              <button id={post.id} onClick={navigateEdit}>
                Edit
              </button>
              <button id={post.id} onClick={removePost}>
                Remove
              </button>
            </div>
          ) : null}
        </div>
      );
    });
  };

  const createPost = () => {
    const postText = document.querySelector("#taPostText").value;

    // Send to DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const postID = `Post${rand1}${rand2}`;
    const commentID = `Comment${rand1}${rand2}`;

    groups_Collection
      .doc(group.id)
      .collection("Posts")
      .doc(postID)
      .set({
        Poster: teacherAuthID,
        Text: postText,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    groups_Collection
      .doc(group.id)
      .collection("Posts")
      .doc(postID)
      .collection("Comments")
      .doc(commentID)
      .set({})
      .catch((err) => console.log(err));

    // Dispatch
    const allPosts = [...posts];
    allPosts.push({
      id: postID,
      Poster: teacherAuthID,
      Text: postText,
      Date: GetToday(),
    });
    dispatch(storeGroupFeedPostsAction(allPosts));

    document.querySelector("#taPostText").value = "";
  };

  const removePost = (event) => {
    const postID = event.target.getAttribute("id");

    // Remove from DB
    groups_Collection
      .doc(group.id)
      .collection("Posts")
      .doc(postID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const groupPosts = [...posts];
    const filtered = groupPosts.filter((post) => post.id !== postID);

    dispatch(storeGroupFeedPostsAction(filtered));
  };

  const navigateEdit = (event) => {
    const postID = event.target.getAttribute("id");

    posts.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeSingleGroupFeedPostAction(post));
      }
    });

    history.push("/teacher-group-page/feed-edit");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllPosts();
  }, []);
  return (
    <div>
      {/* New Post */}
      <div>
        <h4>Create a post.</h4>
        <textarea id="taPostText" placeholder="Type post here..."></textarea>
        <br />
        <button onClick={createPost}>Post</button>
      </div>
      <hr />
      {/* Post List */}
      <div>{handleFeedPosts()}</div>
    </div>
  );
}
