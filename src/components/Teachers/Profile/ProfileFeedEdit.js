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

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          history.push("/teacher-profile/feed");
        }}
      >
        Back to Feed
      </button>

      <div>
        <h1>Edit Post</h1>
        <label>Post</label>
        <br />
        <input
          id="tbPostText"
          type="text"
          defaultValue={singlePostState.Text}
        />
      </div>
      <button onClick={saveSinglePost}>Save</button>
      <button onClick={removeSinglePost}>Remove</button>
    </div>
  );
}
