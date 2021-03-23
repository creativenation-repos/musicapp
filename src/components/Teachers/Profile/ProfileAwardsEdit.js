import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeAwardListAction,
  storeCertListAction,
  toggleNewAwardFormAction,
  toggleNewCertFormAction,
} from "../../../redux/actions";
import { teachers_Collection } from "../../../utils/firebase";

import InputDateFormatter from "../../InputDateFormatter";
import RandomString from "../../RandomString";
import FirebaseDate from "../../FirebaseDate";

export default function ProfileAwardsEdit() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const awards = useSelector((state) => state.storeAwardListReducer);
  const certs = useSelector((state) => state.storeCertListReducer);

  const toggleAwardForm = useSelector(
    (state) => state.toggleNewAwardFormReducer
  );
  const toggleCertForm = useSelector((state) => state.toggleNewCertFormReducer);

  const applyNewAward = () => {
    const awardName = document.querySelector("#tbAwardNameText").value;
    const awardLocation = document.querySelector("#tbAwardLocationText").value;
    const awardDate = document.querySelector("#daAwardDateNew").value;
    const awardDesc = document.querySelector("#taAwardDescText").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const awardID = `Award${rand1}${rand2}`;

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardList")
      .doc(awardID)
      .set({
        Name: awardName,
        Location: awardLocation,
        Date: FirebaseDate(awardDate),
        Desc: awardDesc,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allAwards = [...awards];
    allAwards.push({
      id: awardID,
      Name: awardName,
      Location: awardLocation,
      Date: FirebaseDate(awardDate),
      Desc: awardDesc,
    });

    dispatch(storeAwardListAction(allAwards));
    dispatch(toggleNewAwardFormAction());
  };

  const applyNewCert = () => {
    const certName = document.querySelector("#tbCertNameText").value;
    const certLocation = document.querySelector("#tbCertLocationText").value;
    const certDate = document.querySelector("#daCertDateNew").value;
    const certDesc = document.querySelector("#taCertDescText").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const certID = `Cert${rand1}${rand2}`;

    // Save to DB
    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertificationList")
      .doc(certID)
      .set({
        Name: certName,
        Location: certLocation,
        Date: FirebaseDate(certDate),
        Desc: certDesc,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allCerts = [...certs];
    allCerts.push({
      id: certID,
      Name: certName,
      Location: certLocation,
      Date: FirebaseDate(certDate),
      Desc: certDesc,
    });

    dispatch(storeCertListAction(allCerts));
    dispatch(toggleNewCertFormAction());
  };

  const removeAward = (event) => {
    const awardID = event.target.getAttribute("id");

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardList")
      .doc(awardID)
      .delete()
      .catch((err) => console.log(err));

    const allAwards = [...awards];
    const filteredAwards = allAwards.filter((a) => a.id !== awardID);

    dispatch(storeAwardListAction(filteredAwards));
  };

  const removeCert = (event) => {
    const certID = event.target.getAttribute("id");

    teachers_Collection
      .doc(teacherAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertificationList")
      .doc(certID)
      .delete()
      .catch((err) => console.log(err));

    const allCerts = [...certs];
    const filteredCerts = allCerts.filter((c) => c.id !== certID);

    dispatch(storeCertListAction(filteredCerts));
  };

  const saveAllChanges = () => {
    const allAwards = [];
    const allCerts = [];

    const awardCount = awards.length;
    const certCount = certs.length;

    // Save to DB
    for (let i = 0; i < awardCount; i = i + 1) {
      const tempObj = {
        Name: document.querySelector(`#tbAwardName${i}`).value,
        Location: document.querySelector(`#tbAwardLocation${i}`).value,
        Date: FirebaseDate(document.querySelector(`#daAwardDate${i}`).value),
        Desc: document.querySelector(`#taAwardDesc${i}`).value,
      };

      allAwards.push(tempObj);
    }

    console.log(allAwards);

    for (let i = 0; i < certCount; i = i + 1) {
      const tempObj = {
        Name: document.querySelector(`#tbCertName${i}`).value,
        Location: document.querySelector(`#tbCertLocation${i}`).value,
        Date: FirebaseDate(document.querySelector(`#daCertDate${i}`).value),
        Desc: document.querySelector(`#taCertDesc${i}`).value,
      };

      allCerts.push(tempObj);
    }

    allAwards.forEach((a, i) => {
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("AwardList")
        .doc(awards[i].id)
        .update({
          Name: a.Name,
          Location: a.Location,
          Date: a.Date,
          Desc: a.Desc,
        })
        .catch((err) => console.log(err));
    });

    allCerts.forEach((c, i) => {
      teachers_Collection
        .doc(teacherAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("CertificationList")
        .doc(certs[i].id)
        .update({
          Name: c.Name,
          Location: c.Location,
          Date: c.Date,
          Desc: c.Desc,
        })
        .catch((err) => console.log(err));
    });

    // Dispatch
    dispatch(storeAwardListAction(allAwards));
    dispatch(storeCertListAction(allCerts));

    history.push("/teacher-profile/awards");
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            history.push("/teacher-profile/awards");
          }}
        >
          Back to Awards
        </button>
      </div>
      <div>
        <h2>Awards</h2>
        {awards.map((award, i) => {
          return (
            <div key={i}>
              <div>
                <p>Award Name:</p>
                <input
                  id={`tbAwardName${i}`}
                  type="text"
                  defaultValue={award.Name}
                />
              </div>
              <div>
                <p>Location: </p>
                <input
                  id={`tbAwardLocation${i}`}
                  type="text"
                  defaultValue={award.Location}
                />
              </div>
              <div>
                <p>Date Received:</p>
                <input
                  id={`daAwardDate${i}`}
                  type="date"
                  defaultValue={InputDateFormatter(award.Date)}
                />
              </div>
              <div>
                <p>Description:</p>
                <textarea
                  id={`taAwardDesc${i}`}
                  defaultValue={award.Desc}
                ></textarea>
              </div>
              <button id={award.id} onClick={removeAward}>
                Remove
              </button>
              <hr />
            </div>
          );
        })}

        {/* New Award Form */}
        {toggleAwardForm ? (
          <div>
            {/* Award Name */}
            <div>
              <p>Award Name:</p>
              <input
                id={`tbAwardNameText`}
                type="text"
                placeholder="Award Name"
              />
            </div>
            {/* Award Location */}
            <div>
              <p>Location:</p>
              <input
                id={`tbAwardLocationText`}
                type="text"
                placeholder="Location"
              />
            </div>
            {/* Award Date */}
            <div>
              <p>Date Received:</p>
              <input id={`daAwardDateNew`} type="date" />
            </div>
            {/* Award Desc */}
            <div>
              <p>Description:</p>
              <textarea id={`taAwardDescText`} placeholder="Description" />
            </div>
            <button onClick={applyNewAward}>Apply</button>
            <button
              onClick={() => {
                dispatch(toggleNewAwardFormAction());
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              dispatch(toggleNewAwardFormAction());
            }}
          >
            +
          </button>
        )}
      </div>
      <div>
        <h2>Certifications</h2>
        {certs.map((cert, i) => {
          return (
            <div key={i}>
              <div>
                <p>Certification Name:</p>
                <input
                  id={`tbCertName${i}`}
                  type="text"
                  defaultValue={cert.Name}
                />
              </div>
              <div>
                <p>Location:</p>
                <input
                  id={`tbCertLocation${i}`}
                  type="text"
                  defaultValue={cert.Location}
                />
              </div>
              <div>
                <p>Date Received:</p>
                <input
                  id={`daCertDate${i}`}
                  type="date"
                  defaultValue={InputDateFormatter(cert.Date)}
                />
              </div>
              <div>
                <p>Description:</p>
                <textarea
                  id={`taCertDesc${i}`}
                  defaultValue={cert.Desc}
                ></textarea>
              </div>
              <button id={cert.id} onClick={removeCert}>
                Remove
              </button>
              <hr />
            </div>
          );
        })}

        {/* New Cert Form */}
        {toggleCertForm ? (
          <div>
            {/* Cert Name */}
            <div>
              <p>Certification Name:</p>
              <input
                id={`tbCertNameText`}
                type="text"
                placeholder="Certification Name"
              />
            </div>
            {/* Cert Location */}
            <div>
              <p>Location:</p>
              <input
                id={`tbCertLocationText`}
                type="text"
                placeholder="Location"
              />
            </div>
            {/* Cert Date */}
            <div>
              <p>Date Received:</p>
              <input id={`daCertDateNew`} type="date" />
            </div>
            {/* Date Desc */}
            <div>
              <p>Description:</p>
              <textarea id={`taCertDescText`} placeholder="Description" />
            </div>
            <button onClick={applyNewCert}>Apply</button>
            <button
              onClick={() => {
                dispatch(toggleNewCertFormAction());
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              dispatch(toggleNewCertFormAction());
            }}
          >
            +
          </button>
        )}
      </div>
      <hr />
      <button onClick={saveAllChanges}>Save All Changes</button>
    </div>
  );
}
