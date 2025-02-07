const studentresult = require("../models/examresult");
const feesdetails = require("../models/feespaymentdetails");
const Class = require("../models/classes");
const students = require("../models/students");

class StudentService {
  static async seeDetails(rollno) {
    try {
      
      let profile = await students.findOne({ rollno: rollno });
      return profile;
    } catch (error) {
      throw error;
    }
  }
  static async getStudentResult(rollno) {
    try {
      let result = await studentresult.findOne({ rollno: rollno });
      return ({
        attendance: result.attendance.value,
        marks: result.marks,
        grade: result.grade,
      })
    } catch (error) {
      throw error;
    }
  }
  static async getClassSchedule(section) {
    try {
      let classDetails = await Class.findOne({ code: section });
      console.log(classDetails)
      return {
        schedule:classDetails.schedule,
        room:classDetails.room
      };
    } catch (error) {
      throw error;
    }
  }

  static async getStudentFeesDetails(rollno) {    
    try {
      let fees = await feesdetails.findOne({ rollno: rollno });
      return fees;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
module.exports = StudentService;
