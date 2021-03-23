import React, { Component } from 'react';

export default class CoursesCard extends Component {
    render() {
        const {course} = this.props;
        return (
            <div>
                <h1>{course.name}</h1>
                <img src={course.img} alt={course.alt} />
                <p>{course.desc}</p>
                <h3>{course.price}</h3>
                <div>
                    <button>Buy Now</button>
                    <button>View Plans</button>
                </div>
            </div>
        )
    }
}
