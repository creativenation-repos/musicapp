import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeTeacherAllReviewsAction } from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";
import GetToday from "../../GetToday";

export default function StudentProfileReviewsEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const review = useSelector((state) => state.storeStudentSingleReviewReducer);
  const reviews = useSelector((state) => state.storeTeacherAllReviewsReducer);
  const meData = useSelector((state) => state.storeStudentMeDataReducer);

  //   CHANGE
  const onRatingChange = () => {
    const input = document.querySelector("#tbRating").value;

    if (input.length > 1) {
      document.querySelector("#tbRating").value = input.substr(0, 1);
    }

    if (parseInt(input) > 5) {
      document.querySelector("#tbRating").value = 5;
    } else if (input === ".") {
      document.querySelector("#tbRating").value = 0;
    }
  };

  // HANDLE
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

  //   POST
  const saveRating = () => {
    const rating = parseInt(document.querySelector("#tbRating").value);
    const reviewText = document.querySelector("#taReview").value;

    teachers_Collection
      .doc(user.AuthID)
      .collection("Profile")
      .doc("Reviews")
      .collection("ReviewBlocks")
      .doc(review.id)
      .update({
        Rating: rating,
        Review: reviewText,
        Date: GetToday(),
      })
      .catch((err) => console.log(err));

    const allReviews = [...reviews];
    allReviews.forEach((rev) => {
      if (rev.id === review.id) {
        rev = {
          id: rev.id,
          Rating: rating,
          Review: reviewText,
          Date: GetToday(),
          Reviewer: `${meData.FirstName} ${meData.LastName}`,
        };
        dispatch(storeTeacherAllReviewsAction(allReviews));
      }
    });

    history.push("/student-profile/reviews");
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    handleCurrPage();
  }, []);

  return (
    <div>
      <div className="white-background">
        <p className="rating-head">Rating:</p>
        <p style={{ fontSize: "14px", color: "orange", margin: "0" }}>
          Rating cannot be over 5 or below 0.
        </p>
        <input
          onChange={onRatingChange}
          className="rating-rating"
          id="tbRating"
          type="text"
          defaultValue={review.Rating}
        />

        <p className="rating-head">Review:</p>
        <textarea
          className="ta"
          id="taReview"
          defaultValue={review.Review}
        ></textarea>
      </div>

      <button onClick={saveRating} className="btnSaveChanges">
        Save Changes
      </button>
    </div>
  );
}
