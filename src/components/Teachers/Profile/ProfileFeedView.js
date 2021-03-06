import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import {
  storeProfileFeedPostDataAction,
  storeProfileFeedSinglePostDataAction,
  storeTeacherMeDataAction,
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
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);

  // GET
  const getProfileFeedData = () => {
    let feed_Collection;

    if (userDataState.AccountType === "Student") {
      feed_Collection = students_Collection
        .doc(userDataState.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts");
    } else if (userDataState.AccountType === "Teacher") {
      feed_Collection = teachers_Collection
        .doc(userDataState.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts");
    }

    feed_Collection
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        console.log(data);
        dispatch(storeProfileFeedPostDataAction(data));
      })
      .catch((err) => console.log(err));
  };
  const storeSinglePost = (event) => {
    const postID = event.target.getAttribute("id");
    console.log(postID);
    posts.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeProfileFeedSinglePostDataAction(post));
        history.push("/teacher-profile/edit-feed");
      }
    });
  };
  const getMeData = () => {
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeTeacherMeDataAction(me));
        });
      })
      .catch((err) => console.log(err));
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

    if (userDataState.AccountType === "Teacher") {
      let reviewsBtn = document.querySelector("#link-reviews");
      reviewsBtn.classList.remove("navy-back");
    }
  };
  const handlePostList = () => {
    return posts.map((post, i) => {
      return (
        <div className="post-wrapper" key={i}>
          <div className="post-top-wrapper">
            <div className="post-name-split">
              <h3 className="post-name">{post.Poster}</h3>
              <p className="post-date">
                {post.Date ? post.Date.toDate().toString().substr(4, 11) : null}
              </p>
            </div>
            <div>
              {post.Poster === `${meData.FirstName} ${meData.LastName}` ? (
                <button
                  className="btn-edit"
                  id={post.id}
                  onClick={storeSinglePost}
                >
                  Edit
                </button>
              ) : null}
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
    getMeData();
  }, [posts]);

  return (
    <div>
      <button
        className="btn-newPost"
        onClick={() => history.push("/teacher-profile/new-feed")}
      >
        Create Post
      </button>
      <div className="white-background">
        <br />
        <div>{handlePostList()}</div>
      </div>
    </div>
  );
}
