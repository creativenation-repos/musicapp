import React, { Component } from "react";

export default class ProfileFeedViewBlock extends Component {
  state = {
    showComments: false,
  };

  constructor(props) {
    super(props);
    this.displayComments = this.displayComments.bind(this);
  }

  displayComments(comm, i, commDate) {
    if (comm.Text) {
      return (
        <div key={i}>
          <p>{comm.Commenter}</p>
          <p>{comm.Text}</p>
          <p>{commDate}</p>
        </div>
      );
    } else {
      return null;
    }
  }
  render() {
    const { post } = this.props;
    const date = post.Date.toDate().toString().substr(4, 11);
    return (
      <div>
        <p>Jesus Jimenez Santos</p>
        <p>{post.Text}</p>
        <p>{date}</p>
        <button
          onClick={() => {
            this.setState({ showComments: !this.state.showComments });
          }}
        >
          Comments
        </button>
        {this.state.showComments
          ? post.commentData.map((comm, i) => {
              const commDate = comm.Date.toDate().toString().substr(4, 11);
              return this.displayComments(comm, i, commDate);
            })
          : null}
      </div>
    );
  }
}
