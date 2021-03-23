import React, { Component } from "react";

export default class ForumBlocks extends Component {
  render() {
    const { topic, group } = this.props;
    return (
      <div>
        <h3>{topic}</h3>
        <p>{group}</p>
      </div>
    );
  }
}
