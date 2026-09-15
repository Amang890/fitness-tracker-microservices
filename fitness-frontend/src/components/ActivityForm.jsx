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
    additionalMetrics: {
      steps: "",
      distanceKm: "",
      avgHeartRate: "",
    },
  });

  const [errors, setErrors] = useState({
    duration: "",
    caloriesBurned: "",
    steps: "",
    distanceKm: "",
    avgHeartRate: "",
  });

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

  const validateField = (name, value) => {
    let error = "";

    if (value === "") {
      error = "This field is required";
    } else if (!/^\d+(\.\d+)?$/.test(value)) {
      error = "Please enter a valid number";
    } else if (Number(value) <= 0) {
      error = "Value must be greater than 0";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;

    setActivity((prev) => ({
      ...prev,
      duration: value,
    }));

    validateField("duration", value);
  };

  const handleCaloriesChange = (e) => {
    const value = e.target.value;

    setActivity((prev) => ({
      ...prev,
      caloriesBurned: value,
    }));

    validateField("caloriesBurned", value);
  };

  const handleMetricChange = (metric, value) => {
    setActivity((prev) => ({
      ...prev,
      additionalMetrics: {
        ...prev.additionalMetrics,
        [metric]: value,
      },
    }));

    validateField(metric, value);
  };

  const handleTypeChange = (value) => {
    setActivity((prev) => ({
      ...prev,
      type: value,
      additionalMetrics: {
        steps: "",
        distanceKm: "",
        avgHeartRate: "",
      },
    }));

    setErrors({
      duration: errors.duration,
      caloriesBurned: errors.caloriesBurned,
      steps: "",
      distanceKm: "",
      avgHeartRate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const durationValid = validateField(
      "duration",
      activity.duration
    );

    const caloriesValid = validateField(
      "caloriesBurned",
      activity.caloriesBurned
    );

    if (!durationValid || !caloriesValid) {
      return;
    }

    // Validate only fields which are visible/required
    let metricsValid = true;

    if (requiresDistance(activity.type)) {
      metricsValid =
        validateField(
          "distanceKm",
          activity.additionalMetrics.distanceKm
        ) && metricsValid;
    }

    if (requiresHeartRate(activity.type)) {
      metricsValid =
        validateField(
          "avgHeartRate",
          activity.additionalMetrics.avgHeartRate
        ) && metricsValid;
    }

    if (requiresSteps(activity.type)) {
      metricsValid =
        validateField(
          "steps",
          activity.additionalMetrics.steps
        ) && metricsValid;
    }

    if (!metricsValid) {
      return;
    }

    try {
      const cleanedMetrics = {};

      Object.entries(activity.additionalMetrics).forEach(
        ([key, value]) => {
          if (value !== "") {
            cleanedMetrics[key] = Number(value);
          }
        }
      );

      const response = await addActivity({
        ...activity,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        additionalMetrics: cleanedMetrics,
        startTime: getLocalDateTime(),
      });

      // Immediately add activity to the list
      onActivityAdded(response.data);

      // Reset form
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {
          steps: "",
          distanceKm: "",
          avgHeartRate: "",
        },
      });

      setErrors({
        duration: "",
        caloriesBurned: "",
        steps: "",
        distanceKm: "",
        avgHeartRate: "",
      });

    } catch (error) {
      console.error("Failed to add activity:", error);

      if (error.response?.data) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }
    }
  };

  const requiresDistance = (type) => {
    return [
      "RUNNING",
      "WALKING",
      "CYCLING",
      "SWIMMING",
    ].includes(type);
  };

  const requiresSteps = (type) => {
    return [
      "RUNNING",
      "WALKING",
    ].includes(type);
  };

  const requiresHeartRate = (type) => {
    return [
      "RUNNING",
      "WALKING",
      "CYCLING",
      "SWIMMING",
      "WEIGHT_TRAINING",
      "HIIT",
      "CARDIO",
      "YOGA",
    ].includes(type);
  };

  const isFormValid =
    activity.duration !== "" &&
    activity.caloriesBurned !== "" &&
    errors.duration === "" &&
    errors.caloriesBurned === "";

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

        {/* Activity Type */}

        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>

          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) =>
              handleTypeChange(e.target.value)
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

        {/* Duration */}

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          value={activity.duration}
          onChange={handleDurationChange}
          error={Boolean(errors.duration)}
          helperText={errors.duration}
          inputProps={{
            min: 1,
            step: 1,
          }}
        />

        {/* Calories */}

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          value={activity.caloriesBurned}
          onChange={handleCaloriesChange}
          error={Boolean(errors.caloriesBurned)}
          helperText={errors.caloriesBurned}
          inputProps={{
            min: 1,
            step: 1,
          }}
        />

        {/* Distance */}

        {requiresDistance(activity.type) && (
          <TextField
            fullWidth
            label="Distance (KM)"
            type="number"
            value={
              activity.additionalMetrics.distanceKm
            }
            onChange={(e) =>
              handleMetricChange(
                "distanceKm",
                e.target.value
              )
            }
            error={Boolean(errors.distanceKm)}
            helperText={errors.distanceKm}
            inputProps={{
              min: 0.1,
              step: 0.1,
            }}
          />
        )}

        {/* Steps */}

        {requiresSteps(activity.type) && (
          <TextField
            fullWidth
            label="Steps"
            type="number"
            value={
              activity.additionalMetrics.steps
            }
            onChange={(e) =>
              handleMetricChange(
                "steps",
                e.target.value
              )
            }
            error={Boolean(errors.steps)}
            helperText={errors.steps}
            inputProps={{
              min: 1,
              step: 1,
            }}
          />
        )}

        {/* Heart Rate */}

        {requiresHeartRate(activity.type) && (
          <TextField
            fullWidth
            label="Avg Heart Rate (BPM)"
            type="number"
            value={
              activity.additionalMetrics.avgHeartRate
            }
            onChange={(e) =>
              handleMetricChange(
                "avgHeartRate",
                e.target.value
              )
            }
            error={Boolean(errors.avgHeartRate)}
            helperText={errors.avgHeartRate}
            inputProps={{
              min: 40,
              max: 220,
              step: 1,
            }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          className="add-button"
          disabled={!isFormValid}
        >
          + ADD ACTIVITY
        </Button>

      </div>
    </Box>
  );
};

export default ActivityForm;