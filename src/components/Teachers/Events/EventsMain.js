import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";
import GetToday from "../../GetToday";

import { teachers_Collection } from "../../../utils/firebase";
import {
  storeTeacherEventsGeneralInfoAction,
  storeTodayArrayAction,
  storeMonthEventsAction,
  storeSingleMonthEventAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function EventsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const events = useSelector(
    (state) => state.storeTeacherEventsGeneralInfoReducer
  );

  const todayArray = useSelector((state) => state.storeTodayArrayReducer);
  const monthEvents = useSelector((state) => state.storeMonthEventsReducer);

  // GET
  const getAllEvents = () => {
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .orderBy("Start", "asc")
      .get()
      .then((snapshot) => {
        const eventsData = firebaseLooper(snapshot);
        dispatch(storeTeacherEventsGeneralInfoAction(eventsData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleEventList = () => {
    return monthEvents.map((eve, i) => {
      return (
        <div key={i}>
          <h3>{eve.Name}</h3>
          <p>
            Start:{" "}
            {eve.Start ? eve.Start.toDate().toString().substr(4, 11) : null}
          </p>
          <p>
            End: {eve.End ? eve.End.toDate().toString().substr(4, 11) : null}
          </p>
          <button id={eve.id} onClick={navEventView}>
            View
          </button>
          <button id={eve.id} onClick={navEventEdit}>
            Edit
          </button>
          <button id={eve.id} onClick={removeEvent}>
            Remove
          </button>
        </div>
      );
    });
  };

  // EVENT STUFFS
  const turnMonthToNum = (shortMonth) => {
    switch (shortMonth) {
      case "Jan":
        return 1;
      case "Feb":
        return 2;
      case "Mar":
        return 3;
      case "Apr":
        return 4;
      case "May":
        return 5;
      case "Jun":
        return 6;
      case "Jul":
        return 7;
      case "Aug":
        return 8;
      case "Sep":
        return 9;
      case "Oct":
        return 10;
      case "Nov":
        return 11;
      case "Dec":
        return 12;
      default:
        return "No Month Found.";
    }
  };
  const turnMonthToLong = (shortMonth) => {
    switch (shortMonth) {
      case "Jan":
        return "January";
      case "Feb":
        return "Feburary";
      case "Mar":
        return "March";
      case "Apr":
        return "April";
      case "May":
        return "May";
      case "Jun":
        return "June";
      case "Jul":
        return "July";
      case "Aug":
        return "August";
      case "Sep":
        return "September";
      case "Oct":
        return "October";
      case "Nov":
        return "November";
      case "Dec":
        return "December";
      default:
        return "No Month Found.";
    }
  };
  const turnNumToShort = (numMonth) => {
    switch (numMonth) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "No Month Found.";
    }
  };
  const turnNumToLong = (numMonth) => {
    switch (numMonth) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "No Month Found";
    }
  };

  const getEventDetails = () => {
    const today = GetToday().toDate().toString().substr(4, 11).split(" ");
    const todayArr = [
      turnMonthToNum(today[0]),
      parseInt(today[1], 10),
      parseInt(today[2], 10),
    ];

    dispatch(storeTodayArrayAction(todayArr));

    const todayMonth = todayArray[0];
    const todayYear = todayArray[2];

    const currentEvents = [];
    events.forEach((eve) => {
      if (eve.Start) {
        const startArr = eve.Start.toDate().toString().substr(4, 11).split(" ");
        const endArr = eve.End.toDate().toString().substr(4, 11).split(" ");

        const startMonth = turnMonthToNum(startArr[0]);
        const startYear = parseInt(startArr[2], 10);

        const endMonth = turnMonthToNum(endArr[0]);
        const endYear = parseInt(endArr[2], 10);

        if (startMonth === todayMonth) {
          if (startYear === todayYear) {
            currentEvents.push(eve);
          }
        } else if (endMonth === todayMonth) {
          if (endYear === todayYear) {
            currentEvents.push(eve);
          }
        }
      }
    });

    dispatch(storeMonthEventsAction(currentEvents));
  };

  const goBackMonth = () => {
    let month = todayArray[0];
    let day = todayArray[1];
    let year = todayArray[2];

    if (month === 1) {
      month = 12;
      year = year - 1;
    } else {
      month = month - 1;
    }

    const newTodayArr = [month, day, year];

    dispatch(storeTodayArrayAction(newTodayArr));

    const todayMonth = month;
    const todayYear = year;

    const currentEvents = [];
    events.forEach((eve) => {
      if (eve.Start) {
        const startArr = eve.Start.toDate().toString().substr(4, 11).split(" ");
        const endArr = eve.End.toDate().toString().substr(4, 11).split(" ");

        const startMonth = turnMonthToNum(startArr[0]);
        const startYear = parseInt(startArr[2], 10);

        const endMonth = turnMonthToNum(endArr[0]);
        const endYear = parseInt(endArr[2], 10);

        if (startMonth === todayMonth) {
          if (startYear === todayYear) {
            currentEvents.push(eve);
          }
        } else if (endMonth === todayMonth) {
          if (endYear === todayYear) {
            currentEvents.push(eve);
          }
        }
      }
    });

    dispatch(storeMonthEventsAction(currentEvents));
  };
  const goForwMonth = () => {
    let month = todayArray[0];
    let day = todayArray[1];
    let year = todayArray[2];

    if (month === 12) {
      month = 11;
      year = year + 1;
    } else {
      month = month + 1;
    }

    const newTodayArr = [month, day, year];

    dispatch(storeTodayArrayAction(newTodayArr));

    const todayMonth = month;
    const todayYear = year;

    const currentEvents = [];
    events.forEach((eve) => {
      if (eve.Start) {
        const startArr = eve.Start.toDate().toString().substr(4, 11).split(" ");
        const endArr = eve.End.toDate().toString().substr(4, 11).split(" ");

        const startMonth = turnMonthToNum(startArr[0]);
        const startYear = parseInt(startArr[2], 10);

        const endMonth = turnMonthToNum(endArr[0]);
        const endYear = parseInt(endArr[2], 10);

        if (startMonth === todayMonth) {
          if (startYear === todayYear) {
            currentEvents.push(eve);
          }
        } else if (endMonth === todayMonth) {
          if (endYear === todayYear) {
            currentEvents.push(eve);
          }
        }
      }
    });

    dispatch(storeMonthEventsAction(currentEvents));
  };

  // REMOVE
  const removeEvent = (event) => {
    const eventID = event.target.getAttribute("id");

    // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(eventID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch

    const allEvents = [...events];
    const newEves = allEvents.filter((eee) => eee.id !== eventID);

    const allMonthEvents = [...monthEvents];
    const newMonthEves = allMonthEvents.filter((eee) => eee.id !== eventID);

    dispatch(storeTeacherEventsGeneralInfoAction(newEves));
    dispatch(storeMonthEventsAction(newMonthEves));
  };

  // NAV
  const navEventView = (event) => {
    const eventID = event.target.getAttribute("id");

    monthEvents.forEach((eve) => {
      if (eve.id === eventID) {
        dispatch(storeSingleMonthEventAction(eve));
      }
    });

    history.push("/teacher-event-view");
  };
  const navEventEdit = (event) => {
    const eventID = event.target.getAttribute("id");

    monthEvents.forEach((eve) => {
      if (eve.id === eventID) {
        dispatch(storeSingleMonthEventAction(eve));
      }
    });

    history.push("/teacher-event-edit");
  };
  const navEventNew = () => {
    history.push("/teacher-event-new");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllEvents();
    getEventDetails();
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <h1>Events</h1>
        <button className="btn-lime" onClick={navEventNew}>
          Create Event
        </button>
        <button onClick={() => getEventDetails()}>Rerender</button>
        <div>
          {/* Show current month */}
          <h2>
            {turnNumToLong(todayArray[0])}, {todayArray[2]}
          </h2>
          <button onClick={goBackMonth}>{`<`}</button>
          <button onClick={goForwMonth}>{`>`}</button>
        </div>

        <div>{handleEventList()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
