// src/pages/auth/login/Login.jsx
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const resetMessage = () => setMessage("");

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;

    try {
      const resp = await axios.post(`${baseUrl}/admin/login`, { email, password });
      setMessage(resp.data.message);
      setType("success");

      const token = resp.headers.get("Authorization");
      if (resp.data.success) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(resp.data.user));
        login(resp.data.user);
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setType("error");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        background: "url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
        backgroundSize: "cover",
      }}
    >
      {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}

      <Box sx={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h2">Admin Login</Typography>
        </Box>

        <Paper sx={{ padding: "20px", margin: "10px" }}>
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              sx={{ mt: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            {touched.email && errors.email && (
              <Typography color="error" variant="body2">{errors.email}</Typography>
            )}

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              sx={{ mt: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            />
            {touched.password && errors.password && (
              <Typography color="error" variant="body2">{errors.password}</Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained">Submit</Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
