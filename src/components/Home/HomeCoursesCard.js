import React, { Component } from "react";

export default class HomeCoursesCard extends Component {
  render() {
    const { course } = this.props;
    return (
      <div>
        <h1>{course.name}</h1>
        <img src={course.img} alt={course.alt} />
        <p>{course.desc}</p>
        <h4>{course.price}</h4>
        <div>
          <button>View Plans</button>
          <button>Buy Now</button>
        </div>
      </div>
    );
  }
}
