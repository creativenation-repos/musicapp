import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faClipboardCheck,
  faCalendarDay,
  faComments,
  faSearch,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import "./TopBar.css";

export default class TopBar extends Component {
  render() {
    return (
      <div>
        <div>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faCommentAlt} />
          </button>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faClipboardCheck} />
          </button>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faCalendarDay} />
          </button>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faComments} />
          </button>
        </div>
        <div>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button class="btn-topbar">
            <FontAwesomeIcon icon={faBell} />
          </button>
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
        <br />
      </div>
    );
  }
}
