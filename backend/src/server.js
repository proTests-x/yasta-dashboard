import { createApplication } from "./app.js";
import { createContainer } from "./bootstrap/container.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig();
const container = await createContainer(config);
const app = createApplication({ config, container });
const server = app.listen(config.port, "127.0.0.1", () => {
  console.log(`yasta API lista en http://127.0.0.1:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} recibido; cerrando conexiones.`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
