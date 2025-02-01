let classes = require("../models/classes")
let students = require("../models/students")
let teachers = require("../models/teachers")
let studentResults = require("../models/examresult")
let studentDetails = require("../models/feespaymentdetails")
const { s3Client } = require("../config/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
let admin = require("firebase-admin")
const appstudents = admin.app("students");
const appteachers = admin.app("teachers");
let bcrypt = require("bcryptjs");
class administrators {
  static async getClassList() {
    try {
      let classesList = await classes.find({}, 'code');
      return classesList
    }
    catch (error) {
      throw error
    }
  }
  static async getStudentList(section) {
    try {
      let list = await students.find({ section: section });
      console.log("the student list is" + list)
      return list;
    }
    catch (error) {
      throw error
    }
  }
  static async getTeacherList() {
    try {
      let list = await teachers.find({});
      console.log("the teacher list is" + list)
      return list;
    }
    catch (error) {
      throw error
    }
  }
  static async createStudentRecord(email, rollno, name, password, course, section, branch, classteacher, teacherrollno, profilepictureLink) {
    try {
      let salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(password, salt);
      let data = await students.create({
        email: email,
        name: name,
        password: secPass,
        section: section,
        course: course,
        branch: branch,
        classteacher: classteacher,
        rollno: rollno,
        teacherrollno: [{
          name: classteacher,
          rollno: teacherrollno,
        }],
        profilepictureLink: profilepictureLink
      });
      await studentResults.create({
        rollno: rollno,
        name: name,
      });
      await studentDetails.create({
        rollno: rollno,
        name: name,
      });
      console.log("the teacher rollno is" + teacherrollno)
      let dat = await teachers.findOneAndUpdate({
        rollno: teacherrollno,
      },
        {
          "$addToSet": {
            studentslist: {
              name: name,
              rollno: rollno,
            }
          }
        })
      console.log(dat)


      let USER = {
        email: email,
        password: password,
      };
      await admin.auth(appstudents).createUser({
        email: USER.email,
        password: USER.password,
        emailVerified: true,
        disabled: false,
      });
      return data;
    }
    catch (error) {
      throw error;
    }
  }
  static async createTeacherRecord(email, rollno, name, password, course, age, gender, profilepictureLink) {
    try {


      let salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(password, salt);
      let teacher = await teachers.create({
        email: email,
        rollno: rollno,
        name: name,
        password: secPass,
        course: course,
        age: age,
        gender: gender,
        profilepictureLink: profilepictureLink
      });
      let USER = {
        email: email,
        password: password,
      };
      await admin.auth(appteachers).createUser({
        email: USER.email,
        password: USER.password,
        emailVerified: true,
        disabled: false,
      });

      return teacher;

    } catch (error) {
      throw error;

    }
  }

  static async generatePresignedUrl(bucketName, key) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: "application/txt/png/jpg/jpeg",
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  };
  static async getPhotoUploadUrl(filename) {
    try {
      let fileName = filename;
      let bucketName = "school-managemengt-system-training";

      const url = await this.generatePresignedUrl(bucketName, fileName);
      return url;
    } catch (error) {

      throw error;
    }
  }


}
module.exports = administrators