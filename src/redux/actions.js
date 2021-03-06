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

export const storeTeacherNotificationsAction = (payload) => {
  return {
    type: "storeTeacherNotificationsAction",
    payload: payload,
  };
};

export const toggleTeacherNotificationsWindowAction = (payload) => {
  return {
    type: "toggleTeacherNotificationsWindowAction",
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

export const storeTeacherMeDataAction = (payload) => {
  return {
    type: "storeTeacherMeDataAction",
    payload: payload,
  };
};

export const storeTeacherAllReviewsAction = (payload) => {
  return {
    type: "storeTeacherAllReviewsAction",
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

export const storeTeacherSingleStudentAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentAction",
    payload: payload,
  };
};

export const storeTeacherSingleStudentLessonsAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentLessonsAction",
    payload: payload,
  };
};

export const storeTeacherSingleStudentExersAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentExersAction",
    payload: payload,
  };
};

export const storeTeacherSingleStudentQuizzesAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentQuizzesAction",
    payload: payload,
  };
};

export const storeTeacherSingleStudentAssAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentAssAction",
    payload: payload,
  };
};

export const storeTeacherSingleStudentMilestonesAction = (payload) => {
  return {
    type: "storeTeacherSingleStudentMilestonesAction",
    payload: payload,
  };
};

export const toggleTeacherSingleStudentCompAction = (payload) => {
  return {
    type: "toggleTeacherSingleStudentCompAction",
    payload: payload,
  };
};

export const storeTeacherExistingStudentsAction = (payload) => {
  return {
    type: "storeTeacherExistingStudentsAction",
    payload: payload,
  };
};

export const storeTeacherQueueRequestsAction = (payload) => {
  return {
    type: "storeTeacherQueueRequestsAction",
    payload: payload,
  };
};

export const toggleTeacherAddStudentFormAction = () => {
  return {
    type: "toggleTeacherAddStudentFormAction",
  };
};

export const storeTeacherAddStudentSearchResultAction = (payload) => {
  return {
    type: "storeTeacherAddStudentSearchResultAction",
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

export const storeTeacherSingleCourseAssignedStudsAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseAssignedStudsAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseAssigneesAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseAssigneesAction",
    payload: payload,
  };
};

export const storeTeacherQuizComponentsAction = (payload) => {
  return {
    type: "storeTeacherQuizComponentsAction",
    payload: payload,
  };
};

export const storeTeacherAllCoursesAction = (payload) => {
  return {
    type: "storeTeacherAllCoursesAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseLessonsAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseLessonsAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseQuizzesAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseQuizzesAction",
    payload: payload,
  };
};

export const toggleTeacherSingleCourseLessonsListAction = () => {
  return {
    type: "toggleTeacherSingleCourseLessonsListAction",
  };
};

export const toggleTeacherSingleCourseQuizzesListAction = () => {
  return {
    type: "toggleTeacherSingleCourseQuizzesListAction",
  };
};

export const storeTeacherSingleCourseLessonAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseLessonAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseQuizAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseQuizAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseQuizComponentsAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseQuizComponentsAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseLessonCountAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseLessonCountAction",
    payload: payload,
  };
};

export const storeTeacherSingleCourseQuizCountAction = (payload) => {
  return {
    type: "storeTeacherSingleCourseQuizCountAction",
    payload: payload,
  };
};

// Connections
export const storeTeacherAllConnectionsAction = (payload) => {
  return {
    type: "storeTeacherAllConnectionsAction",
    payload: payload,
  };
};

export const storeAllSearchUsersAction = (payload) => {
  return {
    type: "storeAllSearchUsersAction",
    payload: payload,
  };
};

export const storeAllConnReqsAction = (payload) => {
  return {
    type: "storeAllConnReqsAction",
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

export const toggleAssigneeFormAction = () => {
  return {
    type: "toggleAssigneeFormAction",
  };
};

export const storeTeacherNewAssignmentTypeAction = (payload) => {
  return {
    type: "storeTeacherNewAssignmentTypeAction",
    payload: payload,
  };
};

export const storeTeacherAssignmentAssigneesAction = (payload) => {
  return {
    type: "storeTeacherAssignmentAssigneesAction",
    payload: payload,
  };
};

// Messages Actions
export const storeTeacherSingleThreadAction = (payload) => {
  return {
    type: "storeTeacherSingleThreadAction",
    payload: payload,
  };
};

export const toggleTeacherNewMessageAction = (payload) => {
  return {
    type: "toggleTeacherNewMessageAction",
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

export const storeTeacherMessageConnectionsAction = (payload) => {
  return {
    type: "storeTeacherMessageConnectionsAction",
    payload: payload,
  };
};

export const storeTeacherMessageThreadAction = (payload) => {
  return {
    type: "storeTeacherMessageThreadAction",
    payload: payload,
  };
};

export const storeTeacherMessageConnectionAction = (payload) => {
  return {
    type: "storeTeacherMessageConnectionAction",
    payload: payload,
  };
};

export const storeTeacherMessageRecipientAction = (payload) => {
  return {
    type: "storeTeacherMessageRecipientAction",
    payload: payload,
  };
};

// Events Actions
export const storeTodayArrayAction = (payload) => {
  return {
    type: "storeTodayArrayAction",
    payload: payload,
  };
};

export const storeMonthEventsAction = (payload) => {
  return {
    type: "storeMonthEventsAction",
    payload: payload,
  };
};

export const storeSingleMonthEventAction = (payload) => {
  return {
    type: "storeSingleMonthEventAction",
    payload: payload,
  };
};

export const toggleAddEventInviteeAction = () => {
  return {
    type: "toggleAddEventInviteeAction",
  };
};

export const storeTeacherEventCurrentMonthAction = (payload) => {
  return {
    type: "storeTeacherEventCurrentMonthAction",
    payload: payload,
  };
};

export const storeTeacherEventsAction = (payload) => {
  return {
    type: "storeTeacherEventsAction",
    payload: payload,
  };
};

export const storeTeacherEventAction = (payload) => {
  return {
    type: "storeTeacherEventAction",
    payload: payload,
  };
};

export const storeTeacherEventColorAction = (payload) => {
  return {
    type: "storeTeacherEventColorAction",
    payload: payload,
  };
};

// Milestones Actions
export const toggleNewTaskFormAction = () => {
  return {
    type: "toggleNewTaskFormAction",
  };
};

export const toggleNewSegmentFormAction = (payload) => {
  return {
    type: "toggleNewSegmentFormAction",
    payload: payload,
  };
};

export const storeTeacherMilestonesAssigneesAction = (payload) => {
  return {
    type: "storeTeacherMilestonesAssigneesAction",
    payload: payload,
  };
};

export const storeTeacherSingleMilestoneSetAction = (payload) => {
  return {
    type: "storeTeacherSingleMilestoneSetAction",
    payload: payload,
  };
};

export const storeTeacherMilestoneTasksAction = (payload) => {
  return {
    type: "storeTeacherMilestoneTasksAction",
    payload: payload,
  };
};

export const toggleStudentMilestoneAddAssigneeFormAction = (payload) => {
  return {
    type: "toggleStudentMilestoneAddAssigneeFormAction",
    payload: payload,
  };
};

export const storeTeacherMilestoneStudentsAction = (payload) => {
  return {
    type: "storeTeacherMilestoneStudentsAction",
    payload: payload,
  };
};

export const storeTeacherMilestoneAssigneesAction = (payload) => {
  return {
    type: "storeTeacherMilestoneAssigneesAction",
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

export const storeStudentTeachersListAction = (payload) => {
  return {
    type: "storeStudentTeachersListAction",
    payload: payload,
  };
};

export const toggleStudentNotificationsWindowAction = (payload) => {
  return {
    type: "toggleStudentNotificationsWindowAction",
  };
};

export const storeStudentNotificationsAction = (payload) => {
  return {
    type: "storeStudentNotificationsAction",
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

export const storeStudentMeDataAction = (payload) => {
  return {
    type: "storeStudentMeDataAction",
    payload: payload,
  };
};

export const storeStudentSingleReviewAction = (payload) => {
  return {
    type: "storeStudentSingleReviewAction",
    payload: payload,
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

export const storeStudentAllCoursesAction = (payload) => {
  return {
    type: "storeStudentAllCoursesAction",
    payload: payload,
  };
};

export const storeStudentCourseProgressAction = (payload) => {
  return {
    type: "storeStudentCourseProgressAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseLessonsAction = (payload) => {
  return {
    type: "storeStudentSingleCourseLessonsAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseQuizzesAction = (payload) => {
  return {
    type: "storeStudentSingleCourseQuizzesAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseOrderNumAction = (payload) => {
  return {
    type: "storeStudentSingleCourseOrderNumAction",
    payload: payload,
  };
};

export const storeStudentUpNextAction = (payload) => {
  return {
    type: "storeStudentUpNextAction",
    payload: payload,
  };
};

export const toggleStudentSingleCourseLessonsListAction = (payload) => {
  return {
    type: "toggleStudentSingleCourseLessonsListAction",
    payload: payload,
  };
};

export const toggleStudentSingleCourseQuizzesListAction = (payload) => {
  return {
    type: "toggleStudentSingleCourseQuizzesListAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseLessonAction = (payload) => {
  return {
    type: "storeStudentSingleCourseLessonAction",
    payload: payload,
  };
};

export const storeStudentTimeAction = (payload) => {
  return {
    type: "storeStudentTimeAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseQuizAction = (payload) => {
  return {
    type: "storeStudentSingleCourseQuizAction",
    payload: payload,
  };
};

export const storeStudentSingleCourseQuizComponentsAction = (payload) => {
  return {
    type: "storeStudentSingleCourseQuizComponentsAction",
    payload: payload,
  };
};

export const storeStudentQuizFinalResultsAction = (payload) => {
  return {
    type: "storeStudentQuizFinalResultsAction",
    payload: payload,
  };
};

// Connections
export const storeStudentAllConnectionsAction = (payload) => {
  return {
    type: "storeStudentAllConnectionsAction",
    payload: payload,
  };
};

export const storeStudentAllSearchUsersAction = (payload) => {
  return {
    type: "storeStudentAllSearchUsersAction",
    payload: payload,
  };
};

export const storeStudentAllConnReqsAction = (payload) => {
  return {
    type: "storeStudentAllConnReqsAction",
    payload: payload,
  };
};

// Assignments
export const storeStudentAssignmentsAction = (payload) => {
  return {
    type: "storeStudentAssignmentsAction",
    payload: payload,
  };
};

export const storeStudentAssignmentsInfoAction = (payload) => {
  return {
    type: "storeStudentAssignmentsInfoAction",
    payload: payload,
  };
};

export const storeStudentSingleAssignmentAction = (payload) => {
  return {
    type: "storeStudentSingleAssignmentAction",
    payload: payload,
  };
};

export const storeStudentAssignmentPracticeRatingAction = (payload) => {
  return {
    type: "storeStudentAssignmentPracticeRatingAction",
    payload: payload,
  };
};

export const storeStudentCompletedAssignmentsAction = (payload) => {
  return {
    type: "storeStudentCompletedAssignmentsAction",
    payload: payload,
  };
};

export const storeStudentIncompleteAssignmentsAction = (payload) => {
  return {
    type: "storeStudentIncompleteAssignmentsAction",
    payload: payload,
  };
};

export const storeStudentAssignmentAction = (payload) => {
  return {
    type: "storeStudentAssignmentAction",
    payload: payload,
  };
};

export const storeStudentAssignmentRatingAction = (payload) => {
  return {
    type: "storeStudentAssignmentRatingAction",
    payload: payload,
  };
};

// Messages
export const storeStudentMessagesAction = (payload) => {
  return {
    type: "storeStudentMessagesAction",
    payload: payload,
  };
};

export const storeStudentSingleThreadAction = (payload) => {
  return {
    type: "storeStudentSingleThreadAction",
    payload: payload,
  };
};

export const toggleStudentNewMessageAction = () => {
  return {
    type: "toggleStudentNewMessageAction",
  };
};

// Milestones
export const storeStudentMilestonesAction = (payload) => {
  return {
    type: "storeStudentMilestonesAction",
    payload: payload,
  };
};

export const storeStudentCompleteMilestonesAction = (payload) => {
  return {
    type: "storeStudentCompleteMilestonesAction",
    payload: payload,
  };
};

export const storeStudentIncompleteMilestonesAction = (payload) => {
  return {
    type: "storeStudentIncompleteMilestonesAction",
    payload: payload,
  };
};

export const storeStudentMilestoneTasksAction = (payload) => {
  return {
    type: "storeStudentMilestoneTasksAction",
    payload: payload,
  };
};

export const storeStudentMilestoneViewTasksAction = (payload) => {
  return {
    type: "storeStudentMilestoneViewTasksAction",
    payload: payload,
  };
};

export const storeStudentTeacherIDAction = (payload) => {
  return {
    type: "storeStudentTeacherIDAction",
    payload: payload,
  };
};
