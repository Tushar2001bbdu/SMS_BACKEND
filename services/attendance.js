const students = require("../models/examresult");
const teachers = require("../models/teachers");
const { s3Client } = require("../config/s3Client");
const { rekognitionClient } = require("../config/rekognitionClient");
const { dynamoDBClient } = require("../config/dynamoDBClient");
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");

class attendance {
  static async updateAttendance(url, rollno) {
    rollno="121078899"
    const base64Data = url.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const key = `webcams/${Date.now()}/${rollno}.jpg`;

    const testing_params = {
      Bucket: "school-management-testing",
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
            Bucket: "school-management-testing",
            Name: key,
          },
        },
        MaxFaces: 5,
        FaceMatchThreshold: 95,
      });

      const response = await rekognitionClient.send(faceMatches);
      if (!response.FaceMatches || response.FaceMatches.length === 0) {
        const training_params = {
          Bucket: "school-managemengt-system-training",
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
          Bucket: "school-managemengt-system-training",
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

      if (data.Items && data.Items.length > 0) {
        let rollno = data.Items[0].RollNo.S;
        await this.setAttendance(rollno);
      } else {
        console.error('No matching RekognitionId found in DynamoDB');
      }
    } catch (error) {
      console.error(error);
    }
  }

  static async updateUserAttendance(user) {
    const time = Date.now();
    let currentDate = new Date(time).toISOString().split("T")[0];
    let updatedDate = new Date(user.attendance.updatedAt)
      .toISOString()
      .split("T")[0];
    updatedDate = updatedDate.substring(8, 10);

    if (updatedDate !== currentDate) {
      let attendance = user.attendance.value + 1;
      console.log('Updated Attendance:', attendance);
      user.attendance.value = attendance;
      user.attendance.updatedAt = currentDate;
      await user.save();
    }
  }

  static async setAttendance(rollno) {
    try {
      let validStudent = await students.findOne({ rollno: rollno });
      let validTeacher = await teachers.findOne({ rollno: rollno });

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
