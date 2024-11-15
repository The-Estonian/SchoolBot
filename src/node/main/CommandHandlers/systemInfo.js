import si from 'systeminformation';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import { logErrorToFile } from '../Logging/logError.js';

const handleSystemInfo = async (message, args) => {
  try {
    const cpuLoad = await si.currentLoad();
    const mem = await si.mem();

    const cpuUsage = cpuLoad.currentLoad.toFixed(2);
    const totalMem = (mem.total / 1024 ** 3).toFixed(2);
    const usedMem = ((mem.total - mem.available) / 1024 ** 3).toFixed(2);

    let returnString = `
┌───────────────────────────────────┐
│        System Metrics             │
├───────────────┬───────────────────┤
│ CPU Usage:    │ ${cpuUsage.padStart(5).padEnd(12)}%      │
├───────────────┼───────────────────┤
│ Memory Usage: │ ${usedMem.padStart(5)} GB / ${totalMem
      .padStart(5)
      .padEnd(12)} GB  │
└───────────────────────────────────┘`;

    replyAndClean(message, `\`\`\`${returnString}\`\`\``);
  } catch (error) {
    replyAndClean(message, 'Error showing system information');
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleSystemInfo;
