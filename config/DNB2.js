const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});
module.exports = {dynamoDBClient};