import firebase from "../utils/firebase";

export default function FirebaseDate(dateInput) {
  const dateSplit = dateInput.split("-");

  const date = firebase.firestore.Timestamp.fromDate(
    new Date(`${dateSplit[1]} ${dateSplit[2]}, ${dateSplit[0]}`)
  );


  return date;
}
