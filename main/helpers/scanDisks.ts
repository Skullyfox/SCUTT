const { exec } = require('child_process');
import logger from '../logs/logger';

export default async () => {
  try {
    const drives: Array<string>= await new Promise((resolve, reject) => {
      exec('wmic logicaldisk get caption', (error, stdout, stderr) => {
        if (error) {
          logger.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
          reject(error);
        }
        if (stderr) {
          logger.error(`Erreur de la commande : ${stderr}`);
          reject(stderr);
        }

        const driveList = stdout
          .split('\n')
          .slice(1, -1)
          .map(drive => drive.trim())
          .filter(drive => drive !== '');

        resolve(driveList);
      });
    });

    return {
      disks: drives,
    };
  } catch (error) {
    logger.error(error);
    return {
      disks: [],
    };
  }
}
