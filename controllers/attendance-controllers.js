const attendanceService = require("../services/attendance");
async function updateAttendance(req, res) {
  let image = req.body.url;
  let rollno = req.body.rollno;
  try {
    await attendanceService.updateAttendance(image, rollno);
    return res.json({
      status: 200,
      message: "Face match found and data retrieved successfully",
    });
  } catch (error) {
    return res.json({ status: 500, message: "Error processing the request" });
  }
}

module.exports = { updateAttendance };
