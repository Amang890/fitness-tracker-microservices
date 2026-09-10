import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getActivityDetail } from "../services/api.js";

const ActivityDetail = ({ logOut }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box className="detail-page">
      <Button
        className="detail-back"
        onClick={() => navigate("/activities")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="detail-card">
        <CardContent>
          <Box className="detail-header">
            <Typography className="detail-type">
              {activity.type}
            </Typography>

            <Typography className="detail-meta">
              {activity.createdAt
                ? new Date(activity.createdAt).toLocaleString()
                : "Activity details"}
            </Typography>

            <Box className="detail-metrics">
              <Box className="detail-metric">
                <strong>{activity.duration}</strong>
                <div>Minutes</div>
              </Box>

              <Box className="detail-metric">
                <strong>{activity.caloriesBurned}</strong>
                <div>Calories</div>
              </Box>
            </Box>
          </Box>

          <Box className="ai-card">
            <Typography className="ai-title">
              🤖 AI Fitness Analysis
            </Typography>

            <Typography className="recommendation-text">
              {activity.recommendation ||
                "Your AI recommendation will appear here after analysis."}
            </Typography>

            {activity.improvements?.length > 0 && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="h6">💡 Improvements</Typography>
                <ul className="detail-list">
                  {activity.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {activity.suggestions?.length > 0 && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="h6">🎯 Suggestions</Typography>
                <ul className="detail-list">
                  {activity.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {activity.safety?.length > 0 && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="h6">🛡️ Safety Guidelines</Typography>
                <ul className="detail-list">
                  {activity.safety.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;
