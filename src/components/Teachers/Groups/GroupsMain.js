import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { groups_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import RandomString from "../../RandomString";
import GetToday from "../../GetToday";
import {
  storeTeacherGroupGeneralInfoAction,
  toggleNewGroupFormAction,
  storeSingleGroupAction,
} from "../../../redux/actions";

export default function GroupsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // Toggles
  const toggleNewGroupForm = useSelector(
    (state) => state.toggleNewGroupFormReducer
  );

  // Data
  const groups = useSelector(
    (state) => state.storeTeacherGroupGeneralInfoReducer
  );

  const getAllGroups = () => {
    groups_Collection
      .get()
      .then((snapshot) => {
        const groupData = firebaseLooper(snapshot);
        dispatch(storeTeacherGroupGeneralInfoAction(groupData));
      })
      .catch((err) => console.log(err));
  };

  const removeGroup = (event) => {
    const groupID = event.target.getAttribute("id");

    // Remove from DB
    groups_Collection
      .doc(groupID)
      .delete()
      .catch((err) => console.log(err));

      

    // Dispatch
    const allGroups = [...groups];
    const filtered = allGroups.filter((group) => group.id !== groupID);

    dispatch(storeTeacherGroupGeneralInfoAction(filtered));

    groups_Collection
      .doc(groupID)
      .delete()
      .catch((err) => console.log(err));
  };

  const OnGroupSearch = () => {
    const searchInput = document.querySelector("#tbGroupSearch").value;

    if (searchInput !== "") {
      let filtered = [];

      groups_Collection
        .get()
        .then((snapshot) => {
          const groupData = firebaseLooper(snapshot);
          groupData.forEach((gr) => {
            const groupName = gr.Name.toLowerCase();
            if (groupName.includes(searchInput)) {
              filtered.push(gr);
            }
          });
          dispatch(storeTeacherGroupGeneralInfoAction(filtered));
        })
        .catch((err) => console.log(err));
    } else {
      groups_Collection
        .get()
        .then((snapshot) => {
          const groupData = firebaseLooper(snapshot);

          dispatch(storeTeacherGroupGeneralInfoAction(groupData));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleGroupList = () => {
    return groups.map((group, i) => {
      return (
        <div key={i}>
          <h3>{group.Name}</h3>
          <p>Host: {group.Host}</p>
          <p>Created: {group.Date.toDate().toString().substr(4, 11)}</p>
          <button id={group.id} onClick={navigateGroupPage}>
            View Page
          </button>
          <button id={group.id} onClick={removeGroup}>
            Remove
          </button>
        </div>
      );
    });
  };

  const handleNewGroupForm = () => {
    return (
      <div>
        <br />
        <div>
          <button
            onClick={() => {
              dispatch(toggleNewGroupFormAction());
            }}
          >
            Close
          </button>
        </div>
        <div>
          <label>Group Name:</label>
          <input id="tbGroupNameText" type="text" placeholder="Group Name" />
        </div>
        <div>
          <label>Description:</label>
          <textarea id="taDescText" placeholder="Description"></textarea>
        </div>
        <div>
          <p>Access:</p>
          <input type="radio" id="raPublic" name="raAccess" value="public" />
          <label for="raPublic">Public</label>
          <p>Choosing public access will allow anyone submit a request.</p>
          <br />
          <input type="radio" id="raPrivate" name="raAccess" value="private" />
          <label for="raPrivate">Private</label>
          <p>
            Choosing private access will require users to use a key to join the
            group.
          </p>
        </div>
        <div>
          <button onClick={createGroup}>Create</button>
        </div>
      </div>
    );
  };

  const navigateGroupPage = (event) => {
    const groupID = event.target.getAttribute("id");

    groups.forEach((gr) => {
      if (gr.id === groupID) {
        dispatch(storeSingleGroupAction(gr));
      }
    });

    history.push("/teacher-group-page");
  };

  const createGroup = () => {
    const groupName = document.querySelector("#tbGroupNameText").value;
    const groupDesc = document.querySelector("#taDescText").value;
    let groupAccess = "";
    const raPublic = document.querySelector("#raPublic");
    const raPrivate = document.querySelector("#raPrivate");
    if (raPublic.checked) {
      groupAccess = "public";
    } else if (raPrivate) {
      groupAccess = "private";
    }

    // Save to DB
    const rand1 = RandomString();
    const rand2 = RandomString();
    const groupID = `Group${rand1}${rand2}`;
    const memberID = `Member${rand1}${rand2}`;
    const postID = `Post${rand1}${rand2}`;

    groups_Collection
      .doc(groupID)
      .set({
        Name: groupName,
        Date: GetToday(),
        Host: teacherAuthID,
        Desc: groupDesc,
        Access: groupAccess,
      })
      .catch((err) => console.log(err));

    groups_Collection
      .doc(groupID)
      .collection("Members")
      .doc(memberID)
      .set({
        Username: teacherAuthID,
        Role: "host",
      })
      .catch((err) => console.log(err));

    groups_Collection
      .doc(groupID)
      .collection("Posts")
      .doc(postID)
      .set({})
      .catch((err) => console.log(err));

    // Dispatch
    const newGroupList = [...groups];
    newGroupList.push({
      Name: groupName,
      Date: GetToday(),
      Host: teacherAuthID,
      Desc: groupDesc,
      Access: groupAccess,
    });
    dispatch(storeTeacherGroupGeneralInfoAction(newGroupList));
    if (toggleNewGroupForm) {
      dispatch(toggleNewGroupFormAction());
    }
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllGroups();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Main Content */}
      <div>
        <div>
          <h1>Groups</h1>
        </div>
        <div>
          <input
            onChange={OnGroupSearch}
            id="tbGroupSearch"
            type="text"
            placeholder="Search"
          />
          <button
            onClick={() => {
              dispatch(toggleNewGroupFormAction());
            }}
          >
            Create New Group
          </button>
        </div>
        <div>{toggleNewGroupForm ? handleNewGroupForm() : null}</div>
        <hr />
        <div>{handleGroupList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
