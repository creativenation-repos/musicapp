import { combineReducers } from "redux";

// Store Data
const courses = [
  {
    key: 1, // ****** Number gets higher as you make more ******
    img: "", // Leave these blank
    alt: "", // Leave these blank
    name: "Music Theory",
    desc: "Learn the fundamentals of Music Theory from Beginner, to Advanced (College Level).", // Description of the course. Like a sales pitch.
    price: "$19.99", // Just put random price
    keywords: [
      // These keywords are used for the search. Make sure they are one word at a time.
      "music",
      "theory",
      "key",
      "signature",
      "scales",
      "chords",
      "intervals",
    ],
    num: 0, // Leave this number at 0 for each object
  }, // Each object is enclosed in curly braces. To separate each, use a comma.
  {
    // Insert new course object here...
  },
];

// Reducers
export const menuReducer = (state = false, action) => {
  switch (action.type) {
    case "SHOWHIDE":
      return !state;
    default:
      return state;
  }
};

export const courseSearchReducer = (state = [], action) => {
  const filtered = [];
  const copy = [...courses];

  copy.forEach((c) => {
    c.num = 0;
  });

  switch (action.type) {
    case "SEARCH_COURSE_KEYWORDS":
      let keywords = action.payload.toLowerCase().split(" ");

      for (let i = 0; i < keywords.length; i = i + 1) {
        for (let a = 0; a < copy.length; a = a + 1) {
          copy[a].keywords.forEach((courseKey) => {
            if (keywords[i] === courseKey) {
              copy[a].num += 1;
            }
          });
        }
      }

      copy.sort((a, b) => (a.num > b.num ? 1 : -1));
      copy.reverse();
      copy.forEach((c) => {
        if (c.num > 0) {
          filtered.push(c);
        }
      });

      state = filtered;
      return state;

    default:
      return courses;
  }
};

export const trueFalseReducer = (state = true, action) => {
  switch (action.type) {
    case "TRUEFALSE":
      return !state;
    default:
      return state;
  }
};

export const loginRegisterSwitchReducer = (state = "login", action) => {
  switch (action.type) {
    case "LOGINSWITCH":
      console.log(action.payload);
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const isLoggedInReducer = (state = false, action) => {
  switch (action.type) {
    case "ISLOGGEDIN":
      return true;
    default:
      return state;
  }
};

export const dashFullMenuSwitchReducer = (state = true, action) => {
  switch (action.type) {
    case "FULLMENUSWITCH":
      return !state;
    default:
      return state;
  }
};

export const dashMenuTextSwitchReducer = (state = true, action) => {
  switch (action.type) {
    case "MENUTEXTSWITCH":
      return !state;
    default:
      return state;
  }
};

export const storeAccountTypeReducer = (state = "", action) => {
  switch (action.type) {
    case "storeAccountTypeAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAuthIDReducer = (state = "", action) => {
  switch (action.type) {
    case "TEACHERAUTH":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAuthIDReducer = (state = "", action) => {
  switch (action.type) {
    case "storeStudentAuthIDAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Teacher Stuffs *************************************************************************************************

export const userDataReducer = (state = [], action) => {
  switch (action.type) {
    case "USERDATA":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAssignmentsGeneralInfoReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "TEACHERASS":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherMilestonesGeneralInfoReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "TEACHERMILE":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherForumsGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERFORUM":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherArticlesGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERART":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherMessagesGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERMESS":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherEventsGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHEREVE":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherInvoicesGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERINV":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSettingsGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERSET":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherProfileGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERPRO":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherStatisticsGeneralInfoReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "TEACHERSTAT":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const statisticsObjectReducer = (state = {}, action) => {
  switch (action.type) {
    case "STATOBJ":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherNotificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherNotificationsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherNotificationsWindowReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleTeacherNotificationsWindowAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

// Profile Reducers
export const storeProfileFeedPostDataReducer = (state = [], action) => {
  switch (action.type) {
    case "storeProfileFeedPostDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeProfileFeedSinglePostDataReducer = (state = [], action) => {
  switch (action.type) {
    case "storeProfileFeedSinglePostDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeProfileAboutDataReducer = (state = [], action) => {
  switch (action.type) {
    case "storeProfileAboutDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeProfileExperienceDataReducer = (state = [], action) => {
  switch (action.type) {
    case "storeProfileExperienceDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewExperienceFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewExperienceFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleNewInstrumentFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewInstrumentFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeAwardListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeAwardListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeCertListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeCertListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewAwardFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewAwardFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleNewCertFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewCertFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeReviewListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeReviewListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherMeDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherMeDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAllReviewsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherAllReviewsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Student Reducers
export const storeTeacherStudentGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERSTUDENT":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleStudentAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentLessonsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleStudentLessonsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentExersReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleStudentExersAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentQuizzesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleStudentQuizzesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentAssReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleStudentAssAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleStudentMilestonesReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "storeTeacherSingleStudentMilestonesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherSingleStudentCompReducer = (
  state = "lessons",
  action
) => {
  switch (action.type) {
    case "toggleTeacherSingleStudentCompAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherExistingStudentsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherExistingStudentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherQueueRequestsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherQueueRequestsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherAddStudentFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleTeacherAddStudentFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAddStudentSearchResultReducer = (
  state = null,
  action
) => {
  switch (action.type) {
    case "storeTeacherAddStudentSearchResultAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Group Reducers

export const storeTeacherGroupGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERGROUP":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewGroupFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewGroupFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeSingleGroupReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleGroupAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeGroupFeedPostsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeGroupFeedPostsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleGroupFeedPostReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleGroupFeedPostAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeGroupMembersListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeGroupMembersListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const checkJoinedGroupStatusReducer = (state = false, action) => {
  switch (action.type) {
    case "checkJoinedGroupStatusAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const checkRequestedGroupStatusReducer = (state = false, action) => {
  switch (action.type) {
    case "checkRequestedGroupStatusAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Course Reducers
export const storeTeacherCourseGeneralInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "TEACHERCOURSE":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleCourseFullWizardComponentReducer = (
  state = "lesson",
  action
) => {
  switch (action.type) {
    case "toggleCourseFullWizardComponentAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeShortOptionsReducer = (state = ["Option 1"], action) => {
  switch (action.type) {
    case "storeShortOptionsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleExerciseTypeOptionReducer = (state = "textual", action) => {
  switch (action.type) {
    case "toggleExerciseTypeOptionAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeCourseIDFullWizardReducer = (state = "", action) => {
  switch (action.type) {
    case "storeCourseIDFullWizardAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeLessonNameFullWizardReducer = (state = "", action) => {
  switch (action.type) {
    case "storeLessonNameFullWizardAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeQuizComponentsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeQuizComponentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeExamQuizComponentsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeExamQuizComponentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleCourseAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseLessonsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeSingleCourseLessonsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseExersReducer = (state = [], action) => {
  switch (action.type) {
    case "storeSingleCourseExersAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseQuizzesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeSingleCourseQuizzesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleCourseTypeEditReducer = (state = "lessons", action) => {
  switch (action.type) {
    case "toggleCourseTypeEditAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewLessonFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewLessonFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleEditLessonFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleEditLessonFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeLessonCountReducer = (state = 0, action) => {
  switch (action.type) {
    case "storeLessonCountAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseLessonReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleCourseLessonAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleCourseExerReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleCourseExerAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherQuizComponentsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherQuizComponentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAllCoursesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherAllCoursesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseLessonsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseLessonsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseQuizzesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseQuizzesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherSingleCourseLessonsListReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleTeacherSingleCourseLessonsListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherSingleCourseQuizzesListReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleTeacherSingleCourseQuizzesListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseLessonReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseLessonAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseQuizReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseQuizAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseQuizComponentsReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "storeTeacherSingleCourseQuizComponentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseLessonCountReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "storeTeacherSingleCourseLessonCountAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseQuizCountReducer = (state = 0, action) => {
  switch (action.type) {
    case "storeTeacherSingleCourseQuizCountAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseAssignedStudsReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "storeTeacherSingleCourseAssignedStudsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherSingleCourseAssigneesReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "storeTeacherSingleCourseAssigneesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Connections
export const storeTeacherAllConnectionsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherAllConnectionsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeAllSearchUsersReducer = (state = [], action) => {
  switch (action.type) {
    case "storeAllSearchUsersAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeAllConnReqsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeAllConnReqsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Assignment Reducers
export const storeTeacherSingleAssignmentReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleAssignmentAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleAssigneeFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleAssigneeFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeTeacherNewAssignmentTypeReducer = (state = "", action) => {
  switch (action.type) {
    case "storeTeacherNewAssignmentTypeAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeTeacherAssignmentAssigneesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherAssignmentAssigneesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Messages Reducers
export const storeTeacherSingleThreadReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleThreadAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleTeacherNewMessageReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleTeacherNewMessageAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeCurrentMonthReducer = (state = "", action) => {
  switch (action.type) {
    case "STORECURRMONTH":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleForumReducer = (state = {}, action) => {
  switch (action.type) {
    case "STORESINGFORUM":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleInvoiceReducer = (state = {}, action) => {
  switch (action.type) {
    case "STORESINGINV":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeInvoiceServicesReducer = (state = [], action) => {
  switch (action.type) {
    case "STOREINVSERV":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Events Reducers
export const storeTodayArrayReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTodayArrayAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeMonthEventsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeMonthEventsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeSingleMonthEventReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeSingleMonthEventAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleAddEventInviteeReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleAddEventInviteeAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

// Milestones Reducers
export const storeTeacherSingleMilestoneSegReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeTeacherSingleMilestoneSegAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewTaskFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewTaskFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleNewSegmentFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewSegmentFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeTeacherMilestonesAssigneesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeTeacherMilestonesAssigneesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Student Stuffs ********************************************************************************************************
export const storeStudentUserDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentUserDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentTeachersListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentTeachersListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentNotificationsWindowReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleStudentNotificationsWindowAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentNotificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentNotificationsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Profile
export const storeStudentProfileFeedPostsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentProfileFeedPostsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentProfileFeedPostReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentProfileFeedPostAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAboutReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentAboutAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentExpReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentExpAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleNewExpFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleNewExpFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleStudentNewInstrumentFormReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleStudentNewInstrumentFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentAwardsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAwardsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentCertsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCertsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentNewAwardFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentNewAwardFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleStudentNewCertFormReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentNewCertFormAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentMeDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentMeDataAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleReviewAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Courses
export const flagStudentTeacherConnectionReducer = (state = false, action) => {
  switch (action.type) {
    case "flagStudentTeacherConnectionAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentTeacherListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentTeacherListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentCoursesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCoursesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleCourseAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentCourseLessonListReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentCourseLessonListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentCourseLessonListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCourseLessonListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentCourseExerListReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentCourseExerListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentCourseExerListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCourseExerListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentCourseQuizListReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentCourseQuizListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentCourseQuizListReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCourseQuizListAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeCurrentCourseComponentReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeCurrentCourseComponentAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentLessonQuestionResultReducer = (state = "", action) => {
  switch (action.type) {
    case "storeStudentLessonQuestionResultAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentNextExerciseReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentNextExerciseAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentNextQuizReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentNextQuizAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentQuizResultsReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentQuizResultsAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentQuizResultsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentQuizResultsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentNextLessonReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentNextLessonAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAllCoursesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAllCoursesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentCourseProgressReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentCourseProgressAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseLessonsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentSingleCourseLessonsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseQuizzesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentSingleCourseQuizzesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseOrderNumReducer = (state = 0, action) => {
  switch (action.type) {
    case "storeStudentSingleCourseOrderNumAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentUpNextReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentUpNextAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentSingleCourseLessonsListReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleStudentSingleCourseLessonsListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const toggleStudentSingleCourseQuizzesListReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "toggleStudentSingleCourseQuizzesListAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseLessonReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleCourseLessonAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentTimeReducer = (state = 0, action) => {
  switch (action.type) {
    case "storeStudentTimeAction":
      state = state + 1;
      if (action.payload) {
        state = action.payload;
      }
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseQuizReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleCourseQuizAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleCourseQuizComponentsReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "storeStudentSingleCourseQuizComponentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentQuizFinalResultsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentQuizFinalResultsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Connections
export const storeStudentAllConnectionsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAllConnectionsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAllSearchUsersReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAllSearchUsersAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAllConnReqsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAllConnReqsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Assignments
export const storeStudentAssignmentsReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAssignmentsAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAssignmentsInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentAssignmentsInfoAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleAssignmentReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleAssignmentAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentAssignmentPracticeRatingReducer = (
  state = "",
  action
) => {
  switch (action.type) {
    case "storeStudentAssignmentPracticeRatingAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

// Messages
export const storeStudentMessagesReducer = (state = [], action) => {
  switch (action.type) {
    case "storeStudentMessagesAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const storeStudentSingleThreadReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeStudentSingleThreadAction":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export const toggleStudentNewMessageReducer = (state = false, action) => {
  switch (action.type) {
    case "toggleStudentNewMessageAction":
      state = !state;
      return state;
    default:
      return state;
  }
};

// All Reducers
export const allReducers = combineReducers({
  menuReducer,
  courseSearchReducer,
  trueFalseReducer,
  loginRegisterSwitchReducer,
  isLoggedInReducer,
  dashFullMenuSwitchReducer,
  dashMenuTextSwitchReducer,
  storeAccountTypeReducer,
  storeTeacherAuthIDReducer,
  storeStudentAuthIDReducer,
  // Teacher Reducers
  storeTeacherStudentGeneralInfoReducer,
  storeTeacherGroupGeneralInfoReducer,
  storeTeacherAssignmentsGeneralInfoReducer,
  storeTeacherMilestonesGeneralInfoReducer,
  storeTeacherForumsGeneralInfoReducer,
  storeTeacherArticlesGeneralInfoReducer,
  storeTeacherMessagesGeneralInfoReducer,
  storeTeacherEventsGeneralInfoReducer,
  storeTeacherInvoicesGeneralInfoReducer,
  storeTeacherSettingsGeneralInfoReducer,
  storeTeacherProfileGeneralInfoReducer,
  storeTeacherStatisticsGeneralInfoReducer,
  statisticsObjectReducer,
  userDataReducer,
  storeCurrentMonthReducer,
  storeSingleForumReducer,
  storeSingleInvoiceReducer,
  storeInvoiceServicesReducer,
  storeProfileFeedPostDataReducer,
  storeProfileFeedSinglePostDataReducer,
  storeProfileAboutDataReducer,
  storeProfileExperienceDataReducer,
  toggleNewExperienceFormReducer,
  toggleNewInstrumentFormReducer,
  storeAwardListReducer,
  storeCertListReducer,
  toggleNewAwardFormReducer,
  toggleNewCertFormReducer,
  storeReviewListReducer,
  toggleNewGroupFormReducer,
  storeSingleGroupReducer,
  storeGroupFeedPostsReducer,
  storeSingleGroupFeedPostReducer,
  storeGroupMembersListReducer,
  checkJoinedGroupStatusReducer,
  checkRequestedGroupStatusReducer,
  toggleCourseFullWizardComponentReducer,
  storeShortOptionsReducer,
  toggleExerciseTypeOptionReducer,
  storeCourseIDFullWizardReducer,
  storeLessonNameFullWizardReducer,
  storeQuizComponentsReducer,
  storeExamQuizComponentsReducer,
  storeSingleCourseReducer,
  storeSingleCourseLessonsReducer,
  storeSingleCourseExersReducer,
  storeSingleCourseQuizzesReducer,
  toggleCourseTypeEditReducer,
  toggleNewLessonFormReducer,
  storeLessonCountReducer,
  toggleEditLessonFormReducer,
  storeSingleCourseLessonReducer,
  storeSingleCourseExerReducer,
  storeTeacherSingleAssignmentReducer,
  toggleAssigneeFormReducer,
  storeTeacherNewAssignmentTypeReducer,
  storeTeacherAssignmentAssigneesReducer,
  storeTeacherSingleThreadReducer,
  toggleTeacherNewMessageReducer,
  storeTodayArrayReducer,
  storeMonthEventsReducer,
  storeSingleMonthEventReducer,
  toggleAddEventInviteeReducer,
  storeTeacherSingleMilestoneSegReducer,
  toggleNewTaskFormReducer,
  toggleNewSegmentFormReducer,
  storeTeacherSingleStudentReducer,
  storeTeacherSingleStudentLessonsReducer,
  storeTeacherSingleStudentExersReducer,
  storeTeacherSingleStudentQuizzesReducer,
  storeTeacherSingleStudentAssReducer,
  storeTeacherSingleStudentMilestonesReducer,
  toggleTeacherSingleStudentCompReducer,
  storeTeacherMilestonesAssigneesReducer,
  storeTeacherExistingStudentsReducer,
  storeTeacherQueueRequestsReducer,
  toggleTeacherAddStudentFormReducer,
  storeTeacherAddStudentSearchResultReducer,
  storeTeacherNotificationsReducer,
  toggleTeacherNotificationsWindowReducer,
  storeTeacherQuizComponentsReducer,
  storeTeacherAllCoursesReducer,
  storeTeacherSingleCourseReducer,
  storeTeacherSingleCourseLessonsReducer,
  storeTeacherSingleCourseQuizzesReducer,
  toggleTeacherSingleCourseLessonsListReducer,
  toggleTeacherSingleCourseQuizzesListReducer,
  storeTeacherSingleCourseLessonReducer,
  storeTeacherSingleCourseQuizReducer,
  storeTeacherSingleCourseQuizComponentsReducer,
  storeTeacherSingleCourseLessonCountReducer,
  storeTeacherSingleCourseQuizCountReducer,
  storeTeacherSingleCourseAssignedStudsReducer,
  storeTeacherSingleCourseAssigneesReducer,
  storeTeacherAllConnectionsReducer,
  storeAllSearchUsersReducer,
  storeAllConnReqsReducer,
  storeTeacherMeDataReducer,
  storeTeacherAllReviewsReducer,

  // Student Reducers
  storeStudentUserDataReducer,
  storeStudentTeachersListReducer,
  toggleStudentNotificationsWindowReducer,
  storeStudentNotificationsReducer,
  // Profile
  storeStudentProfileFeedPostsReducer,
  storeStudentProfileFeedPostReducer,
  storeStudentAboutReducer,
  storeStudentExpReducer,
  toggleNewExpFormReducer,
  toggleStudentNewInstrumentFormReducer,
  storeStudentAwardsReducer,
  storeStudentCertsReducer,
  toggleStudentNewAwardFormReducer,
  toggleStudentNewCertFormReducer,
  storeStudentMeDataReducer,
  storeStudentSingleReviewReducer,
  // Courses
  flagStudentTeacherConnectionReducer,
  storeStudentTeacherListReducer,
  storeStudentCoursesReducer,
  storeStudentSingleCourseReducer,
  toggleStudentCourseLessonListReducer,
  storeStudentCourseLessonListReducer,
  toggleStudentCourseExerListReducer,
  storeStudentCourseExerListReducer,
  toggleStudentCourseQuizListReducer,
  storeStudentCourseQuizListReducer,
  storeCurrentCourseComponentReducer,
  storeStudentLessonQuestionResultReducer,
  storeStudentNextExerciseReducer,
  storeStudentNextQuizReducer,
  toggleStudentQuizResultsReducer,
  storeStudentQuizResultsReducer,
  storeStudentNextLessonReducer,
  storeStudentAllCoursesReducer,
  storeStudentCourseProgressReducer,
  storeStudentSingleCourseLessonsReducer,
  storeStudentSingleCourseQuizzesReducer,
  storeStudentSingleCourseOrderNumReducer,
  storeStudentUpNextReducer,
  toggleStudentSingleCourseLessonsListReducer,
  toggleStudentSingleCourseQuizzesListReducer,
  storeStudentSingleCourseLessonReducer,
  storeStudentTimeReducer,
  storeStudentSingleCourseQuizReducer,
  storeStudentSingleCourseQuizComponentsReducer,
  storeStudentQuizFinalResultsReducer,
  // Connections
  storeStudentAllConnectionsReducer,
  storeStudentAllSearchUsersReducer,
  storeStudentAllConnReqsReducer,
  // Assignments
  storeStudentAssignmentsReducer,
  storeStudentAssignmentsInfoReducer,
  storeStudentSingleAssignmentReducer,
  storeStudentAssignmentPracticeRatingReducer,
  // Messages
  storeStudentMessagesReducer,
  storeStudentSingleThreadReducer,
  toggleStudentNewMessageReducer,
});
