import app from "./app.js";
import { testConnection } from "./config/database.js";
import { env } from "./config/env.js";

const port = env.port;

async function startServer() {
  await testConnection();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Zenith API disponível em http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Não foi possível iniciar a API:", error);
  process.exit(1);
});
