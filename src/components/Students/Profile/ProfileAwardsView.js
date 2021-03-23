import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { students_Collection } from "../../../utils/firebase";
import {
  storeStudentAwardsAction,
  storeStudentCertsAction,
} from "../../../redux/actions";
import { firebaseLooper } from "../../../utils/tools";

export default function ProfileAwardView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const awards = useSelector((state) => state.storeStudentAwardsReducer);
  const certs = useSelector((state) => state.storeStudentCertsReducer);

  // GET
  const getAllAwards = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardBlocks")
      .get()
      .then((snapshot) => {
        const awardData = firebaseLooper(snapshot);
        dispatch(storeStudentAwardsAction(awardData));
      })
      .catch((err) => console.log(err));
  };
  const getAllCerts = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertBlocks")
      .get()
      .then((snapshot) => {
        const certData = firebaseLooper(snapshot);
        dispatch(storeStudentCertsAction(certData));
      })
      .catch((err) => console.log(err));
  };

  // HANDLE
  const handleAwards = () => {
    return awards.map((awd, i) => {
      return (
        <div key={i}>
          <h3>{awd.Name}</h3>
          <h4>{awd.Institution}</h4>
          <p>{awd.Desc}</p>
          <p>
            Awarded:{" "}
            {awd.Date ? awd.Date.toDate().toString().substr(4, 11) : null}
          </p>
          <hr />
        </div>
      );
    });
  };
  const handleCerts = () => {
    return certs.map((cert, i) => {
      return (
        <div key={i}>
          <h3>{cert.Name}</h3>
          <h4>{cert.Institution}</h4>
          <p>{cert.Desc}</p>
          <p>
            {cert.Date ? cert.Date.toDate().toString().substr(4, 11) : null}
          </p>
          <hr />
        </div>
      );
    });
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllAwards();
    getAllCerts();
  }, []);
  return (
    <div>
      <button onClick={() => history.push("/student-profile/awards-edit")}>
        Edit
      </button>
      {/* Awards */}
      <div>
        <h2>Awards</h2>
        <div>{handleAwards()}</div>
      </div>

      {/* Certs */}
      <div>
        <h2>Certifications</h2>
        <div>{handleCerts()}</div>
      </div>
    </div>
  );
}
