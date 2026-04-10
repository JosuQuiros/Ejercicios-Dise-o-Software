import 'dotenv/config';
import { createApp } from './app.js';
import { connectMongo } from './config/database.js';
import { runSeed } from './seed/seed.js';

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amantes';

async function main() {
  await connectMongo(MONGODB_URI);
  await runSeed();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API amantes escuchando en http://127.0.0.1:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
