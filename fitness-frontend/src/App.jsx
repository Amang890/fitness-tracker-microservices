import {
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "react-oauth2-code-pkce";

import { useDispatch } from "react-redux";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  Link,
} from "react-router";

import {
  setCredentials,
} from "./store/authSlice";

import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

import { getActivities } from "./services/api.js";

import "./App.css";

import fitnessHero from "./assets/fitness-hero.png";


const ActivitiesPage = ({ logOut }) => {

  const [refresh, setRefresh] =
    useState(0);

  const [activities, setActivities] =
    useState([]);


  const fetchActivities = async () => {

    try {

      const response =
        await getActivities();

      setActivities(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Failed to fetch activities:",
        error
      );

    }

  };


  useEffect(() => {
    fetchActivities();
  }, [refresh]);


  return (

    <Box className="dashboard-page">

      {/* HEADER */}

      <Box className="dashboard-header">

        <Box>

          <Typography className="brand">
            FIT<span>TRACK</span>
          </Typography>

          <Typography className="brand-subtitle">
            Your personal fitness companion
          </Typography>

        </Box>


        <Button
          variant="outlined"
          className="header-logout"
          onClick={() => logOut()}
        >
          LOGOUT
        </Button>

      </Box>


      {/* HERO */}

      <Box className="dashboard-hero">

        <Box>

          <Typography className="welcome-title">
            Keep moving. Keep growing. 👋
          </Typography>

          <Typography className="welcome-text">
            Track your workouts, understand
            your progress and get AI-powered
            recommendations to improve your
            fitness journey.
          </Typography>

        </Box>


        <Chip
          label="AI POWERED FITNESS"
          className="ai-chip"
        />

      </Box>


      {/* DASHBOARD */}

      <Dashboard
        activities={activities}
      />


      {/* ADD ACTIVITY */}

      <ActivityForm
        onActivityAdded={() =>
          setRefresh(
            (prev) => prev + 1
          )
        }
      />


      {/* RECENT ACTIVITIES */}

      <ActivityList
        activities={activities}
      />

    </Box>

  );
};


const AuthenticatedLayout = ({
  children,
}) => (

  <Box className="authenticated-page">
    {children}
  </Box>

);


function LoginPage({ logIn }) {

  return (

    <Box className="login-page">

      <Box className="login-content">

        <Box className="login-badge">
          ● SMART FITNESS TRACKER
        </Box>


        <Typography className="fitness-title">

          Build a stronger
          <br />

          <span>
            version of you.
          </span>

        </Typography>


        <Typography className="fitness-subtitle">
          Track. Improve. Achieve.
        </Typography>


        <Typography className="fitness-description">

          Track your daily activities,
          monitor calories and receive
          personalized AI-powered
          recommendations designed
          around your fitness journey.

        </Typography>


        <Button
          variant="contained"
          className="login-button"
          onClick={() => logIn()}
        >
          GET STARTED →
        </Button>


        {/* REGISTER LINK */}

        <Box className="register-link-container">

          <Typography>
            Don't have an account?{" "}

            <Link
              to="/register"
              className="register-link"
            >
              Register
            </Link>

          </Typography>

        </Box>


        <Box className="login-features">

          <Box>
            <strong>01</strong>
            <span>
              Track activities
            </span>
          </Box>

          <Box>
            <strong>02</strong>
            <span>
              Analyze progress
            </span>
          </Box>

          <Box>
            <strong>03</strong>
            <span>
              Improve smarter
            </span>
          </Box>

        </Box>

      </Box>


      {/* IMAGE */}

      <Box className="login-image-container">

        <img
          src={fitnessHero}
          alt="Fitness training"
          className="login-image"
        />


        <Box className="image-gradient" />


        <Box className="image-copy">

          <Typography className="image-kicker">
            YOUR FITNESS
          </Typography>

          <Typography className="image-title">
            Your journey.
          </Typography>

          <Typography className="image-small">
            One activity at a time.
          </Typography>

        </Box>


        <Box className="floating-stat">

          <strong>
            AI
          </strong>

          <span>
            Personalized
            <br />
            recommendations
          </span>

        </Box>

      </Box>

    </Box>

  );
}


function App() {

  const {
    token,
    tokenData,
    logIn,
    logOut,
  } = useContext(AuthContext);


  const dispatch =
    useDispatch();


  const location =
    useLocation();


  useEffect(() => {

    if (token) {

      dispatch(
        setCredentials({
          token,
          user: tokenData,
        })
      );

    }

  }, [
    token,
    tokenData,
    dispatch,
  ]);


  /*
   * USER IS NOT LOGGED IN
   *
   * Register page should still be accessible
   */

  if (!token) {

    return (

      <Routes>

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="*"
          element={
            <LoginPage
              logIn={logIn}
            />
          }
        />

      </Routes>

    );

  }


  return (

    <AuthenticatedLayout>

      <Routes>

        <Route
          path="/activities"
          element={
            <ActivitiesPage
              logOut={logOut}
            />
          }
        />


        <Route
          path="/activities/:id"
          element={
            <ActivityDetail
              logOut={logOut}
            />
          }
        />


        <Route
          path="/"
          element={
            <Navigate
              to="/activities"
              replace
            />
          }
        />

      </Routes>

    </AuthenticatedLayout>

  );
}


export default function AppWithRouter() {

  return (

    <Router>

      <App />

    </Router>

  );
}