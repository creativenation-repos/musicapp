import firebase from "../utils/firebase";

export default function GetToday() {
  return firebase.firestore.Timestamp.fromDate(new Date());
}
