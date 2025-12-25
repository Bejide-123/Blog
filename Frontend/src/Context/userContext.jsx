import { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // Function to generate avatar URL
  const generateAvatarUrl = (userData) => {
    if (!userData) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    const seed = userData.username || userData.email || userData.id || "user";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  // Wrapper function that adds avatar if missing
  const setUserWithAvatar = (userData) => {
    if (userData) {
      const userWithAvatar = {
        ...userData,
        avatar: userData.avatar || generateAvatarUrl(userData),
      };
      setUser(userWithAvatar);
      localStorage.setItem("user", JSON.stringify(userWithAvatar));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        try {
          const storedUser = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(storedUser);
        } catch (error) {
          console.error("Failed to parse user from storage event", error);
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserWithAvatar,
      logout,
      generateAvatarUrl 
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for easy access
export function useUser() {
  return useContext(UserContext);
}