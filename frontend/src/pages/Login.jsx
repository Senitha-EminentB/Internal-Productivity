import { useAuth } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  Paper,
} from "@mui/material";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        backgroundColor: "background.default",
      }}
    >
      {/* Left side - Login Form */}
      <Paper
        elevation={4}
        sx={{
          width: "45%",
          minWidth: 320,
          maxWidth: 450,
          p: 6,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          boxShadow: 6,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 5, fontWeight: "700", color: "text.primary" }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 5, mb: 3, borderRadius: 2, fontWeight: "600" }}
          >
            Sign In
          </Button>

          <Box textAlign="right">
            <MuiLink
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ fontWeight: "500" }}
            >
              Don&apos;t have an account? Register
            </MuiLink>
          </Box>
        </Box>
      </Paper>

      {/* Right side - Purpose */}
      <Box
        sx={{
          width: "45%",
          minWidth: 320,
          ml: 6,
          p: 6,
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "700",
            color: "primary.main",
            letterSpacing: 0.5,
          }}
        >
          Our Purpose
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.15rem", lineHeight: 1.8, color: "text.secondary" }}
        >
          This internal dashboard provides your organization with an intuitive platform to monitor and
          visualize productivity metrics for teams and individual developers. Leveraging AI-driven insights
          and comprehensive performance analytics, it equips managers with the data needed to make informed,
          strategic decisions that drive organizational success.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
