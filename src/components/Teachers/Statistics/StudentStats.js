import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { statisticsObjectAction } from "../../../redux/actions";

export default function StudentStats() {
  const history = useHistory();
  const dispatch = useDispatch();

  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const storageState = useSelector(
    (state) => state.storeTeacherStatisticsGeneralInfoReducer
  );
  const storageObj = useSelector((state) => state.statisticsObjectReducer);

  const getStorageObj = () => {
    storageState.forEach((obj) => {
      if (obj.id === "StudentStats") {
        dispatch(statisticsObjectAction(obj));
      }
    });
  };

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
    }
    getStorageObj();
  }, []);
  return (
    <div>
      
      <h1>Student Stats</h1>
      <hr/>
      <p># of Students: {storageObj.Num}</p>
    </div>
  );
}
