const { s3Client } = require("../config/s32");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { rekognitionClient } = require("../config/RC2");
const pdfParse = require("pdf-parse");
const OpenAIApi = require("openai");
const { updateStudentResult } = require("../services/teachers");
  const openai = new OpenAIApi({
            apiKey: process.env.OPENAI_API_KEY,
        });
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
        const rollno = req.params.rollno;
        const { s3Link, fileType, subject } = req.body;

        if (!s3Link || !fileType) {
            throw new Error("s3Link and fileType are required.");
        }

        const fileName = decodeURIComponent(s3Link.split("/").pop());

        const params = {
            Bucket: "assignmentssolutions",
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
                const parsedPdf = await pdfParse(fileBuffer);
                content = parsedPdf.text;
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

        const analysis = await analyzeContent(content, subject, rollno);
        res.json({ status: 200, analysis: analysis });

    } catch (error) {
        console.error("Error in markAssignment:", error);
        res.json({ status: 500, message: error.message });
    }
}

const analyzeContent = async (content, subject, rollno) => {
    try {
      

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a grader evaluating assignments based on the subject - ${subject}. Only return a number out of 20. If the content doesn't match the subject, return 0. No explanation.`,
                },
                {
                    role: "user",
                    content: `Please grade the following assignment:\n\n${content}`,
                },
            ],
        });

        const marks = parseInt(response.choices[0].message.content);
        await updateStudentResult(marks, rollno);
        console.log("The marks are"+marks)
        return marks;

    } catch (error) {
        console.error("Error in analyzeContent:", error);
        throw new Error("Failed to analyze assignment content.");
    }
};
async function giveAnswers(req,res){
    const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });
    
    res.json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with OpenAI API' });
  }
}


module.exports = { markAssignment,giveAnswers };
