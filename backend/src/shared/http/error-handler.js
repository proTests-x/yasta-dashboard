import { ZodError } from "zod";
import { AppError } from "../domain/app-error.js";

export function notFoundHandler(request, _response, next) {
  next(new AppError(`No existe ${request.method} ${request.originalUrl}.`, { status: 404, code: "NOT_FOUND" }));
}

export function errorHandler(error, request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Revisa los datos enviados.",
        details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))
      }
    });
  }

  const knownError = error instanceof AppError;
  const status = knownError ? error.status : 500;
  if (!knownError) request.log?.error({ err: error }, "Unhandled application error");
  return response.status(status).json({
    error: {
      code: knownError ? error.code : "INTERNAL_ERROR",
      message: knownError ? error.message : "Ocurrió un error inesperado.",
      ...(knownError && error.details ? { details: error.details } : {})
    }
  });
}
