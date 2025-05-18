const router = require("express").Router();
const { s3Client } = require("../config/s32");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { markAssignment,giveAnswers } = require("../controllers/assignment-controllers");

const { authenticateStudentToken } = require("../middlewares/auth");
const generatePresignedUrl = async (bucketName, key) => {
    const contentTypeMap = {
        'txt': 'text/plain',
        'pdf': 'application/pdf',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

   
    const extension = key.split('.').pop().toLowerCase();
    const contentType = contentTypeMap[extension] || 'application/octet-stream'; 

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};


router.get("/get-upload-url/:filename/:bucketName", async (req, res) => {
    try {
        const filename = req.params.filename;
        const bucketName = req.params.bucketName;

        const url = await generatePresignedUrl(bucketName, filename);
        res.status(200).json({ status: 200, uploadUrl: url });
    } catch (error) {
         console.error("Error generating presigned URL:", error);
       
        res
            .status(500)
            .json({ status: 500, error: "Failed to generate presigned URL" });
    }
});
router.post("/markAssignment/:rollno",markAssignment)
router.post("/answerChat",giveAnswers)


module.exports = router;
