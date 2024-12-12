const router = require("express").Router();

const { generateAccessSignature } = require("../controllers/onlineclass-controllers");

router.post("/generateSignature", generateAccessSignature);

module.exports = router;