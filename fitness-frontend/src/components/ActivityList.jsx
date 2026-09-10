import React from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";

const activityEmoji = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CYCLING: "🚴",
  SWIMMING: "🏊",
};

const ActivityList = ({ activities = [] }) => {
  const navigate = useNavigate();

  return (
    <>
      <Typography className="activity-section-title">
        Recent Activities
      </Typography>

      {activities.length === 0 ? (
        <div className="activity-card">
          <Typography>
            No activities yet. Add your first
            workout above! 💪
          </Typography>
        </div>
      ) : (
        <div className="activity-grid">

          {activities.map((activity) => (
            <div
              className="activity-card"
              key={activity.id}
              onClick={() =>
                navigate(
                  `/activities/${activity.id}`
                )
              }
            >

              <div className="activity-card-top">

                <span className="activity-icon">
                  {activityEmoji[
                    activity.type
                  ] || "🏋️"}
                </span>

                <span>→</span>

              </div>

              <Typography className="activity-type">
                {activity.type}
              </Typography>

              <Typography className="activity-date">

                {activity.startTime
                  ? new Date(
                      activity.startTime
                    ).toLocaleString()
                  : activity.createdAt
                  ? new Date(
                      activity.createdAt
                    ).toLocaleString()
                  : "Recent activity"}

              </Typography>

              <div className="activity-metrics">

                <div className="metric">

                  <strong>
                    {activity.duration}
                  </strong>

                  <span>
                    MINUTES
                  </span>

                </div>

                <div className="metric">

                  <strong>
                    {activity.caloriesBurned}
                  </strong>

                  <span>
                    CALORIES
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </>
  );
};

export default ActivityList;