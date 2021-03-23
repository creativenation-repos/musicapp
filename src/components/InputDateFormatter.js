export default function InputDateFormatter(firebaseDate) {
  const date = `${firebaseDate.toDate().getFullYear()}-${
    firebaseDate.toDate().getMonth() + 1 < 10 ? "0" : ""
  }${firebaseDate.toDate().getMonth() + 1}-${
    firebaseDate.toDate().getDate() < 10 ? "0" : ""
  }${firebaseDate.toDate().getDate()}`;

  return date;
}
