import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeCurrentMonthAction } from "../../../redux/actions";
import EventBlock from "./EventBlock";

export default function EventsMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const eventState = useSelector(
    (state) => state.storeTeacherEventsGeneralInfoReducer
  );
  const currentMonthState = useSelector(
    (state) => state.storeCurrentMonthReducer
  );
  const studentState = useSelector(
    (state) => state.storeTeacherStudentGeneralInfoReducer
  );

  const today = new Date();
  const currentMonthShort = today.toString().substr(4, 3);
  const currentYear = today.getFullYear().toString();

  const allMonths = [
    {
      monthShort: "Jan",
      month: "January",
      num: 1,
    },
    {
      monthShort: "Feb",
      month: "Feburary",
      num: 2,
    },
    {
      monthShort: "Mar",
      month: "March",
      num: 3,
    },
    {
      monthShort: "Apr",
      month: "April",
      num: 4,
    },
    {
      monthShort: "May",
      month: "May",
      num: 5,
    },
    {
      monthShort: "Jun",
      month: "June",
      num: 6,
    },
    {
      monthShort: "Jul",
      month: "July",
      num: 7,
    },
    {
      monthShort: "Aug",
      month: "August",
      num: 8,
    },
    {
      monthShort: "Sep",
      month: "September",
      num: 9,
    },
    {
      monthShort: "Oct",
      month: "October",
      num: 10,
    },
    {
      monthShort: "Nov",
      month: "November",
      num: 11,
    },
    {
      monthShort: "Dec",
      month: "December",
      num: 12,
    },
  ];

  const getMonth = (month) => {
    let monthType = typeof month;

    allMonths.forEach((m) => {
      if (monthType === "string") {
        if (m.monthShort === month) {
          dispatch(storeCurrentMonthAction(m.month));
          return;
        }
      } else if (monthType === "number") {
        if (m.num === month) {
          dispatch(storeCurrentMonthAction(m.month));
          return;
        }
      } else {
        console.log("Invalid Input");
      }
    });
  };
  const OnBackMonthClick = () => {
    let num = 0;
    allMonths.forEach((m) => {
      if (currentMonthState === m.month) {
        num = m.num;
      }
    });
    if (num === 1) {
      num = 12;
    } else {
      num = num - 1;
    }

    getMonth(num);
  };
  const OnForwardMonthClick = () => {
    let num = 0;
    allMonths.forEach((m) => {
      if (currentMonthState === m.month) {
        num = m.num;
      }
    });
    if (num === 12) {
      num = 1;
    } else {
      num = num + 1;
    }
    getMonth(num);
  };
  const showEvents = (ev) => {
    const monthShort = ev.Date.toDate().toString().substr(4, 3);
    const year = ev.Date.toDate().getFullYear().toString();
    const stateMonthShort = currentMonthState.substr(0, 3);
    if (monthShort === stateMonthShort && year === currentYear) {
      return (
        <div>
          <EventBlock
            color={ev.Color}
            title={ev.Title}
            location={ev.Location}
            date={ev.Date}
            invited={ev.Invited}
            desc={ev.Desc}
            allday={ev.isAllDay}
            students={studentState}
          />
        </div>
      );
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getMonth(currentMonthShort);
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <div>
          <input id="tbEventSearch" type="text" placeholder="Search" />
          <button>Create New Event</button>
        </div>

        {/* Event List */}
        <div>
          {/* Top */}
          <div>
            {/* Go back month */}
            <button onClick={OnBackMonthClick}>{`<`}</button>
            {/* Go forward month */}
            <button onClick={OnForwardMonthClick}>{`>`}</button>

            <h3>{currentMonthState}</h3>
          </div>

          {/* Event Content */}
          <div>
            {eventState.map((ev, i) => {
              return showEvents(ev);
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
