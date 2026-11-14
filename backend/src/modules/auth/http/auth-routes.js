import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { asyncHandler } from "../../../shared/http/async-handler.js";

export function createAuthRouter({ login, register, getCurrentUser, authenticate }) {
  const router = Router();
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: { code: "RATE_LIMITED", message: "Espera unos minutos antes de volver a intentar." } }
  });

  router.post("/login", loginLimiter, asyncHandler(async (request, response) => {
    response.json({ data: await login(request.body) });
  }));

  router.post("/register", loginLimiter, asyncHandler(async (request, response) => {
    response.status(201).json({ data: await register(request.body) });
  }));

  router.get("/me", authenticate, asyncHandler(async (request, response) => {
    response.json({ data: await getCurrentUser(request.auth.userId) });
  }));

  return router;
}
