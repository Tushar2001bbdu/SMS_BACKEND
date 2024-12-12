const students = require("../models/examresult");
const teachers = require("../models/teachers");
const { s3Client } = require("../config/s3Client");
const { rekognitionClient } = require("../config/rekognitionClient");
const { dynamoDBClient } = require("../config/dynamoDBClient");
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const { SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");

class attendance {
  static async updateAttendance(url,rollno) {
    const base64Data = url.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const key = `webcams/${Date.now()}.jpg`;
    const training_params = {
      Bucket: "schools-management-system-bucket",
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
      Metadata: { rollno: rollno },
    };

    const testing_params = {
      Bucket: "school-management-system-bucket-testing",
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
            Bucket: "school-management-system-bucket-testing",
            Name: `webcams/${key}.jpg`,
          },
        },
        MaxFaces: 5,

        FaceMatchThreshold: 95,
      });

      const response = await rekognitionClient.send(faceMatches);

      if (!response.FaceMatches || response.FaceMatches.length === 0) {
        throw error;
      } else {
        const matchedFaceId = response.FaceMatches[0].Face.FaceId; // Get RekognitionId (FaceId)
        await this.queryDynamoDB(matchedFaceId);
        await s3Client.send(new PutObjectCommand(training_params));
      }
    } catch (error) {
      console.error(error);
    }
  }
  static async  queryDynamoDB(RecognitionId) {
    try {
      const params = {
        TableName: "facerecognition",

        KeyConditionExpression: "RekognitionId = :value",
        ExpressionAttributeValues: {
          ":value": { S: RecognitionId },
        },
      };
      const data = await dynamoDBClient.send(new QueryCommand(params));

      let rollno = data.Items[0].RollNo.S;
      this.setAttendance(rollno);
    } catch (error) {
      console.error(error);
    }
  }
  static async setAttendance(rollno) {
    try {
      let attendance;
      let validStudent = await students.findOne({ rollno: rollno });
      let validTeacher = await teachers.findOne({ rollno: rollno });
      const time = Date.now();
      let currentDate = new Date(time).toISOString().split("T")[0];

      if (validStudent) {
        let studentUpdatedDate = new Date(validStudent.attendance.updatedAt)
          .toISOString()
          .split("T")[0];
        studentUpdatedDate = studentUpdatedDate.substring(8, 10);
        console.log(studentUpdatedDate);
        if (studentUpdatedDate !== currentDate) {
          attendance = validStudent.attendance.value + 1;
          validStudent.attendance.value = attendance;
          validStudent.attendance.updatedAt = currentDate;
          await validStudent.save();
        }
      }

      // If it's a teacher
      if (validTeacher) {
        // Convert the stored `updatedAt` to YYYY-MM-DD format
        let teacherUpdatedDate = new Date(validTeacher.attendance.updatedAt)
          .toISOString()
          .split("T")[0];

        if (teacherUpdatedDate !== currentDate) {
          attendance = validTeacher.attendance.value + 1;
          validTeacher.attendance.value = attendance;
          validTeacher.attendance.updatedAt = currentDate;
          await validTeacher.save();
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = attendance;
