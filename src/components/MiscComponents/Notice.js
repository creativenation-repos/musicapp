import React, { Component } from "react";

export default class Notice extends Component {
  render() {
    const { message } = this.props;
    return (
      <div
        style={{
          backgroundColor: "rgba(245, 171, 53, 0.3)",
          padding: "0.2% 1%",
          width: "80%",
          borderRadius: "5px",
          color: "rgba(0,0,0,0.6)",
        }}
      >
        <p>{message}</p>
      </div>
    );
  }
}
