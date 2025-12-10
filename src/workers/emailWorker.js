import dotenv from "dotenv";
dotenv.config();


import { Worker } from "bullmq";
import { Redis } from "ioredis";
import nodemailer from "nodemailer";

// Redis connection with BullMQ-compatible options
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,   // REQUIRED FIX
  enableReadyCheck: false,      // STOPS redis warnings
});

console.log("Worker connected to Redis:", process.env.REDIS_URL);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, text } = job.data;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
      });
      console.log("Email sent:", to, subject);
    } catch (err) {
      console.error("Email error:", err);
    }
  },
  {
    connection,
  }
);

console.log("Email worker started...");
