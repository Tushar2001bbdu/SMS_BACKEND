let studentService = require("../services/students");
const { studentCheck } = require("../utils/aurhentication");
let rollno;
exports.seeProfile = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    }
    console.log("the roll number for seeing the profile is",rollno)
    const response = await studentService.seeDetails(rollno);
    if (!response) {
      console.log(response)
      res.json({ status: 401, message: "you are not authorized" });
    } else {
      res.json({ status: 200, message: response });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.login = async (req, res) => {
  try {
    console.log("the roll number is :" + req.body.userDetails.rollNo);
    rollno=req.body.userDetails.rollNo;
    if(studentCheck(req.body.userDetails.email,rollno)){
      res.json({
        status: 200,
        message: "You have logged in successfully",
      });
    }
    else{
      res.json({status:401,message:"Invalid Credentials"})
    }
    
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
exports.getStudentResult = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    }

    let response = await studentService.getStudentResult(rollno);
    if (!response) {
      return res.json({ status: 404, message: "No result found" });
    } else {
      return res.json({ status: 200, message: response });
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};

exports.getStudentFeesDetails = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    } else {
      console.log("the roll number is" + rollno);
      let response = await studentService.getStudentFeesDetails(rollno);

      if (!response) {
        return res.json({ status: 404, message: "No fees details found" });
      } else {
        return res.json({ status: 200, message: response });
      }
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
