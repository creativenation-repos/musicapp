import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentAboutAction,
  storeStudentExpAction,
} from "../../../redux/actions";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentProfileAboutView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const about = useSelector((state) => state.storeStudentAboutReducer);
  const exp = useSelector((state) => state.storeStudentExpReducer);

  const meData = useSelector((state) => state.storeStudentMeDataReducer);

  // GET
  const getAllAboutData = () => {
    let profile_Collection;

    if (user.AccountType === "Student") {
      profile_Collection = students_Collection
        .doc(user.AuthID)
        .collection("Profile");
    } else if (user.AccountType === "Teacher") {
      profile_Collection = teachers_Collection
        .doc(user.AuthID)
        .collection("Profile");
    }

    profile_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          if (d.id === "About") {
            dispatch(storeStudentAboutAction(d));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllExperienceData = () => {
    let experience_Collection;

    if (user.AccountType === "Student") {
      experience_Collection = students_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Experience")
        .collection("ExpBlocks");
    } else if (user.AccountType === "Teacher") {
      experience_Collection = teachers_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Experience")
        .collection("ExpBlocks");
    }

    experience_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeStudentExpAction(data));
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

    if (user.AccountType === "Teacher") {
      let reviewsBtn = document.querySelector("#link-reviews");
      reviewsBtn.classList.remove("navy-back");
    }
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllAboutData();
    getAllExperienceData();
    handleCurrPage();
  }, [about, exp]);
  return (
    <div>
      {user.AuthID === meData.AuthID ? (
        <button
          className="btn-newPost"
          onClick={() => history.push("/student-profile/about-edit")}
        >
          Edit
        </button>
      ) : null}
      <div className="about-section">
        <h2>About</h2>
        <p>{about.About}</p>
      </div>
      <div className="about-section">
        <h2>Experience</h2>
        {exp.map((ex, i) => {
          return (
            <div className="exp-section" key={i}>
              <h3>{ex.Institution}</h3>
              <p>{ex.Desc}</p>
              <div className="about-dates">
                <p>
                  <span className="about-date">Started:</span>{" "}
                  {ex.Start.toDate().toString().substr(4, 11)}
                </p>
                <p>
                  <span className="about-date">Ended:</span>{" "}
                  {ex.End.toDate().toString().substr(4, 11)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="about-section personal-section">
        <h2>Personal</h2>
        <p>
          <span className="personal-p">Email:</span> {about.Email}
        </p>
        <p>
          <span className="personal-p">Location:</span> {about.Location}
        </p>
        <p>
          <span className="personal-p">Instruments:</span>{" "}
        </p>
        {about.Instruments ? (
          <div>
            <ul className="about-inst">
              {about.Instruments.map((ins, i) => {
                return <li key={i}>{ins}</li>;
              })}
            </ul>
            <p>
              <span className="personal-p">Joined:</span>{" "}
              {about.Joined.toDate().toString().substr(4, 11)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
