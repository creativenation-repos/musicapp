import React, { Component } from 'react';

import CoursesCard from './CoursesCard';

export default class CoursesDeck extends Component {
    render() {
        const {courses} = this.props;
        return (
            <div>
                {courses.map((course) => {
                    return <CoursesCard key={course.key} course={course} />
                })}
            </div>
        )
    }
}
