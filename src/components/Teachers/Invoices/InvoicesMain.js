import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import InvoiceBlock from "./InvoiceBlock";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {storeSingleInvoiceAction} from '../../../redux/actions';


export default function InvoicesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch()

  const invoiceState = useSelector(
    (state) => state.storeTeacherInvoicesGeneralInfoReducer
  );

  const viewSingleInvoice = (event) => {
    const invoiceNo = event.target.getAttribute('id');
    invoiceState.forEach(inv => {
      if (inv.No === invoiceNo) {
        dispatch(storeSingleInvoiceAction(inv));
        history.push('/teacher-invoice-view');
        return;
      }
    })
  }

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);
  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <div>
          <input id="tbInvoiceSearch" type="text" placeholder="Search" />
          <button>Create New Invoice</button>
        </div>

        <div>
          {invoiceState.map((inv, i) => {
            return (
              <div>
                <InvoiceBlock
                  key={i}
                  no={inv.No}
                  status={inv.Status}
                  balance={inv.Balance}
                  name={inv.Name}
                  created={inv.Created}
                  due={inv.Due}
                />
                <button id={inv.No} onClick={viewSingleInvoice}>View</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
