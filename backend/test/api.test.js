import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import request from "supertest";
import { createApplication } from "../src/app.js";
import { createContainer } from "../src/bootstrap/container.js";
import { loadConfig } from "../src/config/env.js";

describe("yasta API", () => {
  let app;
  before(async () => {
    const config = loadConfig({ NODE_ENV: "test", JWT_SECRET: "a-secure-test-secret-with-more-than-32-chars" });
    app = createApplication({ config, container: await createContainer(config) });
  });

  it("responde el chequeo de salud", async () => {
    const response = await request(app).get("/api/v1/health").expect(200);
    assert.equal(response.body.data.status, "ok");
  });

  it("publica los planes sin autenticación", async () => {
    const response = await request(app).get("/api/v1/plans").expect(200);
    assert.equal(response.body.data[0].name, "Gratis");
  });

  it("protege y sirve el resumen financiero", async () => {
    await request(app).get("/api/v1/finance/overview").expect(401);
    const session = await request(app).post("/api/v1/auth/login").send({ email: "demo@example.invalid", password: "YastaDemo2026!" }).expect(200);
    const response = await request(app).get("/api/v1/finance/overview").set("Authorization", `Bearer ${session.body.data.token}`).expect(200);
    assert.ok(response.body.data.incomeCents > 0);
    assert.ok(Array.isArray(response.body.data.recentTransactions));
  });
});
