import {
  faChevronLeft,
  faChevronRight,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import GetToday from "../../GetToday";
import DashFooter from "../Dash/DashFooter";
import TopBar from "../Dash/TopBar";

import {
  storeTeacherEventAction,
  storeTeacherEventCurrentMonthAction,
  storeTeacherEventsAction,
} from "../../../redux/actions";

import "./Events.css";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function EventsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const month = useSelector(
    (state) => state.storeTeacherEventCurrentMonthReducer
  );
  const events = useSelector((state) => state.storeTeacherEventsReducer);

  // GET
  const getTodayMonth = () => {
    let today = GetToday().toDate().getMonth() + 1;
    today = getFullByNum(today);
    dispatch(storeTeacherEventCurrentMonthAction(today));

    // Also dispatch events
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .orderBy("Start", "asc")
      .get()
      .then((snapshot) => {
        const eventsData = firebaseLooper(snapshot);

        const eveSize = snapshot.size;
        let eventsArr = [];
        eventsData.forEach((eve, i) => {
          let date = eve.Start.toDate().getMonth() + 1;

          date = getFullByNum(date);

          if (date === today) {
            eventsArr.push(eve);
          }

          if (i + 1 === eveSize) {
            dispatch(storeTeacherEventsAction(eventsArr));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  // DATE FORMATS
  const getFullByNum = (num) => {
    switch (num) {
      case 1:
        return "January";
      case 2:
        return "Feburary";
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
        return "Month does not exist.";
    }
  };
  const getNumByFull = (full) => {
    switch (full) {
      case "January":
        return 1;
      case "February":
        return 2;
      case "March":
        return 3;
      case "April":
        return 4;
      case "May":
        return 5;
      case "June":
        return 6;
      case "July":
        return 7;
      case "August":
        return 8;
      case "September":
        return 9;
      case "October":
        return 10;
      case "November":
        return 11;
      case "December":
        return 12;
      default:
        return "Month does not exist.";
    }
  };

  // HANDLE
  const handleMonth = () => {
    return <p className="event-curr-month">{month}</p>;
  };
  const handleEvents = () => {
    return events.map((eve, i) => {
      return (
        <div
          className={`eve-block ${
            eve.Color === "green"
              ? "eve-block-green"
              : eve.Color === "blue"
              ? "eve-block-blue"
              : eve.Color === "red"
              ? "eve-block-red"
              : eve.Color === "purple"
              ? "eve-block-purple"
              : eve.Color === "yellow"
              ? "eve-block-yellow"
              : null
          }`}
          key={i}
        >
          <p className="eve-name">{eve.Name}</p>
          <p className="eve-start">
            {eve.Start ? eve.Start.toDate().toString().substr(4, 11) : null} -
          </p>
          <p className="eve-end">
            {eve.End ? eve.End.toDate().toString().substr(4, 11) : null}
          </p>

          <button id={eve.id} onClick={navEventView} className="btn-eve-view">
            View
          </button>
          <button id={eve.id} onClick={removeEvent} className="btn-eve-del">
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
      );
    });
  };

  // CLICK
  const goBackMonth = () => {
    let newMonth = month;
    let monthNum = getNumByFull(newMonth);
    if (monthNum === 1) {
      monthNum = 12;
    } else {
      monthNum = monthNum - 1;
    }
    newMonth = getFullByNum(monthNum);
    dispatch(storeTeacherEventCurrentMonthAction(newMonth));

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .orderBy("Start", "asc")
      .get()
      .then((snapshot) => {
        const eventsData = firebaseLooper(snapshot);
        const eveSize = snapshot.size;
        let eveArr = [];
        eventsData.forEach((eve, i) => {
          const date = eve.Start.toDate().getMonth() + 1;
          if (date === monthNum) {
            eveArr.push(eve);
          }

          if (i + 1 === eveSize) {
            dispatch(storeTeacherEventsAction(eveArr));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const goForwardMonth = () => {
    let newMonth = month;
    let monthNum = getNumByFull(newMonth);
    if (monthNum === 12) {
      monthNum = 1;
    } else {
      monthNum = monthNum + 1;
    }
    newMonth = getFullByNum(monthNum);
    dispatch(storeTeacherEventCurrentMonthAction(newMonth));

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .orderBy("Start", "asc")
      .get()
      .then((snapshot) => {
        const eventsData = firebaseLooper(snapshot);
        const eveSize = snapshot.size;
        let eveArr = [];
        eventsData.forEach((eve, i) => {
          const date = eve.Start.toDate().getMonth() + 1;
          if (date === monthNum) {
            eveArr.push(eve);
          }

          if (i + 1 === eveSize) {
            dispatch(storeTeacherEventsAction(eveArr));
          }
        });
      })
      .catch((err) => console.log(err));
  };

  // NAV
  const navEventView = (event) => {
    const eveID = event.currentTarget.getAttribute("id");

    events.forEach((eve) => {
      if (eve.id === eveID) {
        dispatch(storeTeacherEventAction(eve));
      }
    });

    history.push("/teacher-event-view");
  };
  const naveventCreate = () => {
    history.push("/teacher-event-create");
  };

  // REMOVE
  const removeEvent = (event) => {
    const eveID = event.currentTarget.getAttribute("id");

    // Remove from DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Events")
      .doc(eveID)
      .delete()
      .catch((err) => console.log(err));

    const allEvents = [...events];
    const filtered = allEvents.filter((e) => e.id !== eveID);

    dispatch(storeTeacherEventsAction(filtered));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getTodayMonth();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div className="content">
        <h1>Events</h1>
        <button onClick={naveventCreate} className="btnCreate">
          Create Event
        </button>
        <div className="white-background">
          <div style={{ display: "flex" }}>
            {/* Go Back Month */}
            <button onClick={goBackMonth} className="btn-month-arrow">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {/* Go Forward Month */}
            <button onClick={goForwardMonth} className="btn-month-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            {handleMonth()}
          </div>
        </div>

        <div className="white-background">{handleEvents()}</div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
