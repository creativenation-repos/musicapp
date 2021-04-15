import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function GroupAboutView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.storeSingleGroupReducer);

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      <div>
        <h3>Host: {group.Host}</h3>
      </div>

      <div>
        <p>{group.Desc}</p>
        <button onClick={() => history.push("/teacher-group-page/about-edit")}>
          Edit
        </button>
      </div>
    </div>
  );
}
