import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (data) => {
  const { name, email, password, role, companyId } = data;

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      companyId: role === "CANDIDATE" ? null : companyId,
    },
  });

  return generateToken(user);
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  return generateToken(user);
};
