import React from "react";

import PlanPanel from "./Plans/PlanPanel";
import Footer from './Footer';

import { useSelector, useDispatch } from "react-redux";
import { trueFalseAction } from "../redux/actions";

export default function Plans() {
  const planState = useSelector((state) => state.trueFalseReducer);
  const dispatch = useDispatch();

  return (
    <div>
      {/* Logo */}
      <div>
        <img src="" alt="" />
        <h1>Musicademy</h1>
      </div>

      {/* Main */}
      <div>
        <div>
          <h1>Check out our plans and subscribe to your best fit!</h1>
        </div>
        <div>
          <p>
            Choose the perfect plan based on your preferred subscription length.
          </p>
          <button onClick={() => dispatch(trueFalseAction())}>
            {planState ? "View Annual Plans" : "View Monthly Plans"}
          </button>
        </div>
        <div>
          {/* Monthly */}
          <div>
            {planState ? (
              <div>
                <PlanPanel
                  name="Free"
                  price="$0/mo"
                  desc="Best way to try out if Musicademy is best for you."
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
                <PlanPanel
                  name="Premium"
                  price="$19.99/mo"
                  desc="Best for students and teachers to launch a feature rich online platform."
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
                <PlanPanel
                  name="Pro"
                  price="$29.99/mo"
                  desc="Only available for teachers."
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
              </div>
            ) : (
              
              <div>
                  <PlanPanel
                  name="Free"
                  price="$0/yr"
                  desc="Blah Blah Blah"
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
                <PlanPanel
                  name="Premium"
                  price="$199.99/yr"
                  desc="Blah Blah Blah"
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
                <PlanPanel
                  name="Pro"
                  price="$299.99/yr"
                  desc="Blah Blah Blah"
                  list={[
                    "Preview access to one course.",
                    "Full access to Musicademy apps.",
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  );
}
