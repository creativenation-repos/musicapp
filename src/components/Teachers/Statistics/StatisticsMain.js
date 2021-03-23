import React from "react";

import TopBar from "../Dash/TopBar";
import StorageStats from "./StorageStats";
import StudentStats from "./StudentStats";
import GroupStats from "./GroupStats";
import CourseStats from "./CourseStats";
import ForumStats from "./ForumStats";
import EventStats from "./EventStats";
import DashFooter from "../Dash/DashFooter";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

export default function StatisticsMain() {
  let { url } = useRouteMatch();
  return (
    <Router>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>
      <div>
        <div>
          <Link to={`${url}/storage`}>Storage</Link>
          <br />
          <Link to={`${url}/student`}>Student</Link>
          <br />
          <Link to={`${url}/group`}>Group</Link>
          <br />
          <Link to={`${url}/course`}>Course</Link>
          <br />
          <Link to={`${url}/forum`}>Forum</Link>
          <br />
          <Link to={`${url}/event`}>Event</Link>
          <br />
        </div>

        <div>
          <Switch>
            <Route path={`${url}/storage`}>
              <StorageStats />
            </Route>
            <Route path={`${url}/student`}>
              <StudentStats />
            </Route>
            <Route path={`${url}/group`}>
              <GroupStats />
            </Route>
            <Route path={`${url}/course`}>
              <CourseStats />
            </Route>
            <Route path={`${url}/forum`}>
              <ForumStats />
            </Route>
            <Route path={`${url}/event`}>
              <EventStats />
            </Route>
          </Switch>
        </div>
      </div>
      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </Router>
  );
}
