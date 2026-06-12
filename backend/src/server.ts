import dotenv from 'dotenv';
import app from './app';
import { setupUploadWorker } from './services/queue.service';
import { validateEnv } from './config/env';

dotenv.config();
validateEnv();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  setupUploadWorker();
});
