import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeSingleGroupAction } from "../../../redux/actions";
import { groups_Collection } from "../../../utils/firebase";

export default function GroupAboutEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.storeSingleGroupReducer);

  const saveEdit = () => {
    const editText = document.querySelector("#taAboutEditText").value;

    //   Save to DB
    groups_Collection.doc(group.id).update({
      Access: group.Access,
      Date: group.Date,
      Desc: editText,
      Host: group.Host,
      Name: group.Name,
    });

    // Dispatch
    const groupObj = {
      ...group,
      id: group.id,
      Desc: editText,
    };

    dispatch(storeSingleGroupAction(groupObj));

    history.push("/teacher-group-page/about");
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
        <button onClick={() => history.push("/teacher-group-page/about")}>
          Back
        </button>
      </div>
      <br />
      <div>
        <textarea id="taAboutEditText" defaultValue={group.Desc}></textarea>
        <br />
        <button onClick={saveEdit}>Save</button>
      </div>
    </div>
  );
}
