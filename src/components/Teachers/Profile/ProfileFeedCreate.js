import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeProfileFeedPostDataAction } from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";

import "./Profile.css";

export default function ProfileFeedCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const allPostsState = useSelector(
    (state) => state.storeProfileFeedPostDataReducer
  );
  const profileUser = useSelector((state) => state.userDataReducer);

  // POST
  const savePost = () => {
    const postText = document.querySelector("#tbPostText").value;
    const rand1 = RandomString();
    const rand2 = RandomString();
    const postID = `Post${rand1}${rand2}`;

    // Search for Connection
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          // I have my info, now search for the user's

          const fullName = `${me.FirstName} ${me.LastName}`;

          users_Collection
            .where("AuthID", "==", profileUser.AuthID)
            .get()
            .then((snapshot) => {
              const userData = firebaseLooper(snapshot);
              userData.forEach((u) => {
                if (u.AccountType === "Student") {
                  students_Collection
                    .doc(u.AuthID)
                    .collection("Profile")
                    .doc("Feed")
                    .collection("Posts")
                    .doc(postID)
                    .set({
                      Text: postText,
                      Poster: fullName,
                      Date: GetToday(),
                      Likes: 0,
                    })
                    .catch((err) => console.log(err));
                } else if (u.AccountType === "Teacher") {
                  teachers_Collection
                    .doc(u.AuthID)
                    .collection("Profile")
                    .doc("Feed")
                    .collection("Posts")
                    .doc(postID)
                    .set({
                      Text: postText,
                      Poster: fullName,
                      Date: GetToday(),
                      Likes: 0,
                    })
                    .catch((err) => console.log(err));
                }

                // Dispatch
                const allPosts = [...allPostsState];
                allPosts.push({
                  id: postID,
                  Text: postText,
                  Poster: fullName,
                  Date: GetToday(),
                  Likes: 0,
                });
                allPosts.sort((a, b) => b.Date - a.Date);
                dispatch(storeProfileFeedPostDataAction(allPosts));
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

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
        className="btn-back"
        onClick={() => history.push("/teacher-profile/feed")}
      >
        Back
      </button>
      <div className="post-create">
        <h2 className="post-create-head">Create a Post</h2>

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
