const express = require("express");
const User = require("../models/students");
const Results = require("../models/examresult");
const Details = require("../models/feespaymentdetails");
const Router = express.Router();
const { message } = require("../models/chatMessages");
const { body, validationResult } = require("express-validator");
const Teachers = require("../models/teachers");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const users = require("../models/students");
const teachers = require("../models/teachers");
const Class = require("../models/classes");
const appstudents = admin.app("students");
const appteachers = admin.app("teachers");

//LA-Library Availed;AF-Academic Fees;TF-Total Fees Paid;FP-Training and Placement Fees Paid
//Route adding necessary details for a student having a account in the Student Management System

//Route for updating Academic Fees Paid for a student having a account in the Student Management System
Router.post(
  "/createStudentRecord",

  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("section", "Enter a valid section").isLength({ min: 3 }),
    body("course", "Enter a valid course").isLength({ min: 5 }),
    body("branch", "Enter a valid branch").isLength({ min: 5 }),
    body("teacher", "Enter a valid Teacher Name").isLength({ min: 5 }),
    body("rollno", "Enter a valid Roll No").isLength({ min: 5 }),
    body("teacherrollno", "Enter a valid Teacher Roll No").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.status(500).send({ success: "You have entered inavlid credentials" });
    } else {
      try {
        let user = User.findOne({ rollno: req.body.rollno });

        if (user == true) {
          res
            .status(500)
            .send({ success: "There is already an account of the user" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const secPass = await bcrypt.hash(req.body.password, salt);

          await User.create({
            email: req.body.email,
            name: req.body.name,
            password: secPass,
            section: req.body.section,
            course: req.body.course,
            branch: req.body.branch,
            classteacher: req.body.teacher,
            rollno: req.body.rollno,
            teacherrollno: req.body.teacherrollno,
          });
          await Results.create({
            rollno: req.body.rollno,
            name: req.body.name,
          });
          await Details.create({
            rollno: req.body.rollno,
            name: req.body.name,
          });
          // adding student to teacher list of students
          let teacher = await Teachers.findOne({
            rollno: req.body.teacherrollno,
          }).select("studentslist");
          teacher.studentslist.push(req.body.rollno);
          teacher.students.push({
            name: req.body.name,
            rollno: req.body.rollno,
          });
          await teacher.save();
          let USER = {
            email: req.body.email,
            password: req.body.password,
          };
          await admin.auth(appstudents).createUser({
            email: USER.email,
            password: USER.password,
            emailVerified: false,
            disabled: false,
          });

          res.status(201).json({
            success: "You have successfully created an account",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occured");
      }
    }
  }
);
//Route to create account for a teacher in the Student Management System
Router.post(
  "/createTeacherRecord",

  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("age", "Enter a valid age").notEmpty(),
    body("password", "Enter a valid password").isLength({ min: 3 }),
    body("course", "Enter a valid course").notEmpty(),
    body("gender", "Enter a valid gender").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(500)
        .send({ success: "You have entered invalid data to create a account" });
    } else {
      try {
        let teacher = Teachers.findOne({ rollno: req.body.rollno });

        if (teacher == true) {
          res.status(401).send({
            status:
              "You have already an account on this Student Management System",
          });
        } else {
          teacher = await Teachers.create({
            email: req.body.email,
            rollno: req.body.rollno,
            name: req.body.name,
            password: req.body.password,
            course: req.body.course,
            age: req.body.age,
            gender: req.body.gender,
          });
          let USER = {
            email: req.body.email,
            password: req.body.password,
          };
          await admin.auth(appteachers).createUser({
            email: USER.email,
            password: USER.password,
            emailVerified: false,
            disabled: false,
          });

          res
            .status(201)
            .send(
              "You have successfully created an account in the teachers database"
            );
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occured");
      }
    }
  }
);

//Route to create class for a teacher in the Student Management System
Router.post(
  "/createClass",
  [
    body("name", "Class name should be at least 3 characters long").isLength({
      min: 3,
    }),
    body("code", "Class code must be provided").notEmpty(),
    body("teachers", "A valid teacher ID must be provided").notEmpty(),
    body("room", 'Room name or "Online" must be specified').notEmpty(),
    body("schedule.day", "Day must be a valid weekday").isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    body("schedule.time.start", "Start time must be in HH:mm format").matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/
    ),
    body("schedule.time.end", "End time must be in HH:mm format").matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/
    ),
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
      const { name, code, teachers, room, schedule } = req.body;
      const existingClass = await Class.findOne({ code });
      if (existingClass) {
        return res.status(409).json({
          status: 409,
          message: "Class with this code already exists",
        });
      }
      const newClass = await Class.create({
        name,
        code,
        teachers,
        room,
        schedule,
      });

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

Router.delete("/deleteStudent", async (req, res) => {
  try {
    let user = await Details.findOne({ rollno: req.body.rollno });
    if (user === null) {
      res.json({
        status: 401,
        message: "You have not created the student Details account",
      });
    } else {
      await Details.findOneAndDelete({ rollno: req.body.rollno });
      await Results.findOneAndDelete({ rollno: req.body.rollno });
      await users.findOneAndDelete({ rollno: req.body.rollno });

      res.json({
        status: 200,
        message: "The student account has been deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 501, message: "some error has occured" });
  }
});
Router.delete("/deleteTeacher", async (req, res) => {
  try {
    let user = await teachers.findOne({ rollno: req.body.rollno });
    if (user === null) {
      res.status(401).send("You have not created the  teachers account yet");
    } else {
      await teachers.findOneAndDelete({ rollno: req.body.rollno });

      res.json({
        status: 200,
        message: "The teacher account has been deleted successfully",
      });
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
});
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
