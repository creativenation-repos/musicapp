export const menuAction = () => {
  return {
    type: "SHOWHIDE",
  };
};

export const searchCourseAction = (payload) => {
  return {
    type: "SEARCH_COURSE_KEYWORDS",
    payload: payload,
  };
};

export const trueFalseAction = () => {
  return {
    type: "TRUEFALSE",
  };
};

export const loginRegisterToggleAction = (payload) => {
  return {
    type: "LOGINSWITCH",
    payload: payload,
  };
};

export const isLoggedInAction = () => {
  return {
    type: "ISLOGGEDIN",
  };
};

export const dashFullMenuAction = () => {
  return {
    type: "FULLMENUSWITCH",
  };
};

export const dashMenuTextAction = () => {
  return {
    type: "MENUTEXTSWITCH",
  };
};

export const storeAccountTypeAction = (payload) => {
  return {
    type: "storeAccountTypeAction",
    payload: payload,
  };
};

export const storeTeacherAuthIDAction = (payload) => {
  return {
    type: "TEACHERAUTH",
    payload: payload,
  };
};

export const storeStudentAuthIDAction = (payload) => {
  return {
    type: "storeStudentAuthIDAction",
    payload: payload,
  };
};

// Teacher Stuffs *****************************************************************************************

export const userDataAction = (payload) => {
  return {
    type: "USERDATA",
    payload: payload,
  };
};

export const storeTeacherAssignmentsGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERASS",
    payload: payload,
  };
};

export const storeTeacherMilestonesGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERMILE",
    payload: payload,
  };
};

export const storeTeacherForumsGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERFORUM",
    payload: payload,
  };
};

export const storeTeacherArticlesGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERART",
    payload: payload,
  };
};

export const storeTeacherMessagesGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERMESS",
    payload: payload,
  };
};

export const storeTeacherEventsGeneralInfoAction = (payload) => {
  return {
    type: "TEACHEREVE",
    payload: payload,
  };
};

export const storeTeacherInvoicesGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERINV",
    payload: payload,
  };
};

export const storeTeacherSettingsGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERSET",
    payload: payload,
  };
};

export const storeTeacherProfileGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERPRO",
    payload: payload,
  };
};

export const storeTeacherStatisticsGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERSTAT",
    payload: payload,
  };
};

export const statisticsObjectAction = (payload) => {
  return {
    type: "STATOBJ",
    payload: payload,
  };
};

// Profile Actions
export const storeProfileFeedPostDataAction = (payload) => {
  return {
    type: "storeProfileFeedPostDataAction",
    payload: payload,
  };
};

export const storeProfileFeedSinglePostDataAction = (payload) => {
  return {
    type: "storeProfileFeedSinglePostDataAction",
    payload: payload,
  };
};

export const storeProfileAboutDataAction = (payload) => {
  return {
    type: "storeProfileAboutDataAction",
    payload: payload,
  };
};

export const storeProfileExperienceDataAction = (payload) => {
  return {
    type: "storeProfileExperienceDataAction",
    payload: payload,
  };
};

export const toggleNewExperienceFormAction = () => {
  return {
    type: "toggleNewExperienceFormAction",
  };
};

export const toggleNewInstrumentFormAction = () => {
  return {
    type: "toggleNewInstrumentFormAction",
  };
};

export const storeAwardListAction = (payload) => {
  return {
    type: "storeAwardListAction",
    payload: payload,
  };
};

export const storeCertListAction = (payload) => {
  return {
    type: "storeCertListAction",
    payload: payload,
  };
};

export const toggleNewAwardFormAction = () => {
  return {
    type: "toggleNewAwardFormAction",
  };
};

export const toggleNewCertFormAction = () => {
  return {
    type: "toggleNewCertFormAction",
  };
};

export const storeReviewListAction = (payload) => {
  return {
    type: "storeReviewListAction",
    payload: payload,
  };
};

// Student Actions
export const storeTeacherStudentGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERSTUDENT",
    payload: payload,
  };
};

export const toggleStudentOverviewAction = () => {
  return {
    type: "toggleStudentOverviewAction",
  };
};

export const toggleSearchUsernameAction = () => {
  return {
    type: "toggleSearchUsernameAction",
  };
};

export const toggleSendRequestButtonAction = () => {
  return {
    type: "toggleSendRequestButtonAction",
  };
};

export const storeNewStudentAction = (payload) => {
  return {
    type: "storeNewStudentAction",
    payload: payload,
  };
};

export const storeSingleStudentInfoAction = (payload) => {
  return {
    type: "storeSingleStudentInfoAction",
    payload: payload,
  };
};

export const storeTeacherStudentLessonsAction = (payload) => {
  return {
    type: "storeTeacherStudentLessonsAction",
    payload: payload,
  };
};

export const storeTeacherStudentExercisesAction = (payload) => {
  return {
    type: "storeTeacherStudentExercisesAction",
    payload: payload,
  };
};

export const storeTeacherStudentQuizzesAction = (payload) => {
  return {
    type: "storeTeacherStudentQuizzesAction",
    payload: payload,
  };
};

export const storeTeacherStudentExamsAction = (payload) => {
  return {
    type: "storeTeacherStudentExamsAction",
    payload: payload,
  };
};

// Group Actions

export const storeTeacherGroupGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERGROUP",
    payload: payload,
  };
};

export const toggleNewGroupFormAction = () => {
  return {
    type: "toggleNewGroupFormAction",
  };
};

export const storeSingleGroupAction = (payload) => {
  return {
    type: "storeSingleGroupAction",
    payload: payload,
  };
};

export const storeGroupFeedPostsAction = (payload) => {
  return {
    type: "storeGroupFeedPostsAction",
    payload: payload,
  };
};

export const storeSingleGroupFeedPostAction = (payload) => {
  return {
    type: "storeSingleGroupFeedPostAction",
    payload: payload,
  };
};

export const storeGroupMembersListAction = (payload) => {
  return {
    type: "storeGroupMembersListAction",
    payload: payload,
  };
};

export const checkJoinedGroupStatusAction = (payload) => {
  return {
    type: "checkJoinedGroupStatusAction",
    payload: payload,
  };
};

export const checkRequestedGroupStatusAction = (payload) => {
  return {
    type: "checkRequestedGroupStatusAction",
    payload: payload,
  };
};

// Courses Actions
export const storeTeacherCourseGeneralInfoAction = (payload) => {
  return {
    type: "TEACHERCOURSE",
    payload: payload,
  };
};

export const toggleCourseFullWizardComponentAction = (payload) => {
  return {
    type: "toggleCourseFullWizardComponentAction",
    payload: payload,
  };
};

export const storeShortOptionsAction = (payload) => {
  return {
    type: "storeShortOptionsAction",
    payload: payload,
  };
};

export const toggleExerciseTypeOptionAction = (payload) => {
  return {
    type: "toggleExerciseTypeOptionAction",
    payload: payload,
  };
};

export const storeCourseIDFullWizardAction = (payload) => {
  return {
    type: "storeCourseIDFullWizardAction",
    payload: payload,
  };
};

export const storeLessonNameFullWizardAction = (payload) => {
  return {
    type: "storeLessonNameFullWizardAction",
    payload: payload,
  };
};

export const storeQuizComponentsAction = (payload) => {
  return {
    type: "storeQuizComponentsAction",
    payload: payload,
  };
};

export const storeExamQuizComponentsAction = (payload) => {
  return {
    type: "storeExamQuizComponentsAction",
    payload: payload,
  };
};

export const storeSingleCourseAction = (payload) => {
  return {
    type: "storeSingleCourseAction",
    payload: payload,
  };
};

export const storeSingleCourseLessonsAction = (payload) => {
  return {
    type: "storeSingleCourseLessonsAction",
    payload: payload,
  };
};

export const storeSingleCourseExersAction = (payload) => {
  return {
    type: "storeSingleCourseExersAction",
    payload: payload,
  };
};

export const storeSingleCourseQuizzesAction = (payload) => {
  return {
    type: "storeSingleCourseQuizzesAction",
    payload: payload,
  };
};

export const toggleCourseTypeEditAction = (payload) => {
  return {
    type: "toggleCourseTypeEditAction",
    payload: payload,
  };
};

export const toggleNewLessonFormAction = () => {
  return {
    type: "toggleNewLessonFormAction",
  };
};

export const toggleEditLessonFormAction = () => {
  return {
    type: "toggleEditLessonFormAction",
  };
};

export const storeLessonCountAction = (payload) => {
  return {
    type: "storeLessonCountAction",
    payload: payload,
  };
};

export const storeSingleCourseLessonAction = (payload) => {
  return {
    type: "storeSingleCourseLessonAction",
    payload: payload,
  };
};

export const storeSingleCourseExerAction = (payload) => {
  return {
    type: "storeSingleCourseExerAction",
    payload: payload,
  };
};

// Assignments
export const storeTeacherSingleAssignmentAction = (payload) => {
  return {
    type: "storeTeacherSingleAssignmentAction",
    payload: payload,
  };
};

// Messages Actions
export const storeTeacherMessagesAction = (payload) => {
  return {
    type: "STORETEACHMESS",
    payload: payload,
  };
};

export const storeSingleThreadAction = (payload) => {
  return {
    type: "STORESINGLETHREAD",
    payload: payload,
  };
};

export const storeCurrentMonthAction = (payload) => {
  return {
    type: "STORECURRMONTH",
    payload: payload,
  };
};

export const storeSingleForumAction = (payload) => {
  return {
    type: "STORESINGFORUM",
    payload: payload,
  };
};

export const storeSingleInvoiceAction = (payload) => {
  return {
    type: "STORESINGINV",
    payload: payload,
  };
};

export const storeInvoiceServicesAction = (payload) => {
  return {
    type: "STOREINVSERV",
    payload: payload,
  };
};

// Student Stuffs ******************************************************************************************

export const storeStudentUserDataAction = (payload) => {
  return {
    type: "storeStudentUserDataAction",
    payload: payload,
  };
};

// Profile
export const storeStudentProfileFeedPostsAction = (payload) => {
  return {
    type: "storeStudentProfileFeedPostsAction",
    payload: payload,
  };
};

export const storeStudentProfileFeedPostAction = (payload) => {
  return {
    type: "storeStudentProfileFeedPostAction",
    payload: payload,
  };
};

export const storeStudentAboutAction = (payload) => {
  return {
    type: "storeStudentAboutAction",
    payload: payload,
  };
};

export const storeStudentExpAction = (payload) => {
  return {
    type: "storeStudentExpAction",
    payload: payload,
  };
};

export const toggleNewExpFormAction = () => {
  return {
    type: "toggleNewExpFormAction",
  };
};

export const toggleStudentNewInstrumentFormAction = () => {
  return {
    type: "toggleStudentNewInstrumentFormAction",
  };
};

export const storeStudentAwardsAction = (payload) => {
  return {
    type: "storeStudentAwardsAction",
    payload: payload,
  };
};

export const storeStudentCertsAction = (payload) => {
  return {
    type: "storeStudentCertsAction",
    payload: payload,
  };
};

export const toggleStudentNewAwardFormAction = () => {
  return {
    type: "toggleStudentNewAwardFormAction",
  };
};

export const toggleStudentNewCertFormAction = () => {
  return {
    type: "toggleStudentNewCertFormAction",
  };
};

// Courses
export const flagStudentTeacherConnectionAction = (payload) => {
  return {
    type: "flagStudentTeacherConnectionAction",
    payload: payload,
  };
};

export const storeStudentTeacherListAction = (payload) => {
  return {
    type: "storeStudentTeacherListAction",
    payload: payload,
  };
};

export const storeStudentCoursesAction = (payload) => {
  return {
    type: "storeStudentCoursesAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseAction = (payload) => {
  return {
    type: "storeStudentSingleCourseAction",
    payload: payload,
  };
};

export const toggleStudentCourseLessonListAction = () => {
  return {
    type: "toggleStudentCourseLessonListAction",
  };
};

export const storeStudentCourseLessonListAction = (payload) => {
  return {
    type: "storeStudentCourseLessonListAction",
    payload: payload,
  };
};

export const toggleStudentCourseExerListAction = () => {
  return {
    type: "toggleStudentCourseExerListAction",
  };
};

export const storeStudentCourseExerListAction = (payload) => {
  return {
    type: "storeStudentCourseExerListAction",
    payload: payload,
  };
};

export const toggleStudentCourseQuizListAction = () => {
  return {
    type: "toggleStudentCourseQuizListAction",
  };
};

export const storeStudentCourseQuizListAction = (payload) => {
  return {
    type: "storeStudentCourseQuizListAction",
    payload: payload,
  };
};

export const storeCurrentCourseComponentAction = (payload) => {
  return {
    type: "storeCurrentCourseComponentAction",
    payload: payload,
  };
};

export const storeStudentLessonQuestionResultAction = (payload) => {
  return {
    type: "storeStudentLessonQuestionResultAction",
    payload: payload,
  };
};

export const storeStudentNextExerciseAction = (payload) => {
  return {
    type: "storeStudentNextExerciseAction",
    payload: payload,
  };
};

export const storeStudentNextQuizAction = (payload) => {
  return {
    type: "storeStudentNextQuizAction",
    payload: payload,
  };
};

export const toggleStudentQuizResultsAction = () => {
  return {
    type: "toggleStudentQuizResultsAction",
  };
};

export const storeStudentQuizResultsAction = (payload) => {
  return {
    type: "storeStudentQuizResultsAction",
    payload: payload,
  };
};

export const storeStudentNextLessonAction = (payload) => {
  return {
    type: "storeStudentNextLessonAction",
    payload: payload,
  };
};
