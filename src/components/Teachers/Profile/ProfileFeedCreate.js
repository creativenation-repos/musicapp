import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeProfileFeedPostDataAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import GetToday from "../../GetToday";

import "./Profile.css";

export default function ProfileFeedCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const allPostsState = useSelector(
    (state) => state.storeProfileFeedPostDataReducer
  );

  // POST
  const savePost = () => {
    const postText = document.querySelector("#tbPostText").value;
    let rand1 = Math.random().toString(36).substring(3);
    let rand2 = Math.random().toString(36).substring(3);
    const postID = `Post${rand1}${rand2}`;
    const commentID = `Comment${rand1}${rand2}`;

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .set({
        Date: GetToday(),
        Text: postText,
        Likes: 0,
      })
      .catch((err) => console.log(err));

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .collection("Comments")
      .doc(commentID)
      .set({
        Date: GetToday(),
        Text: "",
        Commenter: "",
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allPosts = [...allPostsState];

    allPosts.push({
      Text: postText,
      Date: GetToday(),
      Likes: 0,
      commentData: [],
    });

    console.log(allPosts);

    dispatch(storeProfileFeedPostDataAction(allPosts));

    history.push("/teacher-profile/feed");
  };

  // HANDLE
  const handleCurrPage = () => {
    let feedBtn = document.querySelector("#link-feed");
    feedBtn.classList.add("navy-back");

    let aboutBtn = document.querySelector("#link-about");
    aboutBtn.classList.remove("navy-back");

    let awardsBtn = document.querySelector("#link-awards");
    awardsBtn.classList.remove("navy-back");

    let galleryBtn = document.querySelector("#link-gallery");
    galleryBtn.classList.remove("navy-back");

    let reviewsBtn = document.querySelector("#link-reviews");
    reviewsBtn.classList.remove("navy-back");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    handleCurrPage();
  }, []);
  return (
    <div className="post-form-wrapper">
      <button
        className="btn-back maroon-back"
        onClick={() => history.push("/teacher-profile/feed")}
      >
        Back
      </button>
      <div className="post-create">
        <h1 className="post-create-head">Create a Post</h1>

        <textarea
          className="ta"
          id="tbPostText"
          placeholder="Enter post here..."
        ></textarea>
        <div className="btn-wrapper">
          <button className="btn-dark btn-post" onClick={savePost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
