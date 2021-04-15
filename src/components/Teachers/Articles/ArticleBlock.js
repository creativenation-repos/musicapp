import React, { Component } from "react";

export default class ArticleBlock extends Component {
  render() {
    const { mainTopic, desc } = this.props;
    return (
      <div>
        <h3>{mainTopic}</h3>
        <p>{desc}</p>
        <button>Edit</button>
        <button>Remove</button>
      </div>
    );
  }
}
