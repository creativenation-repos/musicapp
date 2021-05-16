import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  storeStudentProfileFeedPostsAction,
  storeStudentProfileFeedPostAction,
  storeStudentMeDataAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";

export default function StudentProfileFeedView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   States
  const posts = useSelector(
    (state) => state.storeStudentProfileFeedPostsReducer
  );
  const meData = useSelector((state) => state.storeStudentMeDataReducer);

  // GET
  const getProfileFeedData = () => {
    let feed_Collection;

    if (user.AccountType === "Student") {
      feed_Collection = students_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts");
    } else if (user.AccountType === "Teacher") {
      feed_Collection = teachers_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts");
    }

    feed_Collection
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeStudentProfileFeedPostsAction(data));
      })
      .catch((err) => console.log(err));
  };
  const storeSinglePost = (event) => {
    const postID = event.target.getAttribute("id");
    posts.forEach((post) => {
      if (post.id === postID) {
        dispatch(storeStudentProfileFeedPostAction(post));
        history.push("/student-profile/feed-edit");
      }
    });
  };
  const getMeData = () => {
    users_Collection
      .where("AuthID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          dispatch(storeStudentMeDataAction(me));
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

    if (user.AccountType === "Teacher") {
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
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getProfileFeedData();
    handleCurrPage();
    getMeData();
  }, [posts]);
  return (
    <div>
      <div>
        <button
          className="btn-newPost"
          onClick={() => history.push("/student-profile/feed-create")}
        >
          Create Post
        </button>
        <br />
        <div className="white-background">{handlePostList()}</div>
      </div>
    </div>
  );
}
