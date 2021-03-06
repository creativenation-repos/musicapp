import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeTeacherAllReviewsAction } from "../../../redux/actions";

import {
  students_Collection,
  teachers_Collection,
} from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function ProfileReviewsView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userDataReducer);
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);

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

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }

    getAllReviews();
  }, []);
  return <div className="white-background">{handleAllReviews()}</div>;
}
