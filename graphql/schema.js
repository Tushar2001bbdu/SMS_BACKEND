const typeDefs = `#graphql
type Assignment {
    rollno: ID!
    title: String!
    AssignmentLink:String!
    subject: String!
    assignmentDate: String!
    dueDate: String!
    marks: Int!
    postedBy: String!
    submitted: Boolean!
}

type Query {
    getAllAssignments: [Assignment!]!
    getAssignmentsByRollno(rollno: ID!): [Assignment!]!
}

type Mutation {
    addAssignment(input: Assignments!): Assignment
    submitAssignment(rollno: ID!, title: String!): Assignment
}

input Assignments {
    rollno: ID!
    title: String!
    AssignmentLink:String!
    subject: String!
    assignmentDate: String!
    dueDate: String!
    marks: Int!
    postedBy: String!
}
`
module.exports = typeDefs
