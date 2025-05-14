const model = require("../models/assignments");
const Class = require("../models/classes");
const Student = require("../models/students");
const studyMaterial=require("../models/learningMaterial")
const resolvers = {
    Query: {
        async getAssignmentsByRollno(_, args) {
            let res = await model.find({
                rollno: args.rollno
            })
            return res;
        },
        async getAssignmentsBySection(_, args) {
            
            let res = await model.find({
                section: args.section, postedBy: args.postedBy
            })
            console.log(res)
            return res;
        },
        async getAllAssignments() {
            return await model.find({})
        },
        async getLearningMaterialsBySection(_,args){
            
            let res = await studyMaterial.find({
                section: args.section, uploadedBy: args.uploadedBy
            })
            console.log(res)
            return res;
        }

    },
    Mutation: {
        async addAssignment(_, { input }) {
            try {
                const { classCode, title, AssignmentLink, subject, assignmentDate, dueDate, marks, postedBy } = input
                let submitted = false;
                let SolutionLink = "https://www.google.co.in/"
                let section = classCode
                let classData = await Class.findOne({ code: classCode })
                classData?.students.forEach(async (student) => {
                    let stu = await Student.findOne({rollno:student})
                    let rollno = stu.rollno
                    let newAssignment = new model({
                        rollno:rollno, section:section, title:title, assignmentLink:AssignmentLink, subject:subject, solutionLink:SolutionLink, assignmentDate:assignmentDate, dueDate:dueDate, marks:marks, postedBy:postedBy, submitted:submitted
                    })
                    await newAssignment.save();
                })

                let result = {
                    response: "Your assignment has been added"
                }
                return result;
            }
            catch (error) {
                let result = {
                    response: error
                }
                return result;
            }


        },
        async addLearningMaterial(_, { input }){
            try {
              const LearningMaterial = require('../models/learningMaterial');
              const newMaterial = new LearningMaterial({
                title: input.title,
                description: input.description,
                subject: input.subject,
                section: input.section,
                fileUrl: input.fileUrl,
                fileType: input.fileType,
                videoLink: input.videoLink,
                tags: input.tags || [],
                uploadedBy: input.uploadedBy,
              });
          
              await newMaterial.save();
              let result = {
                response: "a study material has been added"
            }
            return result;
            } catch (error) {
                let result = {
                    response: error
                }
                return result;
            }
           
          },
          
        async submitAssignment(_, args) {
            const { rollno, title, solutionLink } = args
            return await model.findOneAndUpdate({ rollno: rollno, title: title }, { $set: { SolutionLink: solutionLink, submitted: true } })
        }
    }
}
module.exports = resolvers