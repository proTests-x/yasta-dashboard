import { z } from "zod";
import { randomUUID } from "node:crypto";
import { AppError } from "../../../shared/domain/app-error.js";

const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(128)
});

export function makeLogin({ userRepository, passwordHasher, tokenService }) {
  return async function login(input) {
    const credentials = loginSchema.parse(input);
    const user = await userRepository.findByEmail(credentials.email);
    const passwordMatches = user && await passwordHasher.compare(credentials.password, user.passwordHash);
    if (!passwordMatches || !user.active) {
      throw new AppError("Correo o contraseña incorrectos.", { status: 401, code: "INVALID_CREDENTIALS" });
    }
    const token = tokenService.sign({ sub: user.id, role: user.role });
    return { token, user: publicUser(user) };
  };
}

export function makeGetCurrentUser({ userRepository }) {
  return async function getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user?.active) throw new AppError("Usuario no disponible.", { status: 404, code: "USER_NOT_FOUND" });
    return publicUser(user);
  };
}

const registerSchema = z.object({
  fullName: z.string().trim().min(3).max(100),
  businessName: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(10).max(128)
});

export function makeRegister({ userRepository, passwordHasher, tokenService }) {
  return async function register(input) {
    const data = registerSchema.parse(input);
    if (await userRepository.findByEmail(data.email)) {
      throw new AppError("Ya existe una cuenta con ese correo.", { status: 409, code: "EMAIL_IN_USE" });
    }
    const user = await userRepository.add({
      id: randomUUID(),
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email,
      passwordHash: await passwordHasher.hash(data.password),
      role: "owner",
      monthlyGoalCents: 0,
      planId: "plan_gratis",
      active: true
    });
    return { token: tokenService.sign({ sub: user.id, role: user.role }), user: publicUser(user) };
  };
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    businessName: user.businessName,
    role: user.role,
    monthlyGoalCents: user.monthlyGoalCents,
    planId: user.planId
  };
}
