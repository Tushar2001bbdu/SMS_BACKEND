const router = require("express").Router();

const { updateAttendance } = require("../controllers/attendance-controllers");
router.post("/sendphoto",updateAttendance);

module.exports = router;
