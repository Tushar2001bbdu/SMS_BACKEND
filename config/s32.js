const { S3Client } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
  region: process.env.REGION,
  maxRetries: 5,
  timeOut:3000000,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});
module.exports = {s3Client};