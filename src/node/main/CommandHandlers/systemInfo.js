import si from 'systeminformation';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import { logErrorToFile } from '../Logging/logError.js';

const handleSystemInfo = async (message, args) => {
  try {
    const cpuLoad = await si.currentLoad();
    const mem = await si.mem();

    const cpuUsage = Math.round(cpuLoad.currentLoad * 100);
    const totalMem = (mem.total / 1024 ** 3).toFixed(2);
    const usedMem = ((mem.total - mem.available) / 1024 ** 3).toFixed(2);

    let returnString = `
┌───────────────────────────────────┐
│        System Metrics             │
├───────────────┬───────────────────┤
│ CPU Usage:    │ ${cpuUsage.toString().padStart(1) + '%'.padEnd(12)}    │
├───────────────┼───────────────────┤
│ Memory Usage: │ ${usedMem.padStart(3)}GB / ${totalMem + 'GB'.padEnd(5)}│
└───────────────────────────────────┘`;

    replyAndClean(message, `\`\`\`${returnString}\`\`\``);
  } catch (error) {
    replyAndClean(message, 'Error showing system information');
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleSystemInfo;