import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeProfileFeedPostDataAction,
  storeProfileFeedSinglePostDataAction,
} from "../../../redux/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Profile.css";
import { faEllipsisV, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ProfileFeedView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   States
  const posts = useSelector((state) => state.storeProfileFeedPostDataReducer);
  const userDataState = useSelector((state) => state.userDataReducer);

  // GET
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
    posts.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeProfileFeedSinglePostDataAction(post));
        history.push("/teacher-profile/edit-feed");
      }
    });
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
  const handlePostList = () => {
    return posts.map((post, i) => {
      return (
        <div className="post-wrapper" key={i}>
          <div className="post-top-wrapper">
            <div className="post-name-split">
              <h3 className="post-name">
                {userDataState.FirstName} {userDataState.LastName}
              </h3>
              <p className="post-date">
                {post.Date ? post.Date.toDate().toString().substr(4, 11) : null}
              </p>
            </div>
            <div>
              <button
                className="btn-edit"
                id={post.id}
                onClick={storeSinglePost}
              >
                Edit
              </button>
            </div>
          </div>

          <div className="post-body">
            <p>{post.Text}</p>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getProfileFeedData();
    handleCurrPage();
  }, []);

  return (
    <div>
      <button
        className="btn-newPost"
        onClick={() => history.push("/teacher-profile/new-feed")}
      >
        Create Post
      </button>
      <br />
      <div>{handlePostList()}</div>
    </div>
  );
}
