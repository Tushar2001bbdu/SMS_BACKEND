const router = require("express").Router();

const { updateAttendance } = require("../controllers/attendance-controllers");
const { authenticateStudentToken } = require("../middlewares/auth");
router.post("/sendphoto",authenticateStudentToken, updateAttendance);

module.exports = router;
