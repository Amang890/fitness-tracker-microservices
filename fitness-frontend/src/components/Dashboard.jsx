import React from "react";
import { Box, Typography } from "@mui/material";

const activityEmoji = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CYCLING: "🚴",
  SWIMMING: "🏊",
};

const Dashboard = ({ activities = [] }) => {
  const totalActivities = activities.length;

  const totalCalories = activities.reduce(
    (sum, activity) => sum + Number(activity.caloriesBurned || 0),
    0
  );

  const totalDuration = activities.reduce(
    (sum, activity) => sum + Number(activity.duration || 0),
    0
  );

  const totalSteps = activities.reduce(
    (sum, activity) =>
      sum + Number(activity.additionalMetrics?.steps || 0),
    0
  );

  const totalDistance = activities.reduce(
    (sum, activity) =>
      sum + Number(activity.additionalMetrics?.distanceKm || 0),
    0
  );

  const heartRates = activities
    .map((activity) =>
      Number(activity.additionalMetrics?.averageHeartRate || 0)
    )
    .filter((rate) => rate > 0);

  const averageHeartRate = heartRates.length
    ? Math.round(
        heartRates.reduce((sum, rate) => sum + rate, 0) /
          heartRates.length
      )
    : 0;

  const activityCounts = activities.reduce((counts, activity) => {
    counts[activity.type] = (counts[activity.type] || 0) + 1;
    return counts;
  }, {});

  const stats = [
    { icon: "🏃", value: totalActivities, label: "ACTIVITIES" },
    {
      icon: "🔥",
      value: totalCalories.toLocaleString(),
      label: "CALORIES",
    },
    { icon: "⏱️", value: totalDuration, label: "MINUTES" },
    {
      icon: "👟",
      value: totalSteps.toLocaleString(),
      label: "STEPS",
    },
    {
      icon: "📍",
      value: totalDistance.toFixed(1),
      label: "DISTANCE KM",
    },
    {
      icon: "❤️",
      value: averageHeartRate || "--",
      label: "AVG HEART RATE",
    },
  ];

  const today = new Date();

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const count = activities.filter((activity) => {
      const activityDate = new Date(
        activity.startTime || activity.createdAt
      );

      return (
        activityDate.getFullYear() === date.getFullYear() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getDate() === date.getDate()
      );
    }).length;

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count,
    };
  });

  const maxWeeklyCount = Math.max(
    ...weeklyData.map((item) => item.count),
    1
  );

  return (
    <Box className="dashboard-analytics">

      <Typography className="analytics-title">
        Your Fitness Overview
      </Typography>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">
              {stat.icon}
            </div>

            <div className="stat-info">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="analytics-grid">

        {/* WEEKLY ACTIVITY */}
        <div className="analytics-card">

          <Typography className="analytics-card-title">
            Weekly Activity
          </Typography>

          <div className="weekly-chart">

            {weeklyData.map((item) => (
              <div className="chart-column" key={item.day}>

                <span className="chart-value">
                  {item.count}
                </span>

                <div className="bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${
                        item.count > 0
                          ? Math.max(
                              (item.count / maxWeeklyCount) * 100,
                              15
                            )
                          : 5
                      }%`,
                    }}
                  />
                </div>

                <span className="chart-day">
                  {item.day}
                </span>

              </div>
            ))}

          </div>
        </div>

        {/* ACTIVITY BREAKDOWN */}
        <div className="analytics-card">

          <Typography className="analytics-card-title">
            Activity Breakdown
          </Typography>

          {Object.keys(activityCounts).length === 0 ? (
            <div className="empty-breakdown">
              Add your first workout to see your
              activity breakdown 💪
            </div>
          ) : (
            <div className="breakdown-list">

              {Object.entries(activityCounts).map(
                ([type, count]) => (
                  <div
                    className="breakdown-item"
                    key={type}
                  >

                    <div className="breakdown-name">

                      <span>
                        {activityEmoji[type] || "🏋️"}
                      </span>

                      <strong>{type}</strong>

                    </div>

                    <div className="breakdown-count">
                      {count}
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </Box>
  );
};

export default Dashboard;