import React, { Component } from "react";

export default class TopBar extends Component {
  render() {
    return (
      <div>
        <div>
          <button>New Message</button>
          <button>New Assignment</button>
          <button>New Event</button>
          <button>New Forum Post</button>
        </div>
        <div>
          <button>Search</button>
          <button>Notifications</button>
          <div>
            <div>
              <p>Jesus Jimenez</p>
            </div>
            <div>
              <p>Teacher</p>
            </div>
          </div>
          <div>
            <img src="" alt="" />
          </div>
        </div>
      </div>
    );
  }
}
