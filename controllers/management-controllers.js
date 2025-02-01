let { adminCheck } = require("../utils/authentication");
let administrators = require("../services/management");
let teachers=require("../models/teachers")
const { body, validationResult } = require("express-validator");
let students=require("../models/students")
exports.login = async (req, res) => {
  try {
    rollno = req.body.userDetails.rollNo;
    if (adminCheck(req.body.userDetails.email, rollno)) {
      res.json({
        status: 200,
        message: "You have logged in successfully",
      });
    } else {
      res.json({ status: 401, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.getClassList = async (req, res) => {
  try {
    let classlist = await administrators.getClassList();
    res.json({
      status: 200,
      message: "You have successfully fetched the class list",
      data: classlist,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.getStudentList = async (req, res) => {
  try {
    let section=req.params.section;
    let studentList = await administrators.getStudentList(section);
    res.json({
      status: 200,
      message: "You have successfully fetched the class list",
      data: studentList,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.getTeacherList = async (req, res) => {
  try {
    let studentList = await administrators.getTeacherList();
    res.json({
      status: 200,
      message: "You have successfully fetched the teacher list",
      data: studentList,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.getPhotoUploadUrl=async(req,res)=>{
  try {
    let filename=req.params.filename
    let response = await administrators.getPhotoUploadUrl(filename);
    res.json({ status: 200, data: response });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
}
exports.createStudentAccount=async (req, res) => {
    try {
      let {email,rollno,name,password,course,section,branch,classteacherrollno,profilepictureLink}=req.body.userDetails;
      let student = await students.findOne({ rollno: rollno });
      let emailPresent=await students.findOne({email:email})
      let teacher=await teachers.findOne({rollno:rollno})
      if (student!==null || emailPresent!==null || rollno.length<10 || teacher==null) {
        res.json({ status:400,message: "There is already an account of the user or you have entered invalid roll number for student or teacher" });
      } else {
        let teacherrollno=teacher.name
        let data=administrators.createStudentRecord(email,rollno,name,password,course,section,branch,classteacher,teacherrollno,profilepictureLink)
        res.json({
          status:200,
          message: "You have successfully created an account",
          data:data
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occured");
    }
  }
  exports.createTeacherAccount=async (req, res) => {
    try {
      let {email,rollno,name,password,course,age,gender,profilepictureLink}=req.body.userDetails;
      let teacher = await taechers.findOne({ rollno: rollno });
      let emailPresent=await teacher.findOne({email:email})
      if (teacher!==null || emailPresent!==null || rollno.length<10) {
        res.json({ status:400,message: "There is already an account of the user or you have entered invalid roll number for teacher" });
      } else {
        let data=administrators.createTeacherRecord(email,rollno,name,password,course,age,gender,profilepictureLink)
        res.json({
          status:200,
          message: "You have successfully created an account",
          data:data
        });
      }
    } catch (error) {
      console.log(error);
      res.json({status:500,message:error});
    }
  }
