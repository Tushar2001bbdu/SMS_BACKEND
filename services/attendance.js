const students = require("../models/examresult");
const teachers = require("../models/teachers");
const { S3Client } = require("@aws-sdk/client-s3");
const { RekognitionClient } = require("@aws-sdk/client-rekognition");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
 

const s3Client = new S3Client({
  region: process.env.REGION,
  maxRetries: 5,
  timeOut:3000000,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});

const rekognitionClient = new RekognitionClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});


const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AC2,
    secretAccessKey: process.env.K2,
  },
});
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");

class attendance {
  static async updateAttendance(url, rollno) {
    const base64Data = url.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const key = `webcams/${Date.now()}/${rollno}.jpg`;
    const testing_params = {
      Bucket: "schooltestingmanagement",
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
      Metadata: { rollno: rollno },
    };

    try {
      await s3Client.send(new PutObjectCommand(testing_params));

      const faceMatches = new SearchFacesByImageCommand({
        CollectionId: "smsusers",
        Image: {
          S3Object: {
            Bucket: "schooltestingmanagement",
            Name: key,
          },
        },
        MaxFaces: 5,
        FaceMatchThreshold: 95,
      });

      const response = await rekognitionClient.send(faceMatches);
      if (!response.FaceMatches || response.FaceMatches.length === 0) {
        const training_params = {
          Bucket: "schooltrainingmanagement",
          Key: key,
          Body: buffer,
          ContentType: "image/jpeg",
          Metadata: { rollno: rollno },
        };
        await s3Client.send(new PutObjectCommand(training_params));
      } else {
        const matchedFaceId = response.FaceMatches[0].Face.FaceId;
        await this.queryDynamoDB(matchedFaceId);
        
        const training_params = {
          Bucket: "schooltrainingmanagement",
          Key: key,
          Body: buffer,
          ContentType: "image/jpeg",
          Metadata: { rollno: rollno },
        };
        await s3Client.send(new PutObjectCommand(training_params));
      }
    } catch (error) {
      console.error('Error in updating attendance:', error);
    }
  }

  static async queryDynamoDB(RecognitionId) {
    try {
      const params = {
        TableName: "facerecognition",
        KeyConditionExpression: "RekognitionId = :value",
        ExpressionAttributeValues: {
          ":value": { S: RecognitionId },
        },
      };
      const data = await dynamoDBClient.send(new QueryCommand(params));
      console.log(data)
      if (data.Items && data.Items.length > 0) {
        let rollno = data.Items[0].RollNo.S;
        await this.setAttendance(rollno);
      } else {
        console.error('No matching RekognitionId found in DynamoDB');
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async updateUserAttendance(user) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const lastUpdated = new Date(user.attendance.updatedAt).toISOString().split("T")[0];

    if (today !== lastUpdated) {
      let attendance = user.attendance.value + 1;
     
      user.attendance.value = attendance;
      user.attendance.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    throw error;
  }
}
  static async setAttendance(rollno) {
    try {
      let validStudent = await students.findOne({ rollno: rollno });
      console.log(validStudent)
      let validTeacher = await teachers.findOne({ rollno: rollno });
      console.log(validTeacher)
      if (validStudent) {
        await this.updateUserAttendance(validStudent);
      }

      if (validTeacher) {
        await this.updateUserAttendance(validTeacher);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = attendance;
