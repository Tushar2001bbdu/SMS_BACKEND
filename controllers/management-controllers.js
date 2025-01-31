let { adminCheck } = require("../utils/authentication");
let administrators = require("../services/management");
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    res.json({ status:401,meesage: "You have entered invalid data" });
  } else {
    try {
      let student = students.findOne({ rollno: req.body.rollno });

      if (student!==null) {
        res.json({ status:400,meesage: "There is already an account of the user" });
      } else {
        let {email,name,password,profilepictureLink,section,course,branch,teacher,rollno,teacherrollno}=req.body;
        let data=administrators.createStudentRecord(email,name,password,profilepictureLink,section,course,branch,teacher,rollno,teacherrollno)
        res.json({
          status:401,
          message: "You have successfully created an account",
          data:data
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occured");
    }
  }
}