import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeStudentProfileFeedPostsAction } from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";

export default function ProfileFeedEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const post = useSelector((state) => state.storeStudentProfileFeedPostReducer);
  const posts = useSelector(
    (state) => state.storeStudentProfileFeedPostsReducer
  );

  const savePost = () => {
    const postText = document.querySelector("#taEditPost").value;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Feed")
      .collection("Posts")
      .doc(post.id)
      .update({
        Text: postText,
      })
      .catch((err) => console.log(err));

    //   Dispatch

    const allPosts = [...posts];
    allPosts.forEach((p) => {
      p.Text = postText;
    });

    dispatch(storeStudentProfileFeedPostsAction(allPosts));
    history.push("/student-profile/feed");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);
  return (
    <div>
      <h1>Edit Post</h1>

      <div>
        <textarea
          id="taEditPost"
          type="text"
          defaultValue={post.Text}
        ></textarea>
        <button onClick={savePost}>Save</button>
      </div>
    </div>
  );
}
