import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import { registerUser } from "../services/api.js";


function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match");

      return;
    }

    if (formData.password.length < 6) {

      setError(
        "Password must have at least 6 characters"
      );

      return;
    }


    try {

      setLoading(true);

      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      alert(
        "Registration successful! Please login."
      );

      navigate("/");

    } catch (error) {

      console.error(
        "Registration failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <Box className="register-page">

      <Box className="register-card">

        <Typography className="register-title">
          Create your account
        </Typography>

        <Typography className="register-subtitle">
          Start your fitness journey today.
        </Typography>


        {error && (

          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>

        )}


        <Box
          component="form"
          onSubmit={handleSubmit}
        >

          <Box className="register-row">

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

          </Box>


          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mt: 2 }}
          />


          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mt: 2 }}
          />


          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mt: 2 }}
          />


          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="register-button"
            sx={{ mt: 3 }}
          >
            {loading
              ? "CREATING ACCOUNT..."
              : "CREATE ACCOUNT →"}
          </Button>

        </Box>


        <Typography className="back-login">

          Already have an account?{" "}

          <Link
            to="/"
            className="register-link"
          >
            Login
          </Link>

        </Typography>

      </Box>

    </Box>

  );

}


export default Register;