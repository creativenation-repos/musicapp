import React, { Component } from "react";

export default class MessagesThread extends Component {
  render() {
    const { user, recipient, messages } = this.props;
    const messInOrder = messages.reverse();
    return (
      <div>
        <h2>{recipient}</h2>
        <hr />
        {messInOrder.map((mess, i) => {
          return (
            <div
              style={
                mess.Sender === user ? { color: "blue" } : { color: "gray" }
              }
              key={i}
            >
              <h4>{mess.Sender}</h4>
              <p>{mess.Text}</p>
              <p>{mess.Date.toDate().toString().substr(4, 11)}</p>
            </div>
          );
        })}
        <br />
        <div>
          <input id="tbMessage" type="text" placeholder="Type Message..." />
          <button>Send</button>
        </div>
      </div>
    );
  }
}
