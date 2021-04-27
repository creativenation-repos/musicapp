import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import "./FileUpload.css";
import RandomString from "./RandomString";

export const programUpload = () => {
  const file = document.querySelector(`#select`).files[0];

  if (file) {
    let name = document.querySelector(`#fileName`).value;
    if (name === "") {
      name = file.name;
    }
    const metadata = {
      contentType: file.type,
    };

    // Storage Ref
    let ref;

    if (file.type === "video/mp4") {
      ref = firebase.storage().ref("Videos/");
      if (name !== file.name) {
        name = name + ".mp4";
      }
    } else if (file.type === "audio/mpeg") {
      ref = firebase.storage().ref("Audio/");
      if (name !== file.name) {
        name = name + ".mp3";
      }
    } else if (file.type === "image/jpeg") {
      ref = firebase.storage().ref("Images/");
      if (name !== file.name) {
        name = name + ".jpg";
      }
    } else if (file.type === "image/png") {
      ref = firebase.storage().ref("Images/");
      if (name !== file.name) {
        name = name + ".png";
      }
    } else if (file.type === "application/pdf") {
      ref = firebase.storage().ref("PDF/");
      if (name !== file.name) {
        name = name + ".pdf";
      }
    }

    const task = ref.child(name).put(file, metadata);
    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        console.log(url);
      })
      .catch(console.error);

    return name;
  }
};

export default function FileUpload() {
  return (
    <div>
      <input id={`select`} type="file" />
      <p className="smallDesc">
        Enter an optional custom file name. Leaving the field blank will use the
        current file name.
      </p>
      <input id="fileName" type="text" placeholder="Type file name.." />
    </div>
  );
}
