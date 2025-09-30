import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/PublicPage/LandingPage";
import Auth from "./Pages/PublicPage/Login";

const App = () => {
  return (
    <>

      <LandingPage />
      <Routes>
        {/* Landing page */}
        

        {/* Auth page (Login + Signup) */}
        <Route path="/login" element={<Auth />} />
      </Routes>
    </>
  );
};

export default App;
