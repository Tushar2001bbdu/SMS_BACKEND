const { s3Client } = require("../config/s3Client");
const {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const { rekognitionClient } = require("../config/rekognitionClient");
const sharp = require("sharp");

class Exam {
  static async sendFrame(url, rollno) {
    try {
      // Convert Base64 URL to Buffer
      const base64Data = url.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Resize and compress the image
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1024, height: 768, fit: "inside" }) // Resize to 1024x768 or smaller
        .jpeg({ quality: 80 }) // Compress with 80% quality
        .toBuffer();

      console.log(
        `Compressed image size: ${compressedBuffer.length / 1024 / 1024} MB`
      );

      const key = `webcams/${Date.now()}.jpg`;

      // Check if the image is small enough for single-part upload
      if (compressedBuffer.length <= 5 * 1024 * 1024) {
        // Upload directly if the size <= 5 MB
        return this.uploadSinglePart(compressedBuffer, key, rollno);
      } else {
        // Use multipart upload for larger files
        return this.uploadMultipart(compressedBuffer, key, rollno);
      }
    } catch (error) {
      console.error("Error sending frame:", error);
      throw new Error("Error sending frame");
    }
  }

  static async uploadSinglePart(buffer, key, rollno) {
    try {
      const frames_bucket = {
        Bucket: "examframebuckets",
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
        Metadata: { rollno: rollno },
      };
      await s3Client.send(new PutObjectCommand(frames_bucket));
      return this.detectFraud(key);
    } catch (error) {
      console.error("Error in single-part upload:", error);
      throw error;
    }
  }

  static async uploadMultipart(buffer, key, rollno) {
    const startCommand = new CreateMultipartUploadCommand({
      Bucket: "examframebuckets",
      Key: key,
      ContentType: "image/jpeg",
      Metadata: { rollno: rollno },
    });
    const { UploadId } = await s3Client.send(startCommand);

    const partSize = 5 * 1024 * 1024; // 5 MB per part
    const parts = [];
    try {
      for (let i = 0; i < buffer.length; i += partSize) {
        const partBuffer = buffer.slice(i, i + partSize);
        const uploadPartCommand = new UploadPartCommand({
          Bucket: "examframebuckets",
          Key: key,
          PartNumber: parts.length + 1,
          UploadId,
          Body: partBuffer,
        });
        const { ETag } = await s3Client.send(uploadPartCommand);
        parts.push({ ETag, PartNumber: parts.length + 1 });
      }

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: "examframebuckets",
        Key: key,
        UploadId,
        MultipartUpload: { Parts: parts },
      });
      await s3Client.send(completeCommand);

      return this.detectFraud(key);
    } catch (error) {
      console.error("Error during multipart upload:", error);
      if (UploadId) {
        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: "examframebuckets",
          Key: key,
          UploadId,
        });
        await s3Client.send(abortCommand);
        console.log("Multipart upload aborted.");
      }

      throw error;
    }
  }

  static async detectFraud(key) {

    const params = {
      Image: {
        S3Object: {
          Bucket: "examframebuckets",
          Name: key,
        },
      },
      Attributes: ["ALL"],
    };
    const command = new DetectFacesCommand(params);
    const response = await rekognitionClient.send(command);
    console.log(response)
    let errorMessage;

    if (response.FaceDetails.length !=1) {
      errorMessage = "Multiple faces detected";
      return errorMessage;
    }

    const eyeDirection = response.FaceDetails[0].EyeDirection;
    if (Math.abs(eyeDirection.Pitch) > 15 || Math.abs(eyeDirection.Yaw) > 30) {
      errorMessage = "Suspicious eye direction detected";
      return errorMessage;
    }

    return "No suspicious activity detected";
  }
}

module.exports = Exam;
