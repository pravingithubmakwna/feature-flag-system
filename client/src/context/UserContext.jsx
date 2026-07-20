import { createContext, useContext, useMemo, useState } from "react";

const DEMO_USERS = [
  {
    id: "alice@company.com",
    name: "Alice (Admin)",
    email: "alice@company.com",
    role: "admin",
  },
  {
    id: "bob@company.com",
    name: "Bob (Beta)",
    email: "bob@company.com",
    role: "beta",
  },
  {
    id: "carol@company.com",
    name: "Carol (User)",
    email: "carol@company.com",
    role: "user",
  },
  {
    id: "dave@company.com",
    name: "Dave (User)",
    email: "dave@company.com",
    role: "user",
  },
];

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(DEMO_USERS[2]); // Carol by default

  const value = useMemo(
    () => ({
      user,
      setUser,
      users: DEMO_USERS,
      context: {
        userId: user.email,
        email: user.email,
        role: user.role,
      },
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
