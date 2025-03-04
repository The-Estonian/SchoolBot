import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'eu-central-1' });

export const logErrorToFile = async (error) => {
  const timeStamp = new Date().toISOString();
  const errorMessage = `[${timeStamp}] - ${error.stack || error}\n`;

  const params = {
    Bucket: 'school-discord-logs',
    Key: `error-logs/error-${timeStamp}.log`,
    Body: errorMessage,
    ContentType: 'text/plain',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log('Error log uploaded to S3 successfully.');
  } catch (s3Err) {
    console.error('Failed to upload error log to S3:', s3Err);
  }
};

export const userLogging = async (userTag, eventType) => {
  console.log('Logging user to AWS S3', userTag, eventType);

  const timeStamp = new Date().toISOString();
  const userLog = `[${timeStamp}] - ${eventType.toUpperCase()}: ${userTag}\n`;

  const params = {
    Bucket: 'school-discord-logs',
    Key: `user-logs/${eventType}/${userTag}-${timeStamp}.log`,
    Body: userLog,
    ContentType: 'text/plain',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log('Error log uploaded to S3 successfully.');
  } catch (s3Err) {
    console.error('Failed to upload error log to S3:', s3Err);
  }
};

export const commandLogging = async (userTag, command) => {
  console.log('Logging usercommand to AWS S3', userTag, command);

  const timeStamp = new Date().toISOString();
  const userLog = `[${timeStamp}] - ${command}: ${userTag}\n`;

  const params = {
    Bucket: 'school-discord-logs',
    Key: `command-logs/${userTag}-${command}-${timeStamp}.log`,
    Body: userLog,
    ContentType: 'text/plain',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log('Error log uploaded to S3 successfully.');
  } catch (s3Err) {
    console.error('Failed to upload error log to S3:', s3Err);
  }
};
