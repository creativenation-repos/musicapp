import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import {
  storeAwardListAction,
  storeCertListAction,
  storeStudentAwardsAction,
  storeStudentCertsAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentProfileAwardsView() {
    const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
    const user = useSelector(state => state.storeStudentUserDataReducer);
    const history = useHistory();
    const dispatch = useDispatch();
    const meData = useSelector((state) => state.storeStudentMeDataReducer);

    const awards = useSelector((state) => state.storeStudentAwardsReducer);
    const certs = useSelector((state) => state.storeStudentCertsReducer);
  
    // GET
    const getAllAwards = () => {
      let awards_Collection;
      if (user.AccountType === "Student") {
        awards_Collection = students_Collection
          .doc(user.AuthID)
          .collection("Profile")
          .doc("Awards")
          .collection("AwardBlocks");
      } else if (user.AccountType === "Teacher") {
        awards_Collection = teachers_Collection
          .doc(user.AuthID)
          .collection("Profile")
          .doc("Awards")
          .collection("AwardList");
      }
  
      let cert_Collection;
      if (user.AccountType === "Student") {
        cert_Collection = students_Collection
          .doc(user.AuthID)
          .collection("Profile")
          .doc("Awards")
          .collection("CertBlocks");
      } else if (user.AccountType === "Teacher") {
        cert_Collection = teachers_Collection
          .doc(user.AuthID)
          .collection("Profile")
          .doc("Awards")
          .collection("CertificationList");
      }
  
      awards_Collection
        .get()
        .then((snapshot) => {
          const awardData = firebaseLooper(snapshot);

          dispatch(storeStudentAwardsAction(awardData));
        })
        .catch((err) => console.log(err));
  
      cert_Collection
        .get()
        .then((snapshot) => {
          const certData = firebaseLooper(snapshot);
          dispatch(storeStudentCertsAction(certData));
        })
        .catch((err) => console.log(err));
    };
  
    // HANDLE
    const handleCurrPage = () => {
      let feedBtn = document.querySelector("#link-feed");
      feedBtn.classList.remove("navy-back");
  
      let aboutBtn = document.querySelector("#link-about");
      aboutBtn.classList.remove("navy-back");
  
      let awardsBtn = document.querySelector("#link-awards");
      awardsBtn.classList.add("navy-back");
  
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

      getAllAwards();
    handleCurrPage();
    }, [awards]);


    return (
         <div>
      <div>
        {user.AuthID === meData.AuthID ? (
          <button
            className="btn-newPost"
            onClick={() => {
              history.push("/student-profile/awards-edit");
            }}
          >
            Edit
          </button>
        ) : null}
      </div>
      <div className="white-background">
        <h2 className="award-head">Awards</h2>
        {awards.map((award, i) => {
          return (
            <div key={i}>
              <h3 className="award-name">{award.Name}</h3>
              <p className="award-location">{award.Location}</p>
              <p className="award-date">
                Awarded on {award.Date.toDate().toString().substr(4, 11)}
              </p>
              <p className="award-desc">{award.Desc}</p>
            </div>
          );
        })}
      </div>
      <div className="white-background">
        <h2 className="award-head">Certifications</h2>
        {certs.map((cert, i) => {
          return (
            <div key={i}>
              <h3 className="award-name">{cert.Name}</h3>
              <p className="award-location">{cert.Location}</p>
              <p className="award-date">
                Awarded on {cert.Date.toDate().toString().substr(4, 11)}
              </p>
              <p className="award-desc">{cert.Desc}</p>
            </div>
          );
        })}
      </div>
    </div>
    )
}
