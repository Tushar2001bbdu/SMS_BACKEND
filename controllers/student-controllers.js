let studentService = require("../services/students");
const { studentCheck } = require("../utils/aurhentication");
let rollno;

exports.login = async (req, res) => {
  try {
   
    rollno=req.body.userDetails.rollNo;
    if(studentCheck(req.body.userDetails.email,rollno)){
      res.status(200).json({
        status: 200,
        message: "You have logged in successfully",
      });
    }
    else{
      res.status(401).json({status:401,message:"Invalid Credentials"})
    }
    
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
exports.seeProfile = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    }
    const response = await studentService.seeDetails(rollno);
    if (!response) {
      console.log(response)
      res.json({ status: 401, message: "you are not authorized" });
    } else {
      console.log(response)
      res.json({ status: 200, data: response });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
};
exports.getStudentResult = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    }

    let response = await studentService.getStudentResult(rollno);
    console.log(response)
    if (!response) {
      return res.status(404).json({ status: 404, message: "No result found" });
    } else {
      return res.status(200).json({ status: 200, data: response });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error });
  }
};
exports.getClassSchedule = async (req, res) => {
  let classSection=req.params.classSection;
  try{
  if (!classSection) {

    return res.json({ status: 400, message: "class section is required" });
  }

  let response = await studentService.getClassSchedule(classSection);
  console.log(response)
  if (response==null || response=== undefined) {
    return res.status(404).json({ status: 404, message: "No class schedule found" });
  } else {
    return res.status(200).json({ status: 200, data: response });
  }
} catch (error) {
  console.log(error)
  return res.status(500).json({ status: 500, message: error });
}
}
exports.getStudentFeesDetails = async (req, res) => {
  try {
    if (!rollno) {
      return res.json({ status: 400, message: "rollno is required" });
    } else {
      
      let response = await studentService.getStudentFeesDetails(rollno);

      if (!response) {
        return res.status(404).json({ status: 404, message: "No fees details found" });
      } else {
        return res.status(200).json({ status: 200, data: response });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error });
  }
};
