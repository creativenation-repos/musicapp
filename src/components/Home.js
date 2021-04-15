import React, { Component } from "react";

import HomeCoursesDeck from './Home/HomeCoursesDeck';
import Footer from './Footer';

import "./main.css";
import './Home.css';

export default class Home extends Component {

  render() {
    return (
      <div className="main-wrapper">
        {/* Logo */}
        <div>
          <img src="" alt="" />
          <h1>Musicademy</h1>
        </div>

        {/* Main */}
        <div>
          {/* About */}
          <div>
            <h2>Hello!</h2>
            <p>
              Welcome to Musicademy. The best music platform for learning and
              student management
            </p>
          </div>
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <h1>Who is Musicademy for?</h1>
          </div>
          <div>
            <h2>Students</h2>
            <p>
              Anyone registering as a student has full access to all our
              courses, tools, and features.
            </p>
            <ul>
              <li>
                Courses come packed with lessons, exercises, quizzes, exams,
                grading, you name it!
              </li>
              <li>
                Interact with other music lovers by connecting and joining
                groups.
              </li>
              <li>
                Participate in discussion to contribute to anything music.
              </li>
              <li>
                Work closely with instructors by using our calendar, grading,
                point system, and message features.
              </li>
            </ul>
          </div>
          <div>
            <h2>Teachers</h2>
            <p>
              Make your job easier by registering as a teacher on our platform.
              We supply the best music teacher platform on the internet.
            </p>
            <ul>
              <li>
                All provided courses come with automated grading algorithms.
                Just assign the number of points the courses will be worth and
                the program will take care of the rest.
              </li>
              <li>
                Keep track of student progress and obtain constant communication
                with messages and notification alerts.
              </li>
              <li>
                Record student data, notes, lessons, invoices, and more with our
                state of the art UI.
              </li>
            </ul>
          </div>
          <div>
            <button>Try it now!</button>
          </div>

          {/* Courses */}
          <div>
            <h1>Learn music the easy way!</h1>
            <p>
              Each course comes with content built with new and innovative tools
              to learn, including 3D Render objects for full immersion.
            </p>
            <div>
                <HomeCoursesDeck />
            </div>
          </div>

          {/* Free Tools */}
            <div>
                <h1>Here are some free tools for you to try.</h1>
                <br/>
                <h2>Metronome</h2>
                <img src="" alt="" />
                <button>Metronome App</button>
                <br/>
                <h2>Tuner</h2>
                <img src="" alt="" />
                <button>Tuner App</button>
                <br/>
                <h2>Drone</h2>
                <img src="" alt="" />
                <button>Drone App</button>
            </div>

            {/* Testimonials */}
            <div>
                
            </div>

          {/* Footer */}
          <div>
              <hr />
              <Footer />
          </div>
        </div>
      </div>
    );
  }
}
