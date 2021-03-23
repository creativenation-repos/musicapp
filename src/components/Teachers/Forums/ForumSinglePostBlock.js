import React, { Component } from "react";

export default class ForumSinglePostBlock extends Component {
  state = {
    showComments: false,
  };
  render() {
    const { poster, date, text, comments } = this.props;
    return (
      <div>
        <h5>{poster}</h5>
        <p>{date.toDate().toString().substr(4, 11)}</p>
        <p>{text}</p>
        <button
          onClick={() =>
            this.setState({ showComments: !this.state.showComments })
          }
        >
          Comments
        </button>
        {this.state.showComments
          ? comments.map((com, i) => {
              return (
                <div key={i}>
                  <p>{com.Commenter}</p>
                  <p>{com.Text}</p>
                  <p>{com.Date.toDate().toString().substr(4, 11)}</p>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}
