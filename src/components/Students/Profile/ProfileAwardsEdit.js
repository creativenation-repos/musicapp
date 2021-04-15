import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import InputDateFormatter from "../../InputDateFormatter";
import FirebaseDate from "../../FirebaseDate";
import GetToday from "../../GetToday";
import RandomString from "../../RandomString";
import {
  storeStudentAwardsAction,
  storeStudentCertsAction,
  toggleStudentNewAwardFormAction,
  toggleStudentNewCertFormAction,
} from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";

export default function ProfileAwardsEdit() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const awards = useSelector((state) => state.storeStudentAwardsReducer);
  const certs = useSelector((state) => state.storeStudentCertsReducer);

  //   Toggles
  const toggleNewAwardForm = useSelector(
    (state) => state.toggleStudentNewAwardFormReducer
  );
  const toggleNewCertForm = useSelector(
    (state) => state.toggleStudentNewCertFormReducer
  );

  //   HANDLE
  const handleAwardsEdit = () => {
    return awards.map((awd, i) => {
      return (
        <div key={i}>
          <div>
            <h3>Award Name</h3>
            <input id={`tbAwardName${i}`} type="text" defaultValue={awd.Name} />
          </div>
          <div>
            <h3>Institution</h3>
            <input
              id={`tbAwardInstitution${i}`}
              type="text"
              defaultValue={awd.Institution}
            />
          </div>
          <div>
            <h3>Description</h3>
            <textarea id={`taAwardDesc${i}`} defaultValue={awd.Desc}></textarea>
          </div>
          <div>
            <h3>Issued</h3>
            <input
              id={`daAwardDate${i}`}
              type="date"
              defaultValue={InputDateFormatter(awd.Date)}
            />
          </div>
          <button id={awd.id} onClick={removeAward}>
            Remove
          </button>
          <hr />
        </div>
      );
    });
  };
  const handleCertsEdit = () => {
    return certs.map((cert, i) => {
      return (
        <div key={i}>
          <div>
            <h3>Certification Name</h3>
            <input id={`tbCertName${i}`} type="text" defaultValue={cert.Name} />
          </div>
          <div>
            <h3>Institution</h3>
            <input
              id={`tbCertInstitution${i}`}
              type="text"
              defaultValue={cert.Institution}
            />
          </div>
          <div>
            <h3>Description</h3>
            <textarea id={`taCertDesc${i}`} defaultValue={cert.Desc}></textarea>
          </div>
          <div>
            <h3>Issued</h3>
            <input
              id={`daCertDate${i}`}
              type="date"
              defaultValue={InputDateFormatter(cert.Date)}
            />
          </div>
          <button id={cert.id} onClick={removeCert}>
            Remove
          </button>
          <hr />
        </div>
      );
    });
  };
  const handleNewAward = () => {
    return (
      <div>
        <div>
          <h3>Award Name</h3>
          <input id="tbNewAwardName" type="text" placeholder="Award Name" />
        </div>
        <div>
          <h3>Institution</h3>
          <input
            id="tbNewAwardInstitution"
            type="text"
            placeholder="Institution"
          />
        </div>
        <div>
          <h3>Description</h3>
          <textarea id="taNewAwardDesc" placeholder="Description"></textarea>
        </div>
        <div>
          <h3>Issued</h3>
          <input
            id="daNewAwardDate"
            type="date"
            defaultValue={InputDateFormatter(GetToday())}
          />
        </div>
        <button onClick={saveNewAward}>Apply</button>
        <hr />
      </div>
    );
  };
  const handleNewCert = () => {
    return (
      <div>
        <div>
          <h3>Certification Name</h3>
          <input
            id="tbNewCertName"
            type="text"
            placeholder="Certification Name"
          />
        </div>
        <div>
          <h3>Institution</h3>
          <input
            id="tbNewCertInstitution"
            type="text"
            placeholder="Institution"
          />
        </div>
        <div>
          <h3>Description</h3>
          <textarea id="taNewCertDesc" placeholder="Description"></textarea>
        </div>
        <div>
          <h3>Issued</h3>
          <input
            id="daNewCertDate"
            type="date"
            defaultValue={InputDateFormatter(GetToday())}
          />
        </div>
        <button onClick={saveNewCert}>Apply</button>
        <hr />
      </div>
    );
  };

  //   POST
  const saveNewAward = () => {
    const awardName = document.querySelector("#tbNewAwardName").value;
    const awardInstitution = document.querySelector("#tbNewAwardInstitution")
      .value;
    const awardDesc = document.querySelector("#taNewAwardDesc").value;
    const awardDateValue = document
      .querySelector("#daNewAwardDate")
      .value.toString();

    const awardDate = FirebaseDate(awardDateValue);

    const rand1 = RandomString();
    const rand2 = RandomString();
    const awardID = `Award${rand1}${rand2}`;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardBlocks")
      .doc(awardID)
      .set({
        Name: awardName,
        Institution: awardInstitution,
        Desc: awardDesc,
        Date: awardDate,
      })
      .catch((err) => console.log(err));

    // Dispatch
    const allAwards = [...awards];
    allAwards.push({
      id: awardID,
      Name: awardName,
      Institution: awardInstitution,
      Desc: awardDesc,
      Date: awardDate,
    });

    console.log(allAwards);

    dispatch(storeStudentAwardsAction(allAwards));
    dispatch(toggleStudentNewAwardFormAction());
  };
  const saveNewCert = () => {
    const certName = document.querySelector("#tbNewCertName").value;
    const certInstitution = document.querySelector("#tbNewCertInstitution")
      .value;
    const certDesc = document.querySelector("#taNewCertDesc").value;
    const certDate = FirebaseDate(
      document.querySelector("#daNewCertDate").value
    );

    const rand1 = RandomString();
    const rand2 = RandomString();
    const certID = `Cert${rand1}${rand2}`;

    // Save to DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertBlocks")
      .doc(certID)
      .set({
        Name: certName,
        Institution: certInstitution,
        Desc: certDesc,
        Date: certDate,
      })
      .catch((err) => console.log(err));

    //   Dispatch
    const allCerts = [...certs];
    allCerts.push({
      id: certID,
      Name: certName,
      Institution: certInstitution,
      Desc: certDesc,
      Date: certDate,
    });

    dispatch(storeStudentCertsAction(allCerts));
    dispatch(toggleStudentNewCertFormAction());
  };
  const saveAllChanges = () => {
    let awardArray = [];
    let certArray = [];

    // Awards
    for (let i = 0; i < awards.length; i = i + 1) {
      const awardName = document.querySelector(`#tbAwardName${i}`).value;
      const awardInstutition = document.querySelector(`#tbAwardInstitution${i}`)
        .value;
      const awardDesc = document.querySelector(`#taAwardDesc${i}`).value;
      const awardDate = FirebaseDate(
        document.querySelector(`#daAwardDate${i}`).value
      );

      const awardObj = {
        id: awards[i].id,
        Name: awardName,
        Institution: awardInstutition,
        Desc: awardDesc,
        Date: awardDate,
      };

      awardArray.push(awardObj);
    }

    // Certs
    for (let i = 0; i < certs.length; i = i + 1) {
      const certName = document.querySelector(`#tbCertName${i}`).value;
      const certInstitution = document.querySelector(`#tbCertInstitution${i}`)
        .value;
      const certDesc = document.querySelector(`#taCertDesc${i}`).value;
      const certDate = FirebaseDate(
        document.querySelector(`#daCertDate${i}`).value
      );

      const certObj = {
        id: certs[i].id,
        Name: certName,
        Institution: certInstitution,
        Desc: certDesc,
        Date: certDate,
      };

      certArray.push(certObj);
    }

    // Save to DB
    awardArray.forEach((awd) => {
      students_Collection
        .doc(studentAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("AwardBlocks")
        .doc(awd.id)
        .update({
          Name: awd.Name,
          Institution: awd.Institution,
          Desc: awd.Desc,
          Date: awd.Date,
        })
        .catch((err) => console.log(err));
    });
    certArray.forEach((cert) => {
      students_Collection
        .doc(studentAuthID)
        .collection("Profile")
        .doc("Awards")
        .collection("CertBlocks")
        .doc(cert.id)
        .update({
          Name: cert.Name,
          Institution: cert.Institution,
          Desc: cert.Desc,
          Date: cert.Date,
        })
        .catch((err) => console.log(err));
    });

    // Dispatch
    dispatch(storeStudentAwardsAction(awardArray));
    dispatch(storeStudentCertsAction(certArray));

    history.push("/student-profile/awards");
  };

  // REMOVE
  const removeAward = (event) => {
    const awardID = event.target.getAttribute("id");

    // Remove from DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("AwardBlocks")
      .doc(awardID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allAwards = [...awards];
    const filtered = allAwards.filter((awd) => awd.id !== awardID);

    dispatch(storeStudentAwardsAction(filtered));
  };
  const removeCert = (event) => {
    const certID = event.target.getAttribute("id");

    // Remove from DB
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Awards")
      .collection("CertBlocks")
      .doc(certID)
      .delete()
      .catch((err) => console.log(err));

    // Dispatch
    const allCerts = [...certs];
    const filtered = allCerts.filter((cert) => cert.id !== certID);

    dispatch(storeStudentCertsAction(filtered));
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);

  return (
    <div>
      {/* Awards */}
      <div>
        <h2>Awards</h2>
        <div>{handleAwardsEdit()}</div>
        <div>{toggleNewAwardForm ? handleNewAward() : null}</div>
        <button onClick={() => dispatch(toggleStudentNewAwardFormAction())}>
          {toggleNewAwardForm ? "Close" : "Add Award"}
        </button>
      </div>

      {/* Certs */}
      <div>
        <h2>Certifications</h2>
        <div>{handleCertsEdit()}</div>
        <div>{toggleNewCertForm ? handleNewCert() : null}</div>
        <button onClick={() => dispatch(toggleStudentNewCertFormAction())}>
          {toggleNewCertForm ? "Close" : "Add Certification"}
        </button>
      </div>
      <br />
      <button onClick={saveAllChanges}>Save All Changes</button>
    </div>
  );
}
