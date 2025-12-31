import React from "react";
import { UserProvider } from "./Context/userContext";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/PublicPage/LandingPage";
import Auth from "./Pages/PublicPage/Login";
import FullPostPage from "./Pages/ProtectedPage/FullPostPage";
import SavedPage from "./Pages/ProtectedPage/SavedPage";
import ProfilePage from "./Pages/ProtectedPage/Profile";
import PublicProfilePage from "./Pages/ProtectedPage/PublicProfile";
import CreatePostPage from "./Pages/ProtectedPage/CreatePost";
import DashboardPage from "./Pages/ProtectedPage/Dashboard";
import SettingsPage from "./Pages/ProtectedPage/Settings";
import Notifications from "./Pages/ProtectedPage/Notifications";
import { useTheme } from "./Context/themeContext";
import { Toaster } from "react-hot-toast";
import PostDetailsPage from "./Pages/PublicPage/PostDetails";

const App = () => {
  const { theme } = useTheme();
  return (
    <div className={theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}>
      <UserProvider>
        <Toaster />
        <Routes>
          {/* Landing page with sections + navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth page */}
          <Route path="/login" element={<Auth />} />
          <Route path="/home" element={<FullPostPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
        </Routes>
      </UserProvider>
    </div>
  );
};

export default App;
