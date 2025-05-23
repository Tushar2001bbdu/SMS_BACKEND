const onlineClassService = require("../services/onlineclass");
async function generateAccessSignature(req, res) {
  const { meetingNumber, role } = req.body;
  try {
    const signature = await onlineClassService.generateAccessToken(
      meetingNumber,
      role
    );
    const token=await onlineClassService.getOAuthToken();
    res.send({
      status: 200,
      signature: signature,
      accessToken: token
    });
  } catch (error) {
    res.send({ status: 500, message: error });
  }
}

module.exports = { generateAccessSignature };
