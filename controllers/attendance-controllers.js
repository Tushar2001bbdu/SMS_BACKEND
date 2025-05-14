const attendanceService = require("../services/attendance");
async function updateAttendance(req, res) {
  console.log("I am being called to update attendance")
  let image = req.body.url;
  let rollno = req.body.rollno;
 
  try {

    await attendanceService.updateAttendance(image, rollno);
    res.json({
      status: 200,
      message: "Face match found and data retrieved successfully",
    });
  } catch (error) {
    console.log(error)
    res.json({ status: 500, message: "Error processing the request" });
  }
}

module.exports = { updateAttendance };
