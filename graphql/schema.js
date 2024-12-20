const typeDefs = `#graphql
type Assignment {
    rollno: ID!
    title: String!
    SolutionLink:String!
    AssignmentLink:String!
    subject: String!
    section: String!
    assignmentDate: String!
    dueDate: String!
    marks: Int!
    postedBy: String!
    submitted: Boolean!
}
type result{
    response:String!
}

type Query {
    getAllAssignments: [Assignment!]!
    getAssignmentsByRollno(rollno: ID!): [Assignment!]!
    getAssignmentsBySection(postedBy:String !,section: String!): [Assignment!]!
}

type Mutation {
    addAssignment(input: Assignments!): result!
    submitAssignment(rollno: ID!, title: String!,solutionLink:String!): Assignment
}

input Assignments {
    classCode: ID!
    title: String!
    AssignmentLink:String!
    subject: String!
    section: String!
    assignmentDate: String!
    dueDate: String!
    marks: Int!
    postedBy: String!
}
`
module.exports = typeDefs
