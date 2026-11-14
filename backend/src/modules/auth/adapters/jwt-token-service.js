import jwt from "jsonwebtoken";

export function makeJwtTokenService({ secret, expiresIn }) {
  const options = { audience: "yasta-web", issuer: "yasta-api" };
  return {
    sign(payload) {
      return jwt.sign({ role: payload.role }, secret, { ...options, subject: payload.sub, expiresIn });
    },
    verify(token) {
      const payload = jwt.verify(token, secret, options);
      return { userId: payload.sub, role: payload.role };
    }
  };
}
