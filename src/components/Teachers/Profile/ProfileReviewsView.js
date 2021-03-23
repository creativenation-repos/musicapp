import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection, users_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import { storeReviewListAction } from "../../../redux/actions";

export default function ProfileReviewsView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.storeReviewListReducer);

  const getAllReviews = () => {
    let newReviewArray = [];
    const reviews_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Reviews")
      .collection("ReviewBlocks");
    reviews_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);

        data.forEach((d) => {
          let fullName = "";

          users_Collection
            .where("AuthID", "==", d.Reviewer)
            .get()
            .then((snapshot) => {
              const userData = firebaseLooper(snapshot);
              fullName = `${userData[0].FirstName} ${userData[0].LastName}`;
              d = {
                ...d,
                FullName: fullName,
              };
              newReviewArray.push(d);
            })
            .catch((err) => console.log(err));
        });
        dispatch(storeReviewListAction(newReviewArray));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getAllReviews();
  }, []);
  return (
    <div>
      {/* Overall Rating */}
      <div></div>

      {/* Review List */}
      <div>
        {reviews.map((rev, i) => {
          return (
            <div key={i}>
              <h3>{rev.Rating}</h3>
              <p>{rev.FullName}</p>
              <p>{rev.Review}</p>
              <p>{rev.Date.toDate().toString().substr(4, 11)}</p>
              <hr/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
