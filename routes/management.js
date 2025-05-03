const express = require("express");

const Details = require("../models/feespaymentdetails");
const Router = express.Router();
const { message } = require("../models/chatMessages");
const { body, validationResult } = require("express-validator");
const { login, getClassList, getStudentList, createStudentAccount, getTeacherList, getPhotoUploadUrl, createTeacherAccount ,deleteStudentAccount,deleteTeacherAccount} = require("../controllers/management-controllers");
const { authenticateAdminToken } = require("../middlewares/auth");

const Class = require("../models/classes");


Router.post("/login", authenticateAdminToken, login);
Router.get("/getClassList", authenticateAdminToken, getClassList)
Router.get("/getStudentList/:section", authenticateAdminToken, getStudentList)
Router.get("/getTeacherList", authenticateAdminToken, getTeacherList)
Router.get("/get-upload-url/:filename", authenticateAdminToken, getPhotoUploadUrl)

//LA-Library Availed;AF-Academic Fees;TF-Total Fees Paid;FP-Training and Placement Fees Paid
//Route adding necessary details for a student having a account in the Student Management System

//Route for updating Academic Fees Paid for a student having a account in the Student Management System
Router.post(
  "/createStudentRecord",
  authenticateAdminToken,
  createStudentAccount
);
//Route to create account for a teacher in the Student Management System
Router.post(
  "/createTeacherRecord",
  authenticateAdminToken,
  createTeacherAccount
);

//Route to create class for a teacher in the Student Management System
Router.post(
  "/createClass",
 
  async (req, res) => {
    console.log(req.body.className)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data provided for class creation",
        errors: errors.array(),
      });
    }

    try {
      const { className} = req.body;
      const existingClass = await Class.findOne({ name:className });
      if (existingClass) {
        return res.status(409).json({
          status: 409,
          message: "Class with this code already exists",
        });
      }
      const newClass = await Class.create({
        name:className,
        code:className
      });
      console.log(newClass)
      res.json({
        status: 200,
        message: "Class created successfully",
        data: newClass,
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: 500,
        message: "An error occurred while creating the class",
      });
    }
  }
);
Router.patch(
  "/addTeacherToClass",
  [
    body(
      "classCode",
      "Class name should be at least 3 characters long"
    ).isLength({ min: 3 }),
    body("teacherrollno", "A valid teacher ID must be provided").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data provided for class creation",
        errors: errors.array(),
      });
    }
    try {
      const { classCode, teacherrollno } = req.body;
      let updatedClass = await Class.findOneAndUpdate(
        { name: classCode },
        { $addToSet: { teachers: teacherrollno } }
      );

      res.json({
        status: 200,
        message: "Student has been added to class successfully",
        updatedClass: updatedClass,
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: 500,
        message: "An error occurred while creating the class",
      });
    }
  }
);
Router.patch(
  "/addStudentToClass",
  [
    body(
      "classCode",
      "Class name should be at least 3 characters long"
    ).isLength({ min: 3 }),
    body("studentrollno", "A valid student ID must be provided").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data provided for student adding",
        errors: errors.array(),
      });
    }
    try {
      const { classCode, studentrollno } = req.body;
      let updatedClass = await Class.findOneAndUpdate(
        { name: classCode },
        { $addToSet: { students: studentrollno } }
      );

      res.json({
        status: 200,
        message: "Student has been added to class successfully",
        updatedClass: updatedClass,
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: 500,
        message: "An error occurred while creating the class",
      });
    }
  }
);
Router.patch("/changeAcadFees", async (req, res) => {
  try {
    let user = await Details.findOne({ rollno: req.body.rollno });
    if (user === null) {
      res.json({
        status: 401,
        message: "You have not created the student Details account",
      });
    } else {
      user = await Details.findOneAndUpdate(
        { rollno: req.body.rollno },
        { AcademicFeesPaid: req.body.AF }
      );
      let TFP = user.TotalFeesPaid;
      TFP = TFP + req.body.AF;
      user = await Details.findOneAndUpdate(
        { rollno: req.body.rollno },
        { TotalFeesPaid: TFP }
      );

      res.json({ status: 200, message: "academic fees has been updated" });
    }
  } catch (error) {
    res.json({ status: 500, message: "some error has occured" });
  }
});

//Route for updating Training and Placement Fees Paid  for a student having a account in the Student Management System
Router.patch("/changeTandPFees", async (req, res) => {
  try {
    let user = await Details.findOne({ rollno: req.body.rollno });
    if (user === null) {
      res.json({
        status: 401,
        message: "You have not created the student Details account",
      });
    } else {
      user = await Details.findOneAndUpdate(
        { rollno: req.body.rollno },
        { TandPFeesPaid: req.body.TP }
      );
      let TFP = user.TotalFeesPaid;
      TFP = TFP + req.body.TP;
      user = await Details.findOneAndUpdate(
        { rollno: req.body.rollno },
        { TotalFeesPaid: TFP }
      );
      res.json({
        sttaus: 200,
        message: "Training and Placement Fees has been updated",
      });
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
});
//Route for updating whether Student has availed Library Or Not  for a student having a account in the Student Management System
Router.patch("/changeLibraryAvailed", async (req, res) => {
  try {
    let user = await Details.findOne({ rollno: req.body.rollno });
    if (user === null) {
      res.json({
        status: 401,
        message: "You have not created the student Details account",
      });
    } else {
      user = await Details.findOneAndUpdate(
        { rollno: req.body.rollno },
        { LibraryAvailed: req.body.LA }
      );
      user = await Details.findOne({ rollno: req.body.rollno });

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});

Router.delete("/deleteStudentRecord/:rollno/:section",authenticateAdminToken,deleteStudentAccount);
Router.delete("/deleteTeacherRecord/:rollno",authenticateAdminToken,deleteTeacherAccount); 
// Get chat history between parent and teacher
Router.get("/messages/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  const messages = await message
    .find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
    .sort({ timestamp: 1 });

  res.json(messages);
});
module.exports = Router;
