const model = require("../models/assignments");
const Class = require("../models/classes");
const Student = require("../models/students");
const resolvers = {
    Query: {
        async getAssignmentsByRollno(_, args) {
            let res = await model.find({
                rollno: args.rollno
            })
            return res;
        },
        async getAssignmentsBySection(_, args) {
            console.log("The section is for assignment  is" + args.section)
            let res = await model.find({
                section: args.section, postedBy: args.postedBy
            })
            console.log(res)
            return res;
        },
        async getAllAssignments() {
            return await model.find({})
        }

    },
    Mutation: {
        async addAssignment(_, { input }) {
            try {
                const { classCode, title, AssignmentLink, subject, assignmentDate, dueDate, marks, postedBy } = input
                let submitted = false;
                let SolutionLink = "https://www.google.co.in/"
                let classData = await Class.findOne({ code: classCode })
                classData?.students.forEach(async (student) => {
                    let stu = await Student.findById(student)
                    let rollno = stu.rollno
                    let newAssignment = new model({
                        rollno, title, AssignmentLink, subject, SolutionLink, assignmentDate, dueDate, marks, postedBy, submitted
                    })
                    newAssignment.save()
                })
                
                let result = {
                    response: "Your assignment has been added"
                }
                return result;
            }
            catch (error) {
                console.log(error)
                throw new Error("Error in adding Assignment")
            }


        },
        async submitAssignment(_, args) {
            const { rollno, title, solutionLink } = args
            return await model.findOneAndUpdate({ rollno: rollno, title: title }, { $set: { SolutionLink: solutionLink, submitted: true } })
        }
    }
}
module.exports = resolvers