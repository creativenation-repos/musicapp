import React, { Component } from "react";

export default class MilestoneBlock extends Component {
  state = {
    showAssigned: false,
  };
  render() {
    const { name, assignedTo } = this.props;
    return (
      <div>
        <h3>{name}</h3>
        <button
          onClick={() =>
            this.setState({ showAssigned: !this.state.showAssigned })
          }
        >
          Show Assigned
        </button>
        {this.state.showAssigned ? (
          <ul>
            {assignedTo.map((ass, i) => {
              return <li>{ass}</li>;
            })}
          </ul>
        ) : null}
        <button>Edit</button>
      </div>
    );
  }
}
