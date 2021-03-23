import React, { Component } from "react";

export default class AssignmentBlock extends Component {
  state = {
    showAssigned: false,
  };
  render() {
    const { name, due, assignedTo } = this.props;
    return (
      <div>
        <h3>{name}</h3>
        <p>Due: {due}</p>
        <button
          onClick={() => {
            this.setState({ showAssigned: !this.state.showAssigned });
          }}
        >
          Show Assigned
        </button>
        {this.state.showAssigned ? (
          <ul>
            {assignedTo.map((to, i) => {
              return <li>{to}</li>;
            })}
          </ul>
        ) : null}
        <button>Edit</button>
      </div>
    );
  }
}
