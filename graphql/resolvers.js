const model = require("../models/assignments")
const resolvers = {
    Query: {
        async getAssignmentsByRollno(_, args) {
            let res= await model.find({
                rollno: args.rollno
            })
            return res;
        },
        async getAllAssignments() {
            return await model.find({})
        }

    },
    Mutation: {
        async  addAssignment(_, { input }) {
            const { rollno, title,AssignmentLink, subject, assignmentDate, dueDate, marks, postedBy } = input
            let submitted = false;
            const newAssignment = new model({
                rollno, title,AssignmentLink, subject, assignmentDate, dueDate, marks, postedBy, submitted
            })
            await newAssignment.save();
            return newAssignment;

        },
        async submitAssignment(_, args) {
            const { rollno, title } = args
            return await model.findOneAndUpdate({ rollno: rollno, title: title }, { $set: { submitted: true } })
        }
    }
}
module.exports = resolvers