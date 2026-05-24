import { useState } from "react";
import api from "../utils/api";

const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) =>{
        e.preventDefault();

        try {
            const res = await api.post("/auth/login",{
                email,
                password
            })

            localStorage.setItem("jwtToken", res.data.token);
            localStorage.setItem("token", res.data.token);

            alert("Login successful");
            window.location.href = "/";
        
        } catch (error) {
            console.log(error);
            alert("Login failed");
        }
    }

 return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;