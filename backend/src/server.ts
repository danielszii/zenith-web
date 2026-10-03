import app from "./app.js";
import { testConnection } from "./config/database.js";

const port = Number(process.env.PORT || 3000);

async function startServer() {
  await testConnection();
  app.listen(port, () => {
    console.log(`Zenith API disponível em http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Não foi possível iniciar a API:", error);
  process.exit(1);
});
