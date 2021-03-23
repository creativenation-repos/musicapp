import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import {
  storeAwardListAction,
  storeCertListAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function ProfileAwardsView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const awards = useSelector((state) => state.storeAwardListReducer);
  const certs = useSelector((state) => state.storeCertListReducer);

  const getAllAwards = () => {
    const awards_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardList");
    const cert_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertificationList");

    awards_Collection
      .get()
      .then((snapshot) => {
        const awardData = firebaseLooper(snapshot);
        dispatch(storeAwardListAction(awardData));
      })
      .catch((err) => console.log(err));

    cert_Collection
      .get()
      .then((snapshot) => {
        const certData = firebaseLooper(snapshot);
        dispatch(storeCertListAction(certData));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
    getAllAwards();
  }, []);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            history.push("/teacher-profile/edit-awards");
          }}
        >
          Edit
        </button>
      </div>
      <div>
        <h2>Awards</h2>
        {awards.map((award, i) => {
          return (
            <div key={i}>
              <h3>{award.Name}</h3>
              <p>Location: {award.Location}</p>
              <p>Date: {award.Date.toDate().toString().substr(4, 11)}</p>
              <p>Description: {award.Desc}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h2>Certifications</h2>
        {certs.map((cert, i) => {
          return (
            <div key={i}>
              <h3>{cert.Name}</h3>
              <p>Location: {cert.Location}</p>
              <p>Date: {cert.Date.toDate().toString().substr(4, 11)}</p>
              <p>Description: {cert.Desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
