import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentAwardsAction,
  storeStudentCertsAction,
  toggleNewAwardFormAction,
  toggleNewCertFormAction,
} from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";

import InputDateFormatter from "../../InputDateFormatter";
import RandomString from "../../RandomString";
import FirebaseDate from "../../FirebaseDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function StudentProfileAwardsEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const awards = useSelector((state) => state.storeStudentAwardsReducer);
  const certs = useSelector((state) => state.storeStudentCertsReducer);

  const toggleAwardForm = useSelector(
    (state) => state.toggleNewAwardFormReducer
  );
  const toggleCertForm = useSelector((state) => state.toggleNewCertFormReducer);
  const meData = useSelector((state) => state.storeTeacherMeDataReducer);

  const applyNewAward = () => {
    const awardName = document.querySelector("#tbAwardNameText").value;
    const awardLocation = document.querySelector("#tbAwardLocationText").value;
    const awardDate = document.querySelector("#daAwardDateNew").value;
    const awardDesc = document.querySelector("#taAwardDescText").value;

    const rand1 = RandomString();
    const rand2 = RandomString();
    const awardID = `Award${rand1}${rand2}`;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
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

    dispatch(storeStudentAwardsAction(allAwards));
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
    students_Collection
      .doc(studentAuthID)
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

    dispatch(storeStudentCertsAction(allCerts));
    dispatch(toggleNewCertFormAction());
  };

  // REMOVE
  const removeAward = (event) => {
    const awardID = event.target.getAttribute("id");

    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardList")
      .doc(awardID)
      .delete()
      .catch((err) => console.log(err));

    const allAwards = [...awards];
    const filteredAwards = allAwards.filter((a) => a.id !== awardID);

    dispatch(storeStudentAwardsAction(filteredAwards));
  };
  const removeCert = (event) => {
    const certID = event.target.getAttribute("id");

    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertificationList")
      .doc(certID)
      .delete()
      .catch((err) => console.log(err));

    const allCerts = [...certs];
    const filteredCerts = allCerts.filter((c) => c.id !== certID);

    dispatch(storeStudentCertsAction(filteredCerts));
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
      students_Collection
        .doc(studentAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("AwardBlocks")
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
      students_Collection
        .doc(studentAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("CertBlocks")
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
    dispatch(storeStudentAwardsAction(allAwards));
    dispatch(storeStudentCertsAction(allCerts));

    history.push("/student-profile/awards");
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

    handleCurrPage();
  }, []);
  return (
    <div>
      <div>
        <button
          className="btn-back"
          onClick={() => {
            history.push("/student-profile/awards");
          }}
        >
          Back
        </button>
      </div>
      <div className="white-background">
        <h2 className="award-head">Awards</h2>
        {awards.map((award, i) => {
          return (
            <div className="award-block" key={i}>
              <div>
                <p className="award-edit-head">Award Name:</p>
                <input
                  className="tb-award"
                  id={`tbAwardName${i}`}
                  type="text"
                  defaultValue={award.Name}
                />
              </div>
              <div>
                <p className="award-edit-head">Location: </p>
                <input
                  className="tb-award"
                  id={`tbAwardLocation${i}`}
                  type="text"
                  defaultValue={award.Location}
                />
              </div>
              <div>
                <p className="award-edit-head">Date Awarded:</p>
                <input
                  className="dt"
                  id={`daAwardDate${i}`}
                  type="date"
                  defaultValue={InputDateFormatter(award.Date)}
                />
              </div>
              <div>
                <p className="award-edit-head">Description:</p>
                <textarea
                  className="taExpDescText"
                  id={`taAwardDesc${i}`}
                  defaultValue={award.Desc}
                ></textarea>
              </div>
              <button
                className="btnRemoveExp"
                id={award.id}
                onClick={removeAward}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          );
        })}

        {/* New Award Form */}
        {toggleAwardForm ? (
          <div>
            <button
              className="btnCancelExpForm"
              onClick={() => {
                dispatch(toggleNewAwardFormAction());
              }}
            >
              Cancel
            </button>
            {/* Award Name */}
            <div>
              <p className="award-edit-head">Award Name:</p>
              <input
                className="tb-award"
                id={`tbAwardNameText`}
                type="text"
                placeholder="Award Name"
              />
            </div>
            {/* Award Location */}
            <div>
              <p className="award-edit-head">Location:</p>
              <input
                className="tb-award"
                id={`tbAwardLocationText`}
                type="text"
                placeholder="Location"
              />
            </div>
            {/* Award Date */}
            <div>
              <p className="award-edit-head">Date Awarded:</p>
              <input className="dt" id={`daAwardDateNew`} type="date" />
            </div>
            {/* Award Desc */}
            <div>
              <p className="award-edit-head">Description:</p>
              <textarea
                className="taExpDescText"
                id={`taAwardDescText`}
                placeholder="Description"
              />
            </div>
            <button className="btnExpApply" onClick={applyNewAward}>
              Apply
            </button>
          </div>
        ) : (
          <button
            className="btnAddExp"
            onClick={() => {
              dispatch(toggleNewAwardFormAction());
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
      <div className="white-background">
        <h2 className="award-head">Certifications</h2>
        {certs.map((cert, i) => {
          return (
            <div className="award-block" key={i}>
              <div>
                <p className="award-edit-head">Certification Name:</p>
                <input
                  className="tb-award"
                  id={`tbCertName${i}`}
                  type="text"
                  defaultValue={cert.Name}
                />
              </div>
              <div>
                <p className="award-edit-head">Location:</p>
                <input
                  className="tb-award"
                  id={`tbCertLocation${i}`}
                  type="text"
                  defaultValue={cert.Location}
                />
              </div>
              <div>
                <p className="award-edit-head">Date Received:</p>
                <input
                  className="dt"
                  id={`daCertDate${i}`}
                  type="date"
                  defaultValue={InputDateFormatter(cert.Date)}
                />
              </div>
              <div>
                <p className="award-edit-head">Description:</p>
                <textarea
                  className="taExpDescText"
                  id={`taCertDesc${i}`}
                  defaultValue={cert.Desc}
                ></textarea>
              </div>
              <button
                className="btnRemoveExp"
                id={cert.id}
                onClick={removeCert}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          );
        })}

        {/* New Cert Form */}
        {toggleCertForm ? (
          <div>
            {/* Cert Name */}
            <div>
              <button
                className="btnCancelExpForm"
                onClick={() => {
                  dispatch(toggleNewCertFormAction());
                }}
              >
                Cancel
              </button>
              <p className="award-edit-head">Certification Name:</p>
              <input
                className="tb-award"
                id={`tbCertNameText`}
                type="text"
                placeholder="Certification Name"
              />
            </div>
            {/* Cert Location */}
            <div>
              <p className="award-edit-head">Location:</p>
              <input
                className="tb-award"
                id={`tbCertLocationText`}
                type="text"
                placeholder="Location"
              />
            </div>
            {/* Cert Date */}
            <div>
              <p className="award-edit-head">Date Received:</p>
              <input className="dt" id={`daCertDateNew`} type="date" />
            </div>
            {/* Date Desc */}
            <div>
              <p className="award-edit-head">Description:</p>
              <textarea
                className="taExpDescText"
                id={`taCertDescText`}
                placeholder="Description"
              />
            </div>
            <button className="btnExpApply" onClick={applyNewCert}>
              Apply
            </button>
          </div>
        ) : (
          <button
            className="btnAddExp"
            onClick={() => {
              dispatch(toggleNewCertFormAction());
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
      <button className="btnSaveChanges" onClick={saveAllChanges}>
        Save All Changes
      </button>
    </div>
  );
}
