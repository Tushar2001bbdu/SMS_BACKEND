const examService = require("../services/exam");
async function sendFrame(req, res) {
  let image = req.body.url;
  let rollno = req.body.rollno;
  try {
    let response=await examService.sendFrame(image, rollno);
    res.json({
      status: 200,
      message: response,
    });
  } catch (error) {
    res.json({ status: 500, message: error.message });
  }
}

module.exports = { sendFrame };