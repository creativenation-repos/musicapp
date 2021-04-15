import React from 'react';

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

export default function FileManagerMain() {
    return (
        <div>
            {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      <h1>File Manager Main</h1>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
        </div>
    )
}
