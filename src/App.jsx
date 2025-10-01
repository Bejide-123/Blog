import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/PublicPage/LandingPage";
import Auth from "./Pages/PublicPage/Login";
import NavbarPrivate from "./Components/Private/Navbarprivate";

const App = () => {
  return (
    <Routes>
      {/* Landing page with sections + navbar */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth page */}
      <Route path="/login" element={<Auth />} />
      <Route path="/home" element={<NavbarPrivate />} />
    </Routes>
  );
};

export default App;
