import { exec } from 'child_process';
import replyAndClean from '../CleanAfter/replyAndClean.js';

const handleShutdown = async (message) => {
  replyAndClean(message, 'Shutting down production on: AWS EC2 Docker');
  exec('docker stop bot', (error, stdout, stderr) => {
    if (error) {
      replyAndClean(message, `${error.message}`);
    }
  });
};

export default handleShutdown;
