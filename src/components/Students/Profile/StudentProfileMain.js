import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import TopBar from "../TopBar";
import Footer from "../Footer";
import StudentProfileFeedCreate from "./StudentProfileFeedCreate";
import StudentProfileFeedView from "./StudentProfileFeedView";
import StudentProfileFeedEdit from "./StudentProfileFeedEdit";
import StudentProfileAboutView from "./StudentProfileAboutView";
import StudentProfileAboutEdit from "./StudentProfileAboutEdit";
import StudentProfileAwardsView from "./StudentProfileAwardsView";
import StudentProfileAwardsEdit from "./StudentProfileAwardsEdit";
import StudentProfileReviewsView from "./StudentProfileReviewsView";
import StudentProfileReviewsEdit from "./StudentProfileReviewsEdit";
import StudentProfileReviewsCreate from "./StudentProfileReviewsCreate";

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
  }, [user]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Cover Section */}
      <div className="content">
        <div className="profile-cover">
          <div className="text-cover">
            <h2>{`${user.FirstName} ${user.LastName}`}</h2>
            <p>{user.AccountType}</p>
          </div>
        </div>

        {/* Profile Options */}

        {/* Bottom Nav */}
        <div className="profile-nav">
          <ul style={{ display: "flex" }}>
            <li>
              <Link className="profile-Link" id="link-feed" to={`${url}/feed`}>
                Feed
              </Link>
            </li>
            <br />
            <li>
              <Link
                className="profile-Link"
                id="link-about"
                to={`${url}/about`}
              >
                About
              </Link>
            </li>
            <br />
            <li>
              <Link
                className="profile-Link"
                id="link-awards"
                to={`${url}/awards`}
              >
                Awards
              </Link>
            </li>
            <br />
            <li>
              <Link
                className="profile-Link"
                id="link-gallery"
                to={`${url}/gallery`}
              >
                Gallery
              </Link>
            </li>
            <br />
            {user.AccountType === "Teacher" ? (
              <li>
                <Link
                  className="profile-Link"
                  id="link-reviews"
                  to={`${url}/reviews`}
                >
                  Reviews
                </Link>
              </li>
            ) : null}
            <br />
          </ul>
        </div>

        <div>
          {/* ********************** */}

          {/* Switch */}
          <Switch>
            {/* Feed */}
            <Route path={`${url}/feed`}>
              <StudentProfileFeedView />
            </Route>
            <Route path={`${url}/feed-edit`}>
              <StudentProfileFeedEdit />
            </Route>
            <Route path={`${url}/feed-create`}>
              <StudentProfileFeedCreate />
            </Route>

            {/* About */}
            <Route path={`${url}/about`}>
              <StudentProfileAboutView />
            </Route>
            <Route path={`${url}/about-edit`}>
              <StudentProfileAboutEdit />
            </Route>

            {/* Awards */}
            <Route path={`${url}/awards`}>
              <StudentProfileAwardsView />
            </Route>
            <Route path={`${url}/awards-edit`}>
              <StudentProfileAwardsEdit />
            </Route>

            {/* Reviews */}
            <Route path={`${url}/reviews`}>
              <StudentProfileReviewsView />
            </Route>
            <Route path={`${url}/reviews-edit`}>
              <StudentProfileReviewsEdit />
            </Route>
            <Route path={`${url}/reviews-create`}>
              <StudentProfileReviewsCreate />
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
