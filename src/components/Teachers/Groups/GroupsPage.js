import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import GroupFeedView from "../Groups/GroupFeedView";
import GroupFeedEdit from "../Groups/GroupFeedEdit";
import GroupAboutView from "../Groups/GroupAboutView";
import GroupAboutEdit from "../Groups/GroupAboutEdit";
import GroupMembersView from "../Groups/GroupMembersView";
import RandomString from "../../RandomString";

// Router stuff
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import {
  groups_Collection,
  groupReqQueue_Collection,
} from "../../../utils/firebase";
import {
  checkJoinedGroupStatusAction,
  checkRequestedGroupStatusAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function GroupsPage() {
  let { url } = useRouteMatch();
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.storeSingleGroupReducer);
  const joined = useSelector((state) => state.checkJoinedGroupStatusReducer);
  const requested = useSelector(
    (state) => state.checkRequestedGroupStatusReducer
  );

  const joinGroup = () => {
    const rand1 = RandomString();
    const rand2 = RandomString();
    const reqID = `GroupReq${rand1}${rand2}`;

    // Send Request to DB
    groupReqQueue_Collection
      .doc(reqID)
      .set({
        MemberID: teacherAuthID,
        HostID: group.Host,
        isAccepted: false,
      })
      .catch((err) => console.log(err));

    // Dispatch
    dispatch(checkRequestedGroupStatusAction(true));
  };
  const disconnectGroup = () => {
    if (teacherAuthID === group.Host) {
      // Show modal
      alert(
        "Our apologies. You are not able to disconnect from this group since you are the host."
      );
    } else {
      // Remove from DB
      groups_Collection
        .doc(group.id)
        .collection("Members")
        .get()
        .then((snapshot) => {
          const memberData = firebaseLooper(snapshot);
          memberData.forEach((mem) => {
            if (mem.Username === teacherAuthID) {
              groups_Collection
                .doc(group.id)
                .collection("Members")
                .doc(mem.id)
                .delete()
                .catch((err) => console.log(err));
            }
          });
        })
        .catch((err) => console.log(err));
    }

    // Dispatch
    dispatch(checkJoinedGroupStatusAction(false));
  };

  const checkJoined = () => {
    groups_Collection
      .doc(group.id)
      .collection("Members")
      .get()
      .then((snapshot) => {
        const memberData = firebaseLooper(snapshot);
        memberData.forEach((mem) => {
          if (mem.Username === teacherAuthID) {
            dispatch(checkJoinedGroupStatusAction(true));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const checkRequested = () => {
    groupReqQueue_Collection
      .get()
      .then((snapshot) => {
        const queueData = firebaseLooper(snapshot);
        queueData.forEach((q) => {
          if (q.MemberID === teacherAuthID) {
            dispatch(checkRequestedGroupStatusAction(true));
          }
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    checkJoined();
    checkRequested();
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
          <h1>{group.Name}</h1>
        </div>
        <div>
          {joined ? (
            <button onClick={disconnectGroup}>Disconnect</button>
          ) : requested ? (
            <button enabled="false">Request Sent</button>
          ) : (
            <button onClick={joinGroup}>Join</button>
          )}
        </div>
      </div>

      <div>
        <ul>
          <li>
            <Link to={`${url}/feed`}>Feed</Link>
          </li>
          <li>
            <Link to={`${url}/about`}>About</Link>
          </li>
          <li>
            <Link to={`${url}/members`}>Members</Link>
          </li>
        </ul>
      </div>

      <div>
        <Switch>
          {/* Feed */}
          <Route path={`${url}/feed`}>
            <GroupFeedView />
          </Route>
          <Route path={`${url}/feed-edit`}>
            <GroupFeedEdit />
          </Route>
          {/* About */}
          <Route path={`${url}/about`}>
            <GroupAboutView />
          </Route>
          <Route path={`${url}/about-edit`}>
            <GroupAboutEdit />
          </Route>
          {/* Members */}
          <Route path={`${url}/members`}>
            <GroupMembersView />
          </Route>
        </Switch>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
