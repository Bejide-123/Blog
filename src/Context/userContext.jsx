import { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    username: "johndoe",
    preferences: {
      darkMode: false,
      emailNotifications: true,
      weeklyDigest: false,
      profilePublic: true,
      allowComments: true,
    }
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for easy access
export function useUser() {
  return useContext(UserContext);
}
