let teacherService = require("../services/teachers");
let rollno;
exports.seeProfile = async (req, res) => {
  try {
    console.log("the roll number is " + rollno);
    const response = await teacherService.seeDetails(rollno);
    if (!response) {
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
  rollno = req.query.rollno;
  console.log("The roll number is " +rollno)
  try {
    res.json({
      status: 200,
      message: "You have logged in successfully",
    });
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
exports.getStudentProfile = async (req, res) => {
  try {
    if (!rollno) {
      res.json({ status: 400, message: "no roll number has been entered" });
    } else {
      const response = await teacherService.getStudentProfile(rollno);
      if (response===null) {
        res.json({ status: 401, message: "invalid rollno has been entered" });
      } else {
        res.json({ status: 200, profile: response });
      }
    }
  } catch (error) {
    res.json({ status: 500, message: error });
  }
};
exports.updateStudentResult = async (req, res) => {
  const { marks } = req.body;
  try {
    if (!marks || !rollno) {
      res.json({
        status: 400,
        message: "you have not entered invalid rollno or marks",
      });
    } else {
      await teacherService.updateStudentResult(marks, rollno);
      res.json({
        status: 200,
        message: "the result of student has been updated successfully",
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: error,
    });
  }
};
exports.getStudentsList = async (req, res) => {
  try {
    let section = req.query.section;
    console.log("The section is " + section);

    if (section === undefined) {
      res.status(400).json({ status: 400, message: "Section is required" });
    } else {
      let response = await teacherService.getStudentList(section);
      console.log("The student list is", response);
      res.status(200).send({ status: 200, studentList: response });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};
exports.logout = async (req, res) => {
  let { accessToken } = req.body;
  try {
    let response = await teacherService.logout(accessToken);
    res.status(200).send({ status: 200, message: response });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
