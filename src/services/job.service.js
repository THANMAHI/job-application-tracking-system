import prisma from "../prisma/client.js";

export const createJob = async (data, user) => {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      status: "OPEN",
      companyId: user.companyId,      // recruiter’s company
      createdBy: user.id,             // recruiter id
    },
  });
};

export const updateJob = async (id, data, user) => {
  // verify job belongs to recruiter’s company
  const job = await prisma.job.findUnique({ where: { id: Number(id) } });
  if (!job || job.companyId !== user.companyId) {
    throw new Error("Access denied");
  }

  return prisma.job.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteJob = async (id, user) => {
  const job = await prisma.job.findUnique({ where: { id: Number(id) } });
  if (!job || job.companyId !== user.companyId) {
    throw new Error("Access denied");
  }

  return prisma.job.delete({
    where: { id: Number(id) },
  });
};

export const listJobs = async () => {
  return prisma.job.findMany({
    include: {
      company: true,
    },
  });
};

export const getJob = async (id) => {
  return prisma.job.findUnique({
    where: { id: Number(id) },
    include: {
      company: true,
    },
  });
};
