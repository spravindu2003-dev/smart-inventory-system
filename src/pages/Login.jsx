import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../utils/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    let user = null;

    if (username === "admin" && password === "admin@2026") {
      user = { username: "admin", role: "admin" };
    }

    if (username === "worker" && password === "worker@2026") {
      user = { username: "worker", role: "worker" };
    }

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    setUser(user);

    // FORCE reload so app reads new user
    window.location.href = "/";
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.btn}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  box: {
    padding: 20,
    background: "#1e293b",
    borderRadius: 10,
    width: 300,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    width: "100%",
    padding: 10,
    background: "green",
    color: "white",
    border: "none",
  },
};

export default Login;