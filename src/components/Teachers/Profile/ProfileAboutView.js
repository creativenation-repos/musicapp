import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeProfileAboutDataAction,
  storeProfileExperienceDataAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function ProfileAboutView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const about = useSelector((state) => state.storeProfileAboutDataReducer);
  const exp = useSelector((state) => state.storeProfileExperienceDataReducer);

  // GET
  const getAllAboutData = () => {
    const profile_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile");
    profile_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          if (d.id === "About") {
            dispatch(storeProfileAboutDataAction(d));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllExperienceData = () => {
    const experience_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks");
    experience_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeProfileExperienceDataAction(data));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleCurrPage = () => {
    let feedBtn = document.querySelector("#link-feed");
    feedBtn.classList.remove("navy-back");

    let aboutBtn = document.querySelector("#link-about");
    aboutBtn.classList.add("navy-back");

    let awardsBtn = document.querySelector("#link-awards");
    awardsBtn.classList.remove("navy-back");

    let galleryBtn = document.querySelector("#link-gallery");
    galleryBtn.classList.remove("navy-back");

    let reviewsBtn = document.querySelector("#link-reviews");
    reviewsBtn.classList.remove("navy-back");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    window.scrollTo(0, 0);
    getAllAboutData();
    getAllExperienceData();
    handleCurrPage();
  }, []);
  return (
    <div>
      <div>
        <button onClick={() => history.push("/teacher-profile/edit-about")}>
          Edit
        </button>
      </div>
      <div>
        <h2>About</h2>
        <p>{about.About}</p>
      </div>
      <hr />
      <div>
        <h2>Experience</h2>
        {exp.map((ex, i) => {
          return (
            <div key={i}>
              <h3>{ex.Institution}</h3>
              <p>{ex.Desc}</p>
              <p>Started: {ex.Start.toDate().toString().substr(4, 11)}</p>
              <p>Ended: {ex.End.toDate().toString().substr(4, 11)}</p>
            </div>
          );
        })}
      </div>
      <hr />
      <div>
        <h2>Personal</h2>
        <p>Email: {about.Email}</p>
        <p>Location: {about.Location}</p>
        <p>Instruments:</p>
        {about.Instruments ? (
          <div>
            <ul>
              {about.Instruments.map((ins, i) => {
                return <li key={i}>{ins}</li>;
              })}
            </ul>
            <p>Joined: {about.Joined.toDate().toString().substr(4, 11)}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
