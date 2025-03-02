import { exec } from 'child_process';
import replyAndClean from '../CleanAfter/replyAndClean.js';

const handleShutdown = async (message) => {
  replyAndClean(message, 'Shutting down production on: AWS EC2 Docker');
  process.exit(0);
};

export default handleShutdown;
