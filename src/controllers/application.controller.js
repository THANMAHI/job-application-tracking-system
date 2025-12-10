import {
  applyToJob,
  listCandidateApplications,
  changeApplicationStage,
  listJobApplications,
  filterJobApplicationsByStage
} from "../services/application.service.js";

// Candidate applies to a job
export const applyToJobController = async (req, res) => {
  try {
    const result = await applyToJob(req.params.jobId, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Candidate views their applications
export const listMyApplicationsController = async (req, res) => {
  try {
    const apps = await listCandidateApplications(req.user.id);
    res.json(apps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Recruiter changes stage
export const updateApplicationStageController = async (req, res) => {
  try {
    const updated = await changeApplicationStage(
      req.params.id,
      req.body.stage,
      req.user
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Recruiter lists all applications for a job
export const listJobApplicationsController = async (req, res) => {
  try {
    const apps = await listJobApplications(req.params.jobId, req.user);
    res.json(apps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Recruiter filters applications by stage
export const filterJobApplicationsController = async (req, res) => {
  try {
    const apps = await filterJobApplicationsByStage(
      req.params.jobId,
      req.query.stage,
      req.user
    );
    res.json(apps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
