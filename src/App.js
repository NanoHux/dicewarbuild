import React from "react";
import PublicMint from "./PublicMint";
import DWTMint from "./DWTMint";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/DWTMint" element={<DWTMint />} />
        <Route exact path="/" element={<PublicMint />} />
      </Routes>
    </div>
  );
}

export default App;
