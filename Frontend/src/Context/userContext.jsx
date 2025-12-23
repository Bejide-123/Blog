import { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Function to generate avatar URL
  const generateAvatarUrl = (userData) => {
    if (!userData) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    const seed = userData.username || userData.email || userData.id || "user";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  // Wrapper function that adds avatar if missing
  const setUserWithAvatar = (userData) => {
    if (userData && !userData.avatar) {
      // Create a new object to avoid mutating the original
      const userWithAvatar = {
        ...userData,
        avatar: generateAvatarUrl(userData),
      };
      setUser(userWithAvatar);
    } else {
      setUser(userData);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserWithAvatar,
      generateAvatarUrl // Optional: expose if needed elsewhere
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for easy access
export function useUser() {
  return useContext(UserContext);
}