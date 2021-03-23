import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { teachers_Collection } from "../../../utils/firebase";
import { firebaseLooper } from "../../../utils/tools";
import { storeInvoiceServicesAction } from "../../../redux/actions";

export default function InvoiceView() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  const invoice = useSelector((state) => state.storeSingleInvoiceReducer);

  const getAllServices = () => {
    const invoiceID = invoice.id;
    const services_Collection = teachers_Collection
      .doc(teacherAuthID)
      .collection("Invoices")
      .doc(invoiceID)
      .collection("Services");

    services_Collection
      .get()
      .then((snapshot) => {
        const data = firebaseLooper(snapshot);
        dispatch(storeInvoiceServicesAction(data));
      })
      .catch((err) => console.log(err));
  };

  const services = useSelector((state) => state.storeInvoiceServicesReducer);

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    } else if (!invoice) {
        history.push('/teacher-invoices');
        return;
    }
    getAllServices();
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <div>
        <div>
          <button
            onClick={() => {
              history.push("/teacher-invoices");
            }}
          >
            View All Invoices
          </button>
        </div>

        {/* Invoice Template */}
        <div>
          {/* Top */}
          <div>
            <h3>Invoice #{invoice.No}</h3>
            <p>
              Date Issued: {invoice.Created.toDate().toString().substr(4, 11)}
            </p>
            <p>Date Due: {invoice.Due.toDate().toString().substr(4, 11)}</p>
          </div>
          <hr />
          {/* Contact Details */}
          <div>
            <h4>Invoice To:</h4>
            <p>{invoice.Name}</p>
            <p>{invoice.Address}</p>
            <p>
              {invoice.City}, {invoice.State} {invoice.Zip}
            </p>
            <p>{invoice.Email}</p>
          </div>
          <hr/>
          {/* Services Details */}
          <div>
            <table>
              <tr>
                <th>Services</th>
                <th>Rate</th>
                <th>Hours</th>
                <th>Price</th>
              </tr>
              {services.map((serv, i) => {
                return (
                  <div key={i}>
                    <tr>
                      <td>{serv.Name}</td>
                      <td>${serv.Rate}</td>
                      <td>{serv.Hours} HRS</td>
                      <td>${serv.FullPrice}</td>
                    </tr>
                  </div>
                );
              })}
            </table>
          </div>
          <hr/>
          {/* Message */}
          <div>
              <p>{invoice.Message}</p>
          </div>
        </div>

        {/* Invoice Actions */}
        <div>
            <button>Send Invoice</button>
            <button>Print</button>
            <button>Edit</button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
