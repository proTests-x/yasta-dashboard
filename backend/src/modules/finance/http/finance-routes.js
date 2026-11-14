import { Router } from "express";
import { asyncHandler } from "../../../shared/http/async-handler.js";

export function createFinanceRouter(useCases) {
  const router = Router();
  router.use(useCases.authenticate);

  router.get("/overview", asyncHandler(async (request, response) => {
    response.json({ data: await useCases.getOverview(request.auth.userId, request.query.month) });
  }));

  router.get("/transactions", asyncHandler(async (request, response) => {
    response.json({ data: await useCases.listTransactions(request.auth.userId, { month: request.query.month }) });
  }));

  router.post("/transactions", asyncHandler(async (request, response) => {
    response.status(201).json({ data: await useCases.addTransaction(request.auth.userId, request.body) });
  }));

  router.delete("/transactions/:transactionId", asyncHandler(async (request, response) => {
    await useCases.deleteTransaction(request.auth.userId, request.params.transactionId);
    response.status(204).end();
  }));

  router.get("/receivables", asyncHandler(async (request, response) => {
    response.json({ data: await useCases.listReceivables(request.auth.userId) });
  }));

  router.post("/receivables", asyncHandler(async (request, response) => {
    response.status(201).json({ data: await useCases.addReceivable(request.auth.userId, request.body) });
  }));

  return router;
}
