// config/rekognitionClient.js
const { RekognitionClient } = require("@aws-sdk/client-rekognition");
require("dotenv").config();

const rekognitionClient = new RekognitionClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

module.exports = {rekognitionClient};
