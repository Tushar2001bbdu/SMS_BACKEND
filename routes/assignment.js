const router = require("express").Router();
const { s3Client } = require("../config/s3Client")
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { authenticateStudentToken } = require("../middlewares/auth");
const generatePresignedUrl = async (bucketName,key) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: 'application/jpg/jpeg',
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};


router.get('/get-upload-url', authenticateStudentToken, async (req, res) => {
    let filename=req.query.filename
    const url = await generatePresignedUrl('assignment-solutions',filename);
    res.json({ status:"200",uploadUrl:url});
});
module.exports = router 