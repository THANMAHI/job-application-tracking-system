import dotenv from "dotenv";
dotenv.config();


import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const emailQueue = new Queue("email-queue", {
  connection,
});

export const sendEmailJob = async (data) => {
  console.log("QUEUE: Adding job", data);
  await emailQueue.add("send-email", data);
};
