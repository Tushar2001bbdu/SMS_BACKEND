const { PDFDocument } = require("pdf-lib");
const { rekognitionClient } = require("../config/rekognitionClient");
const { s3Client } = require("../config/s3Client");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const OpenAIApi = require("openai");
const { updateStudentResult } = require("../services/teachers");

const streamToBuffer = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
};

async function markAssignment(req, res) {
    try {
        let rollno=req.params.rollno;
        const { s3Link, fileType,subject } = req.body;
        if (!s3Link || !fileType) {
            throw new Error("s3Link and fileType are required.");
        }

        const fileName = decodeURIComponent(s3Link.split("/").pop());

        const params = {
            Bucket: "assignment-solutions",
            Key: fileName,
        };

        const command = new GetObjectCommand(params);
        const fileData = await s3Client.send(command);
        const fileBuffer = await streamToBuffer(fileData.Body);

        let content;

        switch (fileType) {
            case "text/plain":
                content = fileBuffer.toString("utf-8");
                break;

            case "application/pdf":
                const pdfDoc = await PDFDocument.load(fileBuffer);
                const pdfText = await extractTextFromPDF(pdfDoc);
                content = pdfText;
                break;

            case "image/jpeg":
            case "image/png":
                const rekognitionParams = {
                    Image: {
                        Bytes: fileBuffer,
                    },
                };
                const rekognitionResult = await rekognitionClient
                    .detectText(rekognitionParams)
                    .promise();
                content = rekognitionResult.TextDetections.map(
                    (text) => text.DetectedText
                ).join(" ");
                break;

            default:
                throw new Error("Unsupported file type.");
        }

        const analysis = await analyzeContent(content,subject,rollno);
        res.status(200).json({ status: 200, analysis:analysis });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}

async function extractTextFromPDF(pdfDoc) {
    const pages = pdfDoc.getPages();
    const allText = pages.map((page) => page.getTextContent()).join(" ");
    return allText;
}

const analyzeContent = async (content,subject,rollno) => {

try{
    const openai = new OpenAIApi({
        key: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content:
                    `You are a grader evaluating assignments based on the subject - ${subject} you identify the content belongs display only your given score as a number out of 20 (nothing else) and if content is not of the ${subject} give 0 marks do not explain your result`,
            },
            {
                role: "user",
                content: `Please grade the following assignment:\n\n${content}`,
            },
        ],
    });
    let marks=parseInt(response.choices[0].message.content);
    await updateStudentResult(marks,rollno)
}
catch(error){
    res.status(500).json({ status: 500, message: error.message });
}
    
};

module.exports = { markAssignment};
