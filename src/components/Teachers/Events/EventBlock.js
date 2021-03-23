import React, { Component } from "react";

export default class EventBlock extends Component {
  state = {
    showFullEvent: false,
  };

  render() {
    const { color, title, location, date, invited, desc, allday } = this.props;
    const fullDate = `${date.toDate().getFullYear().toString()}-${
      date.toDate().getMonth() < 10 ? "0" : ""
    }${date.toDate().getMonth().toString()}-${
      date.toDate().getDate() < 10 ? "0" : ""
    }${date.toDate().getDate().toString()}`;
    return (
      <div style={{ borderLeft: `5px solid ${color}` }}>
        <h5>{title}</h5>
        <p>{location}</p>
        <p>{fullDate}</p>
        <button
          onClick={() =>
            this.setState({ showFullEvent: !this.state.showFullEvent })
          }
        >
          Edit
        </button>

        {this.state.showFullEvent ? (
          <div>
            <h2>Edit Event</h2>

            {/* Title */}
            <div>
              <label>Title</label>
              <input id="tbTitle" type="text" value={title} />
            </div>
            {/* Location */}
            <div>
              <label>Location</label>
              <input id="tbLocation" type="text" value={location} />
            </div>
            {/* Desc */}
            <div>
              <label>Desc</label>
              <textarea id="taDesc" value={desc}></textarea>
            </div>
            {/* Date */}
            <div>
              <label>Date</label>
              <input id="dateDate" type="date" value={fullDate}></input>
            </div>
            {/* All Day */}
            <div>
              <label>All Day?</label>
              <input
                id="cbAllDay"
                type="checkbox"
                checked={allday ? "checked" : ""}
              />
            </div>
            {/* Invited */}
            <div>
              <label>Invited</label>
              {invited.map((inv, i) => {
                return (
                  <div>
                    <p>{inv.split("~")[1]}</p>
                    <button
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "20px",
                        border: 0,
                        fontSize: "15px",
                      }}
                    >
                      -
                    </button>
                  </div>
                );
              })}
              <div>
                <p>Search for student</p>
                <input id="tbSearchStud" type="text" placeholder="Search" />
              </div>
            </div>

            <button>Cancel</button>
            <button>Save</button>
          </div>
        ) : null}
      </div>
    );
  }
}
