import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

const INITIAL_USERS = [
  { id: "W-1042", name: "Alex Rivera", role: "worker", email: "worker@deliverfast.com", password: "worker123", vehicle: "Bike", phone: "+91 98765 43210", joinDate: "2023-03-15" },
  { id: "ADM-001", name: "Admin User", role: "admin", email: "admin@deliverfast.com", password: "admin123", phone: "+91 91234 56789", joinDate: "2022-01-01" },
];

function loadUsers() {
  try {
    const stored = localStorage.getItem("ds_users");
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  localStorage.setItem("ds_users", JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

function loadCurrentUser() {
  try {
    const stored = localStorage.getItem("ds_current_user");
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return null;
}

function saveUsers(users) {
  localStorage.setItem("ds_users", JSON.stringify(users));
}

function saveCurrentUser(user) {
  if (user) localStorage.setItem("ds_current_user", JSON.stringify(user));
  else localStorage.removeItem("ds_current_user");
}

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ds_dark") === "true");
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);

  const login = (user) => {
    setCurrentUser(user);
    saveCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
  };

  const toggleDark = () => {
    setDarkMode((d) => {
      localStorage.setItem("ds_dark", String(!d));
      return !d;
    });
  };

  const signup = (formData) => {
    const currentUsers = loadUsers();
    const exists = currentUsers.find((u) => u.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) return { success: false, message: "An account with this email already exists." };

    const isAdmin = formData.role === "admin";
    const newUser = {
      ...formData,
      id: isAdmin
        ? `ADM-${String(currentUsers.filter((u) => u.role === "admin").length + 1).padStart(3, "0")}`
        : `W-${1043 + currentUsers.filter((u) => u.role === "worker").length}`,
      joinDate: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    saveCurrentUser(newUser);
    return { success: true };
  };

  const updateUser = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    const updatedUsers = users.map((u) => u.id === updated.id ? updated : u);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUser(updated);
    saveCurrentUser(updated);
  };

  return (
    <AppContext.Provider value={{ darkMode, toggleDark, currentUser, login, logout, signup, updateUser, users }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
