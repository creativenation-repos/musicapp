import React from 'react';

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function TutorialsMain() {
    return (
        <div>
            {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <h1>Tutorials Main</h1>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
        </div>
    )
}
