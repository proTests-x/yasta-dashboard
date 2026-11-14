import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { createAuthRouter } from "./modules/auth/http/auth-routes.js";
import { createFinanceRouter } from "./modules/finance/http/finance-routes.js";
import { createPlanRouter } from "./modules/plans/http/plan-routes.js";
import { errorHandler, notFoundHandler } from "./shared/http/error-handler.js";

export function createApplication({ config, container }) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(pinoHttp({
    enabled: config.nodeEnv !== "test",
    redact: { paths: ["req.headers.authorization", "req.headers.cookie"], censor: "[Redacted]" }
  }));
  app.use(helmet());
  app.use(cors({ origin: config.frontendOrigin, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/v1/health", (_request, response) => {
    response.json({ data: { status: "ok", service: "yasta-api", timestamp: new Date().toISOString() } });
  });
  app.use("/api/v1/plans", createPlanRouter(container));
  app.use("/api/v1/auth", createAuthRouter(container));
  app.use("/api/v1/finance", createFinanceRouter(container));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
