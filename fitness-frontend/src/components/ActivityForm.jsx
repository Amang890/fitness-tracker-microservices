import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import { addActivity } from "../services/api.js";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  // Get current local date and time
  const getLocalDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addActivity({
        ...activity,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        startTime: getLocalDateTime(),
      });

      onActivityAdded();

      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error("Failed to add activity:", error);

      if (error.response?.data) {
        console.error("Backend error:", error.response.data);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="activity-form"
    >
      <Typography className="form-title">
        Add New Activity
      </Typography>

      <div className="form-grid">

        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>

          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) =>
              setActivity({
                ...activity,
                type: e.target.value,
              })
            }
          >
            <MenuItem value="RUNNING">
              🏃 Running
            </MenuItem>

            <MenuItem value="WALKING">
              🚶 Walking
            </MenuItem>

            <MenuItem value="CYCLING">
              🚴 Cycling
            </MenuItem>

            <MenuItem value="SWIMMING">
              🏊 Swimming
            </MenuItem>

            <MenuItem value="WEIGHT_TRAINING">
              🏋️ Weight Training
            </MenuItem>

            <MenuItem value="YOGA">
              🧘 Yoga
            </MenuItem>

            <MenuItem value="HIIT">
              🔥 HIIT
            </MenuItem>

            <MenuItem value="CARDIO">
              ❤️ Cardio
            </MenuItem>

            <MenuItem value="STRETCHING">
              🤸 Stretching
            </MenuItem>

            <MenuItem value="OTHER">
              💪 Other
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          value={activity.duration}
          onChange={(e) =>
            setActivity({
              ...activity,
              duration: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          value={activity.caloriesBurned}
          onChange={(e) =>
            setActivity({
              ...activity,
              caloriesBurned: e.target.value,
            })
          }
        />

        <Button
          type="submit"
          variant="contained"
          className="add-button"
        >
          + ADD ACTIVITY
        </Button>

      </div>
    </Box>
  );
};

export default ActivityForm;