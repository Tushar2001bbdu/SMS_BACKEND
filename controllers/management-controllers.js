let { adminCheck } = require("../utils/authentication");
let administrators = require("../services/management");
let teachers = require("../models/teachers")
let studentResults = require("../models/examresult")
let studentDetails = require("../models/feespaymentdetails")
let classes = require("../models/classes")
let assignments=require("../models/assignments")
let {groupMessages}=require("../models/groupMessages")
let {decryptMessage}=require("../utils/chatSecurity")
let students = require("../models/students")
let message=require("../models/chatMessages")
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
    let section = req.params.section;
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
exports.getPhotoUploadUrl = async (req, res) => {
  try {
    let filename = req.params.filename
    let response = await administrators.getPhotoUploadUrl(filename);
    res.json({ status: 200, data: response });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
}
exports.createStudentAccount = async (req, res) => {
  try {
    let { email, rollno, name, password, course, section, branch, classteacherrollno, profilepictureLink } = req.body.userDetails;
    let student = await students.findOne({ rollno: rollno });
    let emailPresent = await students.findOne({ email: email })
    let teacher = await teachers.findOne({ rollno: rollno })
    if (student !== null || emailPresent !== null || rollno.length < 10 || teacher == null) {
      res.json({ status: 400, message: "There is already an account of the user or you have entered invalid roll number for student or teacher" });
    } else {
      let teacherrollno = teacher.name
      let data = administrators.createStudentRecord(email, rollno, name, password, course, section, branch, classteacher, teacherrollno, profilepictureLink)
      res.json({
        status: 200,
        message: "You have successfully created an account",
        data: data
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Some error has occured");
  }
}
exports.createTeacherAccount = async (req, res) => {
  try {
    let { email, rollno, name, password, course, age, gender, profilepictureLink } = req.body.userDetails;
    let teacher = await teachers.findOne({ rollno: rollno });
    let emailPresent = await teachers.findOne({ email: email })
    if (teacher !== null || emailPresent !== null || rollno.length < 10) {
      res.json({ status: 400, message: "There is already an account of the user or you have entered invalid roll number for teacher" });
    } else {
      let data = await administrators.createTeacherRecord(email, rollno, name, password, course, age, gender, profilepictureLink)
      res.json({
        status: 200,
        message: "You have successfully created an account",
        data: data
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error });
  }
}
exports.deleteStudentAccount = async (req, res) => {
  try {
    let student = await students.findOne({ rollno: req.params.rollno });
    let section = req.params.section;
    if (student === null) {
      res.json({
        status: 401,
        message: "You have not created the student Details account",
      });
    } else {
      await students.findOneAndDelete({ rollno: req.params.rollno });
      await studentResults.findOneAndDelete({ rollno: req.params.rollno });
      await studentDetails.findOneAndDelete({ rollno: req.params.rollno });
      await classes.findOneAndUpdate(
        { code: section },
        { $pull: { students: req.params.rollno } }
      );
      
      await assignments.findOneAndUpdate({
        rollno:req.params.rollno
      })

      res.json({
        status: 200,
        message: "The student account has been deleted successfully",
      });
    }
  } catch (error) {
    res.json({ status: 501, message: "some error has occured" });
  }
}
exports.deleteTeacherAccount=async (req, res) => {
  try {
    let teacher = await teachers.findOne({ rollno: req.params.rollno });
    if (teacher === null) {
      res.json({status:401,message:"You have not created the  teachers account yet"});
    } else {
      await Promise.all(teacher.allotedSections.map(async (element) => {
        await classes.findOneAndUpdate(
          { code: element },
          { $pull: { teachers: req.params.rollno } }
        );
      }));
      await Promise.all(teacher.studentslist.map(async (element) => {
        await students.findOneAndUpdate(
          { rollno: element },
          { $pull: { teacherrollno:{name: teacher.name,rollno:req.params.rollno } }}
        );
      }));
      await teachers.findOneAndDelete({ rollno: req.params.rollno });

      res.json({
        status: 200,
        message: "The teacher account has been deleted successfully",
      });
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
exports.getClassGroupMessages=async(req,res)=>{
  try{
    let classGroupMessages=await groupMessages.find({group:req.params.groupId})
    classGroupMessages.forEach((message)=>{
      message.content = decryptMessage(message.content)
      message.mediaUrl= decryptMessage(message.mediaUrl)
    })
    res.json({status:200,data:classGroupMessages})
  }catch(error){
    console.log(error)
    res.json({status:500,message:error})
  }
}
exports.getPrivateChatMessages=async(req,res)=>{
  try{
  const { senderId, receiverId } = req.params;
  const messages = await message
    .find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
    .sort({ timestamp: 1 });
    messages.forEach((message)=>{
      message.content = decryptMessage(message.content)
    })
  res.json({status:200,data:messages});
  }catch(error){
    console.log(error)
    res.json({status:500,message:error})
  
}
}