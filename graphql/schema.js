const typeDefs = `#graphql
type Assignment {
    rollno: ID!
    title: String!
    solutionLink:String!
    assignmentLink:String!
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
input Assignments {
    classCode: ID!
    title: String!
    assignmentLink:String!
    subject: String!
    assignmentDate: String!
    dueDate: String!
    marks: Int!
    postedBy: String!
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
    getLearningMaterialsBySection(uploadedBy: String! ,section: String!): [LearningMaterials!]!
}

type Mutation {
    addAssignment(input: Assignments!): result!
    submitAssignment(rollno: ID!, title: String!,solutionLink:String!): Assignment
    addLearningMaterial(input: LearningMaterial!): result!
}
`

module.exports = typeDefs
