import { AppError } from "../domain/app-error.js";

export function makeAuthenticate(tokenService) {
  return (request, _response, next) => {
    const [scheme, token] = (request.headers.authorization ?? "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Necesitas iniciar sesión.", { status: 401, code: "UNAUTHORIZED" }));
    }
    try {
      request.auth = tokenService.verify(token);
      return next();
    } catch {
      return next(new AppError("La sesión venció o no es válida.", { status: 401, code: "INVALID_SESSION" }));
    }
  };
}
