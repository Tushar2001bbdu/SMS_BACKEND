const router = require("express").Router();
const { s3Client } = require("../config/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { authenticateStudentToken } = require("../middlewares/auth");
const generatePresignedUrl = async (bucketName, key) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: "application/jpg/jpeg",
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};

router.get("/get-upload-url/:filename/:bucketName", async (req, res) => {
    console.log("URL is being generated");
    try {
        const filename = req.params.filename;
        const bucketName = req.params.bucketName;

        const url = await generatePresignedUrl(bucketName, filename);
        res.json({ status: "200", uploadUrl: url });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        res
            .status(500)
            .json({ status: "500", error: "Failed to generate presigned URL" });
    }
});

module.exports = router;
