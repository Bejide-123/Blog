import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/PublicPage/LandingPage";
import Auth from "./Pages/PublicPage/Login";
import FullPostPage from "./Pages/ProtectedPage/FullPostPage";
import SavedPage from "./Pages/ProtectedPage/SavedPage";
import ProfilePage from "./Pages/ProtectedPage/Profile";
// import Notifications from "./Pages/ProtectedPage/Notifications";

const App = () => {
  return (
    <Routes>
      {/* Landing page with sections + navbar */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth page */}
      <Route path="/login" element={<Auth />} />
      <Route path="/home" element={<FullPostPage/>} />
      <Route path="/saved" element={<SavedPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      {/* <Route path="/notifications" element={<Notifications/>} /> */}
    </Routes>
  );
};

export default App;
