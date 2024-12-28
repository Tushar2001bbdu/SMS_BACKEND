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
input LearningMaterial {
  title: String!
  description: String!
  subject: String!
  section: String!
  fileUrl: String!
  fileType: String!
  videoLink: String!
  tags: [String]
  uploadedBy: String!
}
type LearningMaterials{
    title: String!
  description: String!
  subject: String!
  section: String!
  fileUrl: String!
  fileType: String!
  videoLink: String!
  tags: [String]
  uploadedBy: String!
}

type Query {
    getAllAssignments: [Assignment!]!
    getAssignmentsByRollno(rollno: ID!): [Assignment!]!
    getAssignmentsBySection(postedBy:String !,section: String!): [Assignment!]!
    getLearningMaterialsBySection(postedBy: String! ,section: String!): [LearningMaterials!]!
}

type Mutation {
    addAssignment(input: Assignments!): result!
    submitAssignment(rollno: ID!, title: String!,solutionLink:String!): Assignment
    addLearningMaterial(input: LearningMaterial!): LearningMaterials!
}

input Assignments {
    classCode: ID!
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
