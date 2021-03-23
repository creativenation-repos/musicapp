import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { users_Collection } from "../../utils/firebase";

export default function TopBar() {
  const user = useSelector((state) => state.storeStudentUserDataReducer);
  const studentAuthID = useSelector((state) => state.storeStudentAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!studentAuthID) {
      history.push("/studentdash");
      return;
    }
  }, []);

  return (
    <div>
      <div>
        <button>New Message</button>
        <button>Schedule Lesson</button>
      </div>
      <div>
        <button>Search</button>
      </div>
      <div>
        <p>
          {user.FirstName} {user.LastName}
        </p>
        <p>{user.AccountType}</p>
      </div>
    </div>
  );
}
