import {
  Box,
  Typography,
} from "@mui/material";

import React from "react";

const Dashboard = ({ activities = [] }) => {

  // =========================
  // BASIC STATISTICS
  // =========================

  const totalActivities = activities.length;

  const totalCalories = activities.reduce(
    (total, activity) =>
      total + Number(activity.caloriesBurned || 0),
    0
  );

  const totalMinutes = activities.reduce(
    (total, activity) =>
      total + Number(activity.duration || 0),
    0
  );


  // =========================
  // ADDITIONAL METRICS
  // =========================

  const totalSteps = activities.reduce(
    (total, activity) =>
      total +
      Number(
        activity.additionalMetrics?.steps || 0
      ),
    0
  );


  const totalDistance = activities.reduce(
    (total, activity) =>
      total +
      Number(
        activity.additionalMetrics?.distanceKm || 0
      ),
    0
  );


  const heartRateActivities = activities.filter(
    (activity) =>
      Number(
        activity.additionalMetrics?.avgHeartRate || 0
      ) > 0
  );


  const averageHeartRate =
    heartRateActivities.length > 0
      ? Math.round(
          heartRateActivities.reduce(
            (total, activity) =>
              total +
              Number(
                activity.additionalMetrics
                  ?.avgHeartRate || 0
              ),
            0
          ) / heartRateActivities.length
        )
      : 0;


  // =========================
  // WEEKLY ACTIVITY
  // =========================

  const today = new Date();

  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {

    const date = new Date(today);

    date.setHours(0, 0, 0, 0);

    date.setDate(
      today.getDate() - i
    );

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();


    const count = activities.filter(
      (activity) => {

        if (!activity.startTime) {
          return false;
        }

        const activityDate =
          new Date(activity.startTime);

        return (
          activityDate.getFullYear() === year &&
          activityDate.getMonth() === month &&
          activityDate.getDate() === day
        );
      }
    ).length;


    weeklyData.push({
      day: date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
      count,
    });
  }


  const maxWeeklyCount = Math.max(
    ...weeklyData.map(
      (item) => item.count
    ),
    1
  );


  // =========================
  // ACTIVITY BREAKDOWN
  // =========================

  const activityBreakdown =
    activities.reduce(
      (result, activity) => {

        const type =
          activity.type || "OTHER";

        result[type] =
          (result[type] || 0) + 1;

        return result;

      },
      {}
    );


  // =========================
  // ACTIVITY EMOJIS
  // =========================

  const getActivityEmoji = (type) => {

    const emojis = {
      RUNNING: "🏃",
      WALKING: "🚶",
      CYCLING: "🚴",
      SWIMMING: "🏊",
      WEIGHT_TRAINING: "🏋️",
      YOGA: "🧘",
      HIIT: "🔥",
      CARDIO: "❤️",
      STRETCHING: "🤸",
      OTHER: "💪",
    };

    return emojis[type] || "💪";
  };


  return (
    <Box className="dashboard-container">

      {/* =========================
          TITLE
      ========================= */}

      <Typography className="section-title">
        Your Fitness Overview
      </Typography>


      {/* =========================
          STAT CARDS
      ========================= */}

      <Box className="stats-grid">

        {/* ACTIVITIES */}

        <Box className="stat-card">

          <Box className="stat-icon">
            🏃
          </Box>

          <Box>

            <Typography className="stat-value">
              {totalActivities}
            </Typography>

            <Typography className="stat-label">
              ACTIVITIES
            </Typography>

          </Box>

        </Box>


        {/* CALORIES */}

        <Box className="stat-card">

          <Box className="stat-icon">
            🔥
          </Box>

          <Box>

            <Typography className="stat-value">
              {totalCalories.toLocaleString()}
            </Typography>

            <Typography className="stat-label">
              CALORIES
            </Typography>

          </Box>

        </Box>


        {/* MINUTES */}

        <Box className="stat-card">

          <Box className="stat-icon">
            ⏱️
          </Box>

          <Box>

            <Typography className="stat-value">
              {totalMinutes}
            </Typography>

            <Typography className="stat-label">
              MINUTES
            </Typography>

          </Box>

        </Box>


        {/* STEPS */}

        <Box className="stat-card">

          <Box className="stat-icon">
            👟
          </Box>

          <Box>

            <Typography className="stat-value">
              {totalSteps.toLocaleString()}
            </Typography>

            <Typography className="stat-label">
              STEPS
            </Typography>

          </Box>

        </Box>


        {/* DISTANCE */}

        <Box className="stat-card">

          <Box className="stat-icon">
            📍
          </Box>

          <Box>

            <Typography className="stat-value">
              {totalDistance.toFixed(1)}
            </Typography>

            <Typography className="stat-label">
              DISTANCE KM
            </Typography>

          </Box>

        </Box>


        {/* HEART RATE */}

        <Box className="stat-card">

          <Box className="stat-icon">
            ❤️
          </Box>

          <Box>

            <Typography className="stat-value">
              {averageHeartRate > 0
                ? averageHeartRate
                : "--"}
            </Typography>

            <Typography className="stat-label">
              AVG HEART RATE
            </Typography>

          </Box>

        </Box>

      </Box>


      {/* =========================
          CHARTS
      ========================= */}

      <Box className="dashboard-charts">


        {/* =========================
            WEEKLY ACTIVITY
        ========================= */}

        <Box className="chart-card">

          <Typography className="chart-title">
            Weekly Activity
          </Typography>


          <Box className="weekly-chart">

            {weeklyData.map(
              (item, index) => {

                const barHeight =
                  item.count === 0
                    ? 5
                    : Math.max(
                        (item.count /
                          maxWeeklyCount) *
                          150,
                        15
                      );


                return (

                  <Box
                    key={index}
                    className="weekly-column"
                  >

                    {/* COUNT */}

                    <Typography className="weekly-count">
                      {item.count}
                    </Typography>


                    {/* BAR */}

                    <Box
                      className="weekly-bar"
                      style={{
                        height:
                          `${barHeight}px`,
                      }}
                    />


                    {/* DAY */}

                    <Typography className="weekly-day">
                      {item.day}
                    </Typography>

                  </Box>

                );
              }
            )}

          </Box>

        </Box>


        {/* =========================
            ACTIVITY BREAKDOWN
        ========================= */}

        <Box className="chart-card">

          <Typography className="chart-title">
            Activity Breakdown
          </Typography>


          <Box className="breakdown-list">

            {Object.entries(
              activityBreakdown
            )
              .sort(
                (a, b) => b[1] - a[1]
              )
              .map(
                ([type, count]) => (

                  <Box
                    key={type}
                    className="breakdown-item"
                  >

                    <Typography
                      className="breakdown-name"
                    >

                      {getActivityEmoji(type)}

                      {" "}

                      {type
                        .replaceAll(
                          "_",
                          " "
                        )}

                    </Typography>


                    <Box className="breakdown-count">
                      {count}
                    </Box>

                  </Box>

                )
              )}


            {activities.length === 0 && (

              <Typography
                sx={{
                  color: "#777",
                  textAlign: "center",
                  padding: "30px 0",
                }}
              >
                No activities yet.
              </Typography>

            )}

          </Box>

        </Box>

      </Box>

    </Box>
  );
};

export default Dashboard;