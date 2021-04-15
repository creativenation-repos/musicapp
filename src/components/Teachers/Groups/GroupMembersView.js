import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeGroupMembersListAction } from "../../../redux/actions";
import { groups_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function GroupMembersView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const members = useSelector((state) => state.storeGroupMembersListReducer);
  const group = useSelector((state) => state.storeSingleGroupReducer);

  const getAllMembers = () => {
    groups_Collection
      .doc(group.id)
      .collection("Members")
      .get()
      .then((snapshot) => {
        const memberData = firebaseLooper(snapshot);
        dispatch(storeGroupMembersListAction(memberData));
      })
      .catch((err) => console.log(err));
  };

  const handleMemberList = () => {
    return members.map((mem, i) => {
      if (mem.Username) {
        return (
          <div key={i}>
            {/* Profile Pic */}
            <img src="" alt="" />

            <p>{mem.Username}</p>
            <p>{mem.Role}</p>
          </div>
        );
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllMembers();
  }, []);
  return (
    <div>
      <div>{handleMemberList()}</div>
    </div>
  );
}
