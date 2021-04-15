import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { students_Collection } from "../../../utils/firebase";
import {
  storeStudentProfileFeedPostsAction,
  storeStudentProfileFeedPostAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

import GetToday from "../../GetToday";
import RandomString from "../../RandomString";

export default function ProfileFeedView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const posts = useSelector(
    (state) => state.storeStudentProfileFeedPostsReducer
  );

  // GET
  const getAllFeedPosts = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .get()
      .then((snapshot) => {
        const postData = firebaseLooper(snapshot);
        dispatch(storeStudentProfileFeedPostsAction(postData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleAllFeedPosts = () => {
    return posts.map((post, i) => {
      return (
        <div key={i}>
          <h3>
            {user.FirstName} {user.LastName}
          </h3>
          <p>{post.Text}</p>
          <p>{post.Date.toDate().toString().substr(4, 11)}</p>
          <button>Like</button>
          <button id={post.id} onClick={onPostEdit}>
            Edit
          </button>
          <button id={post.id} onClick={removePost}>
            Remove
          </button>
        </div>
      );
    });
  };
  const handleNewPost = () => {
    return (
      <div>
        <h3>Create New Post</h3>
        <textarea id="taNewPost" placeholder="Type Post Here..."></textarea>
        <button onClick={newPost}>Post</button>
      </div>
    );
  };

  // POST
  const newPost = () => {
    const postText = document.querySelector("#taNewPost").value;
    const today = GetToday();
    // Save to DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const postID = `Post${rand1}${rand2}`;
    const commentID = `Comment${rand1}${rand2}`;

    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .set({
        Text: postText,
        Date: today,
        Likes: 0,
      })
      .catch((err) => console.log(err));

    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .collection("Comments")
      .doc(commentID)
      .set({
        Text: "",
        Date: today,
        Commentor: "",
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allPosts = [...posts];
    allPosts.push({
      id: postID,
      Text: postText,
      Date: today,
      Likes: 0,
    });

    dispatch(storeStudentProfileFeedPostsAction(allPosts));

    // Empty ta
    document.querySelector("#taNewPost").value = "";
  };

  // REMOVE
  const removePost = (event) => {
    const postID = event.target.getAttribute("id");

    // Remove from DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allPosts = [...posts];
    const filtered = allPosts.filter((post) => post.id !== postID);
    dispatch(storeStudentProfileFeedPostsAction(filtered));
  };

  // ON CLICK
  const onPostEdit = (event) => {
    const postID = event.target.getAttribute("id");

    posts.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeStudentProfileFeedPostAction(post));
      }
    });

    history.push("/student-profile/feed-edit");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllFeedPosts();
  }, []);
  return (
    <div>
      <hr />
      {/* Create Post */}
      <div>{handleNewPost()}</div>

      <hr />
      {/* Feed */}
      <div>{handleAllFeedPosts()}</div>
    </div>
  );
}
