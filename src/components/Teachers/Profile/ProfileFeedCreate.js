import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeProfileFeedPostDataAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import GetToday from "../../GetToday";

export default function ProfileFeedCreate() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const allPostsState = useSelector(
    (state) => state.storeProfileFeedPostDataReducer
  );

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
      commentData: []
    });

    console.log(allPosts);

    dispatch(storeProfileFeedPostDataAction(allPosts));

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
      <h1>Create Post</h1>
      <button onClick={() => history.push("/teacher-profile/feed")}>
        Back to Feed
      </button>

      <div>
        <label>Post</label>
        <br />
        <input id="tbPostText" type="text" placeholder="Enter post here..." />
        <button onClick={savePost}>Post</button>
      </div>
    </div>
  );
}
