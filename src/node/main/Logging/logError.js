import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const logErrorToFile = async (error) => {
  const timeStamp = new Date().toISOString();
  const errorMessage = `[${timeStamp}] - ${error.stack || error}\n`;

  const params = {
    Bucket: 'school-discord-logs', // Replace with your S3 bucket name
    Key: `error-logs/error-${timeStamp}.log`,
    Body: errorMessage,
    ContentType: 'text/plain',
  };

  try {
    // Upload the error message directly to S3
    await s3.putObject(params).promise();
    console.log('Error log uploaded to S3 successfully.');
  } catch (s3Err) {
    console.error('Failed to upload error log to S3:', s3Err);
  }
};

export const userLogging = async (userTag, eventType) => {
  console.log('Logging user to AWS S3', tag, eventType);

  const timeStamp = new Date().toISOString();
  const userLog = `[${timeStamp}] - ${eventType.toUpperCase()}: ${userTag}\n`;

  const params = {
    Bucket: 'school-discord-logs', // Replace with your S3 bucket name
    Key: `UserLogs/${eventType}/${userTag}-${timeStamp}.log`,
    Body: userLog,
    ContentType: 'text/plain',
  };

  try {
    // Upload the error message directly to S3
    await s3.putObject(params).promise();
    console.log('Error log uploaded to S3 successfully.');
  } catch (s3Err) {
    console.error('Failed to upload error log to S3:', s3Err);
  }
};
