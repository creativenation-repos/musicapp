import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentMeDataAction,
  storeStudentProfileFeedPostsAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
  users_Collection,
} from "../../../utils/firebase";
import GetToday from "../../GetToday";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentProfileFeedEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   States
  const singlePostState = useSelector(
    (state) => state.storeStudentProfileFeedPostReducer
  );
  const allPostsState = useSelector(
    (state) => state.storeStudentProfileFeedPostsReducer
  );
  const meData = useSelector((state) => state.storeStudentMeDataReducer);

  // GET
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
  const saveSinglePost = () => {
    const postText = document.querySelector("#tbPostText").value;

    const postObj = {
      ...singlePostState,
      Poster: `${meData.Firstname} ${meData.LastName}`,
      Text: postText,
      Date: GetToday(),
    };

    // Save to DB
    if (user.AccountType === "Student") {
      students_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts")
        .doc(singlePostState.id)
        .set({
          Poster: `${meData.FirstName} ${meData.LastName}`,
          Likes: singlePostState.Likes,
          Text: postText,
          Date: GetToday(),
        })
        .catch((err) => console.log(err));
    } else if (user.AccountType === "Teacher") {
      teachers_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts")
        .doc(singlePostState.id)
        .set({
          Poster: `${meData.FirstName} ${meData.LastName}`,
          Likes: singlePostState.Likes,
          Text: postText,
          Date: GetToday(),
        })
        .catch((err) => console.log(err));
    }

    allPostsState.forEach((post) => {
      if (post.id === singlePostState.id) {
        post = {
          ...postObj,
        };
        dispatch(storeStudentProfileFeedPostsAction(allPostsState));
      }
    });

    history.push("/student-profile/feed");
  };

  // REMOVE
  const removeSinglePost = () => {
    const postID = singlePostState.id;

    if (user.AccountType === "Student") {
      students_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts")
        .doc(postID)
        .delete()
        .catch((err) => console.log(err));
    } else if (user.AccountType === "Teacher") {
      teachers_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Feed")
        .collection("Posts")
        .doc(postID)
        .delete()
        .catch((err) => console.log(err));
    }

    const allPosts = [...allPostsState];
    const filtered = allPosts.filter((p) => p.id !== postID);
    filtered.sort((a, b) => b.Date - a.Date);
    dispatch(storeStudentProfileFeedPostsAction(filtered));

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
    getMeData();
  }, []);

  return (
    <div className="post-edit-wrapper">
      <button
        className="btn-back maroon-back"
        onClick={() => {
          history.push("/student-profile/feed");
        }}
      >
        Back
      </button>

      <div className="post-create">
        <h2 className="post-create-head">Edit Post</h2>
        <textarea
          className="ta"
          id="tbPostText"
          defaultValue={singlePostState.Text}
        ></textarea>
        <div className="btn-wrapper">
          <button className="btn-remove" onClick={removeSinglePost}>
            Remove
          </button>
          <button className="btn-save" onClick={saveSinglePost}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
