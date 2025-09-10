// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Dummy allowed students (replace later with real DB)
  const allowedStudents = [
    { email: "student1@college.edu", password: "123456" },
    { email: "student2@college.edu", password: "abcdef" },
  ];

  const login = (email, password) => {
    const student = allowedStudents.find(
      (s) => s.email === email && s.password === password
    );
    if (student) {
      setUser(student);
      localStorage.setItem("user", JSON.stringify(student));
      return true; // success
    }
    return false; // failure
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
