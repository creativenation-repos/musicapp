import React, { Component } from "react";

import HomeCoursesCard from "./HomeCoursesCard";

export default class HomeCoursesDeck extends Component {
  render() {
    const courses = [
      {
        key: 1,
        img: "",
        alt: "",
        name: "Music Theory",
        desc: "Learn the fundamentals of Music Theory from Beginner, to Advanced (College Level).",
        price: "$19.99",
      },
      {
        key: 2,
        img: "",
        alt: "",
        name: "Counterpoint and Harmony (Composition)",
        desc: "Learn to compose without the need of an instrument, but based on the same rules used by Johann Bach himself.",
        price: "$19.99",
      },
    ];

    return (
      <div>
        {courses.map((course) => {
          return <HomeCoursesCard course={course} />;
        })}
      </div>
    );
  }
}
