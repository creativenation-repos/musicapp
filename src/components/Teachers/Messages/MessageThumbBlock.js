import React, { Component } from "react";

export default class MessageThumbBlock extends Component {
  render() {
    const { firstMessage, recipient, firstDate } = this.props;
    return (
      <div>
        <h3>{recipient}</h3>
        <p>{firstMessage}</p>
        <p>{firstDate.toDate().toString().substr(4, 11)}</p>
      </div>
    );
  }
}
