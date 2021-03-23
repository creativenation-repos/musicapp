import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {statisticsObjectAction} from '../../../redux/actions';

export default function StorageStats() {
  const history = useHistory();
  const dispatch = useDispatch();
  
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const storageState = useSelector(
    (state) => state.storeTeacherStatisticsGeneralInfoReducer
  );
  const storageObj = useSelector(state => state.statisticsObjectReducer);

  const getStorageObj = () => {
    storageState.forEach((obj) => {
      if (obj.id === 'StorageStats') {
        dispatch(statisticsObjectAction(obj));
      }
    })
  }

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
    }
    getStorageObj();
  }, []);

  return (
    <div>
      <div>
        <h1>Storage Statistics</h1>
        <hr />
        <p>Usage: {storageObj.Usage} MB</p>
      </div>
    </div>
  );
}
