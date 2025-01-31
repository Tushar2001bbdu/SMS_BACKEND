const students = require("../models/students");
const teachers = require("../models/teachers");
const admins = require("../models/adminstrators");
async function teacherCheck(email,rollno){
    try{
        let teacher = await teachers.findOne({email:email});
        if(teacher.rollno === rollno){
            return true;
        }
        return false;
    }
    catch(error){
        return false;
    }
    
}
async function adminCheck(email,rollno){
    try{
        let admin = await admins.findOne({email:email});
        if(admins.rollno === rollno){
            return true;
        }
        return false;
    }
    catch(error){
        return false;
    }
    
}

async function studentCheck(email,rollno){
    try{
        let student = await students.findOne({email:email});
        if(student.rollno === rollno){
            return true;
        }
        return false;
    }
    catch(error){
        return false;
    }
    
}
module.exports={teacherCheck,studentCheck,adminCheck}