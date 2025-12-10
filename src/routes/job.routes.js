import express from "express";
import { 
  createJobController, 
  updateJobController, 
  deleteJobController, 
  listJobsController, 
  getJobController 
} from "../controllers/job.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public: List all jobs
router.get("/", listJobsController);

// Public: View single job
router.get("/:id", getJobController);

// Recruiter only: Create job
router.post(
  "/create",
  authMiddleware,
  allowRoles("RECRUITER"),
  createJobController
);

// Recruiter only: Update job
router.put(
  "/:id",
  authMiddleware,
  allowRoles("RECRUITER"),
  updateJobController
);

// Recruiter only: Delete job
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("RECRUITER"),
  deleteJobController
);

export default router;
