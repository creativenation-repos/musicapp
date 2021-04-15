import React, { useEffect } from "react";

import TopBar from "./Teachers/Dash/TopBar";
import AnnouncementBox from "./Teachers/Dash/AnnouncementBox";
import SimpleStats from "./Teachers/Dash/SimpleStats";
import RecentActivity from "./Teachers/Dash/RecentActivity";
import RecentInvoices from "./Teachers/Dash/RecentInvoices";
import Earnings from "./Teachers/Dash/Earnings";
import Achievement from "./Teachers/Dash/Achievement";
import UpcomingEvents from "./Teachers/Dash/UpcomingEvents";

import DashFooter from "./Teachers/Dash/DashFooter";
import "./TeacherDash.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherAuthIDAction,
  storeTeacherForumsGeneralInfoAction,
  storeTeacherArticlesGeneralInfoAction,
  storeTeacherInvoicesGeneralInfoAction,
  storeTeacherSettingsGeneralInfoAction,
  storeTeacherStatisticsGeneralInfoAction,
  userDataAction,
  storeAccountTypeAction,
  isLoggedInAction,
} from "../redux/actions";

import {
  teachers_Collection,
  groups_Collection,
  forums_Collection,
  articles_Collection,
  users_Collection,
} from "../utils/firebase";
import { firebaseLooper } from "../utils/tools";

export default function TeacherDash() {
  const dispatch = useDispatch();
  const history = useHistory();

  dispatch(storeTeacherAuthIDAction("jssjmnzsnts"));
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const state = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );
  const today = Date.now();
  // All Data Needed

  // Student Collection
  const getAllUserData = () => {
    users_Collection
      .where("AuthID", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(userDataAction(data[0]));
      })
      .catch((err) => console.log(err));
  };
  const getAllStatisticData = () => {
    const statistics_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Statistics");
    statistics_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherStatisticsGeneralInfoAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getAllForumDiscussionData = () => {
    groups_Collection
      .get()
      .then((snapshot) => {
        const idArray = [];
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          idArray.push(d.id);
        });
        const forumData = [];
        idArray.forEach((groupID) => {
          forums_Collection
            .where("GroupID", "==", groupID)
            .get()
            .then((snapshot) => {
              const data = firebaseLooper(snapshot);
              if (data.length > 0) {
                forumData.push(data[0]);
              }
              dispatch(storeTeacherForumsGeneralInfoAction(forumData));
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllArticleData = () => {
    articles_Collection
      .where("Author", "==", teacherAuthID)
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherArticlesGeneralInfoAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getAllInvoiceData = () => {
    const invoices_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Invoices");
    invoices_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherInvoicesGeneralInfoAction(data));
      })
      .catch((err) => console.log(err));
  };
  const getAllSettingData = () => {
    const settings_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Settings");
    settings_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeTeacherSettingsGeneralInfoAction(data));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/login");
      return;
    }
    getAllUserData();
    getAllStatisticData();
    getAllForumDiscussionData();
    getAllArticleData();
    getAllInvoiceData();
    getAllSettingData();
  }, []);

  return (
    //   This entire component will have a background. The pieces inside will be another color, in chunks.
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Announcement Box */}
        <div>
          <AnnouncementBox />
        </div>

        {/* Simple Stats */}
        <div>
          <SimpleStats />
        </div>

        {/* Recent Student,Group,Forum Activity */}
        <div>
          <RecentActivity />
        </div>

        {/* Recent Invoices */}
        <div>
          <RecentInvoices />
        </div>

        {/* Earnings, Achievement, Upcoming Events*/}
        <div>
          {/* Earnings */}
          <div>
            <Earnings />
          </div>

          {/* Achievement */}
          <div>
            <Achievement />
          </div>

          {/* Upcoming Events */}
          <div>
            <UpcomingEvents />
          </div>
        </div>
      </div>

      {/* Footer */}
      <DashFooter />
    </div>
  );
}
