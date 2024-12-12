const express = require("express");

const Router = express.Router();

// Load environment variables from .env file
require("dotenv").config();

const admin = require("firebase-admin");

const { authenticateStudentToken } = require("../middlewares/auth");

const app1 = admin.app("students");

const studentController = require("../controllers/student-controllers");

//Route to see Details for a student in the Student Management System
Router.get(
  `/seeDetails`,
  authenticateStudentToken,
  studentController.seeProfile
);
//Route for logging in for a student in the Student Management System
Router.post(
  "/login",
  authenticateStudentToken,

  studentController.login
);

Router.put(
  "/passwordResetEmail",
  authenticateStudentToken,
 
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        try {
          const link = await app1
            .auth()
            .generatePasswordResetLink(req.body.email);

          res.status(200).send("The password reset link is" + link);
        } catch (error) {
          res.status(500).send("There has been some error during the process");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);
Router.get("/getResult", authenticateStudentToken, studentController.getStudentResult);

Router.get(
  "/getDetails",
  authenticateStudentToken,
  studentController.getStudentFeesDetails
);

module.exports = Router;