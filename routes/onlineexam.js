const router = require("express").Router();

const { sendFrame } = require("../controllers/exam-controllers");

router.post("/sendphoto", sendFrame);

module.exports = router;