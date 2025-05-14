const { RekognitionClient } = require("@aws-sdk/client-rekognition");
const rekognitionClient = new RekognitionClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});
module.exports = {rekognitionClient};