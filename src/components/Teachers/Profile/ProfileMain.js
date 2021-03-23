import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import TopBar from "../Dash/TopBar";

import ProfileFeedView from "./ProfileFeedView";
import ProfileFeedEdit from "./ProfileFeedEdit";
import ProfileFeedCreate from "./ProfileFeedCreate";

import ProfileAboutView from "./ProfileAboutView";
import ProfileAboutEdit from "./ProfileAboutEdit";

import ProfileAwardsView from "./ProfileAwardsView";
import ProfileAwardsEdit from "./ProfileAwardsEdit";
import ProfileGallery from "./ProfileGallery";
import ProfileReviewsView from "./ProfileReviewsView";

import DashFooter from "../Dash/DashFooter";

export default function ProfileMain() {
  let { url } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const userDataState = useSelector((state) => state.userDataReducer);

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        {/* Photos */}
        <div>
          <img src="" alt="" />
          <div>
            <h2>{`${userDataState.FirstName} ${userDataState.LastName}`}</h2>
            <p>{userDataState.AccountType}</p>
          </div>
        </div>
        {/* Bottom Nav */}
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
            <Link to={`${url}/reviews`}>Reviews</Link>
            <br />
          </ul>
        </div>
        {/* Content */}
        <div>
          {/* ********************** */}

          {/* Switch */}
          <Switch>
            {/* Feed */}
            <Route path={`${url}/feed`}>
              <ProfileFeedView />
            </Route>
            <Route path={`${url}/edit-feed`}>
              <ProfileFeedEdit />
            </Route>
            <Route path={`${url}/new-feed`}>
              <ProfileFeedCreate />
            </Route>
            {/* About */}
            <Route path={`${url}/about`}>
              <ProfileAboutView />
            </Route>
            <Route path={`${url}/edit-about`}>
              <ProfileAboutEdit />
            </Route>
            {/* Awards */}
            <Route path={`${url}/awards`}>
              <ProfileAwardsView />
            </Route>
            <Route path={`${url}/edit-awards`}>
              <ProfileAwardsEdit />
            </Route>
            {/* Gallery */}
            <Route path={`${url}/gallery`}>
              <ProfileGallery />
            </Route>
            {/* Reviews */}
            <Route path={`${url}/reviews`}>
              <ProfileReviewsView />
            </Route>
          </Switch>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
