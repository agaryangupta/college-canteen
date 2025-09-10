// src/pages/LoginPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Please enter your college email");
      return;
    }
    if (!email.endsWith("@abes.ac.in")) {
      alert("Please use your college email (ending with @abes.ac.in)");
      return;
    }

    const user = { email, role };
    localStorage.setItem("user", JSON.stringify(user));

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/canteens");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        background: "linear-gradient(135deg, #FFE1A8, #FF6F61)", // warm food colors
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          marginBottom: "30px",
          color: "#fff",
          fontSize: "2.5rem",
          textShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        ABES Canteen
      </motion.h1>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          minWidth: "300px",
        }}
      >
        <input
          type="email"
          placeholder="Enter college email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "1rem",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: "12px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          style={{
            padding: "12px",
            marginTop: "20px",
            cursor: "pointer",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #FF6F61, #FFB347)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          Login
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: "20px",
          color: "#fff",
          fontStyle: "italic",
          textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        Fresh food, fast orders! 🍔🍕🥤
      </motion.p>
    </div>
  );
}

export default LoginPage;
