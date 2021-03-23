import React, { Component } from "react";
import ForumSinglePostBlock from "./ForumSinglePostBlock";

export default class ForumSingleBlock extends Component {
  render() {
    const { topic, desc, date, posts } = this.props;
    return (
      <div>
        <h2>{topic}</h2>
        <h4>{desc}</h4>
        <h4>{date.toDate().toString().substr(4, 11)}</h4>
        <br />
        <br />

        {/* Posts */}
        <div>
          {posts.map((p, i) => {
            return <ForumSinglePostBlock key={i} poster={p.Poster} text={p.Text} date={p.Date} comments={p.commentData} />;
          })}
        </div>

        <br />
        <hr />
      </div>
    );
  }
}
