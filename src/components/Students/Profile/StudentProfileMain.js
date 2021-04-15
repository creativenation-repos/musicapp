import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import ProfileFeedView from "../Profile/ProfileFeedView";
import ProfileFeedEdit from "../Profile/ProfileFeedEdit";
import ProfileAboutView from "../Profile/ProfileAboutView";
import ProfileAboutEdit from "../Profile/ProfileAboutEdit";
import ProfileAwardsView from "../Profile/ProfileAwardsView";
import ProfileAwardsEdit from "../Profile/ProfileAwardsEdit";

export default function StudentProfileMain() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Cover Section */}
      <div>
        {/* Profile Photo */}
        <img src="" alt="" />
        {/* Full Name */}
        <h3>
          {user.FirstName} {user.LastName}
        </h3>
        <p>{user.AccountType}</p>
      </div>

      {/* Profile Options */}
      <div>
        <div>
          <ul>
            <Link to={`${url}/feed`}>Feed</Link>
            <br />
            <Link to={`${url}/about`}>About</Link>
            <br />
            <Link to={`${url}/awards`}>Awards</Link>
            <br />
            <Link to={`${url}/gallery`}>Gallery</Link>
            <br />
          </ul>
        </div>

        <div>
          {/* ********************** */}

          {/* Switch */}
          <Switch>
            {/* Feed */}
            <Route path={`${url}/feed`}>
              <ProfileFeedView />
            </Route>
            <Route path={`${url}/feed-edit`}>
              <ProfileFeedEdit />
            </Route>

            {/* About */}
            <Route path={`${url}/about`}>
              <ProfileAboutView />
            </Route>
            <Route path={`${url}/about-edit`}>
              <ProfileAboutEdit />
            </Route>

            {/* Awards */}
            <Route path={`${url}/awards`}>
              <ProfileAwardsView />
            </Route>
            <Route path={`${url}/awards-edit`}>
              <ProfileAwardsEdit />
            </Route>
          </Switch>
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
