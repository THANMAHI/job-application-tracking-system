import prisma from "../prisma/client.js";
import { sendEmailJob } from "../queue/emailQueue.js";
import { isValidTransition } from "./workflow.service.js";

// Candidate applies to job
export const applyToJob = async (jobId, userId) => {
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) }
  });

  if (!job) throw new Error("Job not found");

  const existing = await prisma.application.findFirst({
    where: { jobId: Number(jobId), candidateId: userId }
  });

  if (existing) throw new Error("Already applied to this job");

  const application = await prisma.application.create({
    data: {
      jobId: Number(jobId),
      candidateId: userId,
      stage: "APPLIED"
    }
  });

  await prisma.applicationHistory.create({
    data: {
      applicationId: application.id,
      oldStage: null,
      newStage: "APPLIED",
      changedBy: userId,
      note: "Candidate applied"
    }
  });

  const candidate = await prisma.user.findUnique({ where: { id: userId } });
  const recruiter = await prisma.user.findFirst({
    where: { role: "RECRUITER", companyId: job.companyId }
  });

  // Queue emails
  await sendEmailJob({
    to: candidate.email,
    subject: "Application Submitted",
    text: `You applied for ${job.title}`
  });

  if (recruiter) {
    await sendEmailJob({
      to: recruiter.email,
      subject: "New Application Received",
      text: `A candidate applied for your job: ${job.title}`
    });
  }

  return application;
};

// Candidate lists their applications
export const listCandidateApplications = async (userId) => {
  return prisma.application.findMany({
    where: { candidateId: userId },
    include: {
      job: true,
      history: true
    }
  });
};

// Recruiter changes stage
export const changeApplicationStage = async (applicationId, newStage, recruiter) => {
  const application = await prisma.application.findUnique({
    where: { id: Number(applicationId) }
  });

  if (!application) throw new Error("Application not found");

  const job = await prisma.job.findUnique({
    where: { id: application.jobId }
  });

  if (job.companyId !== recruiter.companyId)
    throw new Error("Access denied");

  const currentStage = application.stage;

  if (newStage !== "REJECTED") {
    if (!isValidTransition(currentStage, newStage)) {
      throw new Error(`Invalid stage transition: ${currentStage} → ${newStage}`);
    }
  }

  const updated = await prisma.application.update({
    where: { id: Number(applicationId) },
    data: { stage: newStage }
  });

  await prisma.applicationHistory.create({
    data: {
      applicationId: updated.id,
      oldStage: currentStage,
      newStage,
      changedBy: recruiter.id
    }
  });

  const candidate = await prisma.user.findUnique({
    where: { id: application.candidateId }
  });

  await sendEmailJob({
    to: candidate.email,
    subject: "Application Stage Updated",
    text: `Your application changed from ${currentStage} to ${newStage}`
  });

  return updated;
};

// Recruiter lists all applications
export const listJobApplications = async (jobId, recruiter) => {
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) }
  });

  if (!job) throw new Error("Job not found");
  if (job.companyId !== recruiter.companyId)
    throw new Error("Access denied");

  return prisma.application.findMany({
    where: { jobId: Number(jobId) },
    include: { candidate: true, history: true }
  });
};

// Recruiter filters applications by stage
export const filterJobApplicationsByStage = async (jobId, stage, recruiter) => {
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) }
  });

  if (!job) throw new Error("Job not found");
  if (job.companyId !== recruiter.companyId)
    throw new Error("Access denied");

  return prisma.application.findMany({
    where: { jobId: Number(jobId), stage },
    include: { candidate: true, history: true }
  });
};
