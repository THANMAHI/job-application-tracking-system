import express from "express";
const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

import {
  applyToJobController,
  listMyApplicationsController,
  updateApplicationStageController,
  listJobApplicationsController,
  filterJobApplicationsController
} from "../controllers/application.controller.js";

// Candidate applies to a job
router.post(
  "/apply/:jobId",
  authMiddleware,
  allowRoles("CANDIDATE"),
  applyToJobController
);

// Candidate views their own applications
router.get(
  "/my-applications",
  authMiddleware,
  allowRoles("CANDIDATE"),
  listMyApplicationsController
);

// Recruiter updates application stage
router.put(
  "/stage/:id",
  authMiddleware,
  allowRoles("RECRUITER"),
  updateApplicationStageController
);

// Recruiter lists all applications for a job
router.get(
  "/job/:jobId",
  authMiddleware,
  allowRoles("RECRUITER", "HIRING_MANAGER"),
  listJobApplicationsController
);

// Recruiter filters applications by stage
router.get(
  "/job/:jobId/filter",
  authMiddleware,
  allowRoles("RECRUITER", "HIRING_MANAGER"),
  filterJobApplicationsController
);

export default router;
