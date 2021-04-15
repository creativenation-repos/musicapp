import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeGroupFeedPostsAction } from "../../../redux/actions";
import { groups_Collection } from "../../../utils/firebase";
import GetToday from "../../GetToday";

export default function GroupFeedEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.storeSingleGroupReducer);
  const post = useSelector((state) => state.storeSingleGroupFeedPostReducer);
  const posts = useSelector((state) => state.storeGroupFeedPostsReducer);

  const savePost = () => {
    const editText = document.querySelector("#taEditPostText").value;

    //   Save to DB
    groups_Collection
      .doc(group.id)
      .collection("Posts")
      .doc(post.id)
      .update({
        Date: group.Date,
        Poster: teacherAuthID,
        Text: editText,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const newPosts = [...posts];

    newPosts.forEach((p) => {
      if (p.id === post.id) {
        p = {
          ...p,
          Text: editText,
        };
      }
    });


    dispatch(storeGroupFeedPostsAction(newPosts));
    history.push("/teacher-group-page/feed");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      <div>
        <button onClick={() => history.push("/teacher-group-page/feed")}>
          Back
        </button>
      </div>
      <br />
      <div>
        <textarea id="taEditPostText" defaultValue={post.Text}></textarea>
        <br />
        <button onClick={savePost}>Save</button>
      </div>
    </div>
  );
}
