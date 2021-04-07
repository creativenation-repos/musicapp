import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeProfileFeedPostDataAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import GetToday from "../../GetToday";

export default function ProfileFeedEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  //   States
  const singlePostState = useSelector(
    (state) => state.storeProfileFeedSinglePostDataReducer
  );
  const allPostsState = useSelector(
    (state) => state.storeProfileFeedPostDataReducer
  );

  const saveSinglePost = () => {
    const postText = document.querySelector("#tbPostText").value;
    const postObj = {
      ...singlePostState,
      Text: postText,
      Date: GetToday(),
    };
    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(singlePostState.id)
      .set({
        Likes: singlePostState.Likes,
        Text: postText,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    allPostsState.forEach((post) => {
      if (post.id === singlePostState.id) {
        post = {
          ...postObj,
        };
        dispatch(storeProfileFeedPostDataAction(allPostsState));
      }
    });

    history.push("/teacher-profile/feed");
  };

  // REMOVE
  const removeSinglePost = () => {
    const postID = singlePostState.id;

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(postID)
      .delete()
      .catch((err) => console.log(err));

    const all = [...allPostsState];
    const newArray = all.filter((post) => post.id !== postID);

    dispatch(storeProfileFeedPostDataAction(newArray));
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
    <div className="post-edit-wrapper">
      <button
        className="btn-back maroon-back"
        onClick={() => {
          history.push("/teacher-profile/feed");
        }}
      >
        Back
      </button>

      <div className="post-create">
        <h1 className="post-create-head">Edit Post</h1>
        <textarea
          className="ta"
          id="tbPostText"
          defaultValue={singlePostState.Text}
        ></textarea>
        <div className="btn-wrapper">
          
          <button className="btn-remove" onClick={removeSinglePost}>
            Remove
          </button>
          <button className="btn-dark" onClick={saveSinglePost}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
