import dotenv from 'dotenv';
import app from './app';
import { setupUploadWorker } from './services/queue.service';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Email verification system enabled');
  console.log('Password reset system enabled');

  setupUploadWorker();
});
