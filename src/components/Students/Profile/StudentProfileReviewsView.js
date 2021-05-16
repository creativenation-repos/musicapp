import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeTeacherAllReviewsAction,
  storeStudentSingleReviewAction,
} from "../../../redux/actions";

import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function StudentProfileReviewsView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const meData = useSelector((state) => state.storeStudentMeDataReducer);
  const reviews = useSelector((state) => state.storeTeacherAllReviewsReducer);

  // GET
  const getAllReviews = () => {
    let reviews_Collection;

    if (user.AccountType === "Student") {
      reviews_Collection = students_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Reviews")
        .collection("ReviewBlocks");
    } else if (user.AccountType === "Teacher") {
      reviews_Collection = teachers_Collection
        .doc(user.AuthID)
        .collection("Profile")
        .doc("Reviews")
        .collection("ReviewBlocks");
    }

    reviews_Collection
      .orderBy("Date", "desc")
      .get()
      .then((snapshot) => {
        const reviewsData = firebaseLooper(snapshot);
        dispatch(storeTeacherAllReviewsAction(reviewsData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleAllReviews = () => {
    return reviews.map((rev, i) => {
      return (
        <div className="rev-block" key={i}>
          <button onClick={navReviewEdit} id={rev.id} className="rev-edit">
            Edit
          </button>
          <p className="rev-rating">{rev.Rating}.0</p>
          <p className="rev-reviewer">{rev.Reviewer}</p>
          <p className="rev-date">
            {rev.Date ? rev.Date.toDate().toString().substr(4, 11) : null}
          </p>
          <p className="rev-review">{rev.Review}</p>
        </div>
      );
    });
  };
  const handleCurrPage = () => {
    let feedBtn = document.querySelector("#link-feed");
    feedBtn.classList.remove("navy-back");

    let aboutBtn = document.querySelector("#link-about");
    aboutBtn.classList.remove("navy-back");

    let awardsBtn = document.querySelector("#link-awards");
    awardsBtn.classList.remove("navy-back");

    let galleryBtn = document.querySelector("#link-gallery");
    galleryBtn.classList.remove("navy-back");

    if (user.AccountType === "Teacher") {
      let reviewsBtn = document.querySelector("#link-reviews");
      reviewsBtn.classList.add("navy-back");
    }
  };

  // NAV
  const navReviewEdit = (event) => {
    const revID = event.target.getAttribute("id");

    reviews.forEach((rev) => {
      if (rev.id === revID) {
        dispatch(storeStudentSingleReviewAction(rev));
      }
    });

    history.push("/student-profile/reviews-edit");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllReviews();
    handleCurrPage();
  }, [reviews]);
  return (
    <div>
      {meData.AccountType === "Student" ? (
        <button
          className="btn-newPost"
          onClick={() => history.push("/student-profile/reviews-create")}
        >
          Create Review
        </button>
      ) : null}
      <div className="white-background">{handleAllReviews()}</div>
    </div>
  );
}
