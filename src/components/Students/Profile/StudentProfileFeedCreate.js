import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentProfileFeedPostAction,
  storeStudentProfileFeedPostsAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";

export default function StudentProfileFeedCreate() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const allPostsState = useSelector(
    (state) => state.storeStudentProfileFeedPostsReducer
  );

  // POST
  const savePost = () => {
    const postText = document.querySelector("#tbPostText").value;
    const rand1 = RandomString();
    const rand2 = RandomString();
    const postID = `Post${rand1}${rand2}`;

    // Search for Connection
    users_Collection
      .where("AuthID", "==", studentAuthID)
      .get()
      .then((snapshot) => {
        const myData = firebaseLooper(snapshot);
        myData.forEach((me) => {
          // I have my info, now search for the user's

          const fullName = `${me.FirstName} ${me.LastName}`;

          users_Collection
            .where("AuthID", "==", user.AuthID)
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
                dispatch(storeStudentProfileFeedPostsAction(allPosts));
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));

    history.push("/student-profile/feed");
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

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    handleCurrPage();
  }, []);
  return (
    <div className="post-form-wrapper">
      <button
        className="btn-back"
        onClick={() => history.push("/student-profile/feed")}
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
