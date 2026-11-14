import { Router } from "express";
import { asyncHandler } from "../../../shared/http/async-handler.js";

export function createPlanRouter({ listPublicPlans }) {
  const router = Router();
  router.get("/", asyncHandler(async (_request, response) => {
    response.set("Cache-Control", "public, max-age=60, s-maxage=300");
    response.json({ data: await listPublicPlans() });
  }));
  return router;
}
