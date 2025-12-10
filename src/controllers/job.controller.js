import { createJob, updateJob, deleteJob, listJobs, getJob } from "../services/job.service.js";

export const createJobController = async (req, res) => {
  try {
    const job = await createJob(req.body, req.user);
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateJobController = async (req, res) => {
  try {
    const job = await updateJob(req.params.id, req.body, req.user);
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteJobController = async (req, res) => {
  try {
    await deleteJob(req.params.id, req.user);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listJobsController = async (req, res) => {
  const jobs = await listJobs();
  res.json(jobs);
};

export const getJobController = async (req, res) => {
  const job = await getJob(req.params.id);
  res.json(job);
};
