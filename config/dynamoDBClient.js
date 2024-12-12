const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

module.exports = {dynamoDBClient};
