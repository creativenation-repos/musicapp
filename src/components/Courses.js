import { useSelector, useDispatch } from "react-redux";
import { searchCourseAction } from "../redux/actions";
import CoursesDeck from "./Courses/CoursesDeck";

import Footer from "./Footer";

import './main.css';

export default function Courses() {
  const courseState = useSelector((state) => state.courseSearchReducer);
  const dispatch = useDispatch();

  return (
    <div className="main-wrapper">
      {/* Logo */}
      <div>
        <img src="" alt="" />
        <h1>Musicademy</h1>
      </div>
      {/* Main */}
      <div>
        <div>
          <h1>Check out our courses catalog.</h1>
        </div>
        <div>
          <h3>Search for the right course.</h3>
          <p>Use keywords or search for the course directly.</p>
          <input
            id="tbSearch"
            type="text"
            placeholder="Enter keywords here..."
          />
          <button
            onClick={() => {
              dispatch(
                searchCourseAction(document.querySelector("#tbSearch").value)
              );
            }}
          >
            Search
          </button>
        </div>
        <div>
          <p>Showing {courseState.length} out of 8 courses.</p>
        </div>
        <div>
          {courseState.length > 0 ? <CoursesDeck courses={courseState} /> : <h3>No results found.</h3>}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
