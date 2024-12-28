const router = require("express").Router();

const { updateAttendance } = require("../controllers/attendance-controllers");
const { authenticateStudentToken } = require("../middlewares/auth");
router.post("/sendphoto",updateAttendance);

module.exports = router;
