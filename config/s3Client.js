
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.REGION,
  maxRetries: 5,
  timeOut:3000000,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

module.exports = {s3Client};

