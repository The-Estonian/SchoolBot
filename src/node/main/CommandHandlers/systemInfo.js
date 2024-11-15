const si = require('systeminformation');
import replyAndClean from '../CleanAfter/replyAndClean.js';
import { logErrorToFile } from '../Logging/logError.js';

const handleSystemInfo = async (message, args) => {
  try {
    const cpuLoad = await si.currentLoad();
    const mem = await si.mem();

    const cpuUsage = cpuLoad.currentLoad.toFixed(2);
    const totalMem = (mem.total / 1024 ** 3).toFixed(2);
    const usedMem = ((mem.total - mem.available) / 1024 ** 3).toFixed(2);

    let returnString = `**System Metrics:**
      - **CPU Usage**: ${cpuUsage}%
      - **Memory Usage**: ${usedMem} GB / ${totalMem} GB`;

    replyAndClean(message, `\`\`\`${returnString}\`\`\``);
  } catch (error) {
    replyAndClean(message, 'Error showing system information');
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleSystemInfo;
