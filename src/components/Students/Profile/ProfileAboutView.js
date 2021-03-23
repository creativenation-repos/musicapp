import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  storeStudentAboutAction,
  storeStudentExpAction,
} from "../../../redux/actions";
import { students_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";

export default function ProfileAboutView() {
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const about = useSelector((state) => state.storeStudentAboutReducer);
  const exps = useSelector((state) => state.storeStudentExpReducer);

  // GET
  const getAllStudentAbout = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        data.forEach((d) => {
          if (d.id === "About") {
            dispatch(storeStudentAboutAction(d));
          }
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllStudentExp = () => {
    students_Collection
      .doc(studentAuthID)
      .collection("Profile")
      .doc("Experience")
      .collection("ExpBlocks")
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeStudentExpAction(data));
      })
      .catch((err) => console.log(err));
  };

  //   HANDLE
  const handleExpBlocks = () => {
    return exps.map((exp, i) => {
      return (
        <div key={i}>
          <h3>{exp.Institution}</h3>
          <p>{exp.Desc}</p>
          <p>Started: {exp.Start.toDate().toString().substr(4, 11)}</p>
          <p>Ended: {exp.End.toDate().toString().substr(4, 11)}</p>
        </div>
      );
    });
  };
  const handleInstruments = () => {
    if (about.Instruments) {
      return about.Instruments.map((ins, i) => {
        return <li key={i}>{ins}</li>;
      });
    }
  };

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }

    getAllStudentAbout();
    getAllStudentExp();
  }, []);

  return (
    <div>
      <button onClick={() => history.push("/student-profile/about-edit")}>
        Edit
      </button>
      <br />
      {/* About */}
      <div>
        <h2>About</h2>
        <p>{about.About}</p>
      </div>

      {/* Experience */}
      <div>
        <h2>Experience</h2>
        <div>{handleExpBlocks()}</div>
      </div>

      {/* Personal */}
      <div>
        <h2>Personal</h2>
        <p>{about.Location}</p>
        <h2>Instruments</h2>
        {handleInstruments()}
        <p>
          Joined:{" "}
          {about.Joined ? about.Joined.toDate().toString().substr(4, 11) : null}
        </p>
      </div>
    </div>
  );
}
