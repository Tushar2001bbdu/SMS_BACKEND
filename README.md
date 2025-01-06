# Student Management System Backend

## Features

### 1. Management Features
- **Create and Edit Records**: Management can create and edit records for both teachers and students.
- **Authentication**: Firebase Authentication is used for student login, while teachers have separate authentication.

### 2. Profile and Academic Information
- **Profile Access**: Teachers and students can view their profiles.
- **Fee Details**: Students can view their fee details.
- **Results**: Students can access their academic results.

### 3. Learning Materials and Assignments
- **Material Distribution**: Teachers can efficiently send learning materials and assignments to their students using GraphQL.
- **Assignment Checking**: Student assignments are automatically checked using ChatGPT APIs.

### 4. Attendance and Examination
- **Automatic Attendance**: Attendance is automatically tracked using AWS Rekognition.
- **Examination Proctoring**: AWS Rekognition is used for examination proctoring to ensure exam integrity.

## Tools and Technologies

- **Firebase**: Used for authentication and real-time database.
- **Node.js**: Backend framework.
- **MongoDB**: Used as the database.
- **OpenAI APIs**: Used for automatic assignment checking.
- **AWS Rekognition**: Used for automatic attendance and examination proctoring.
- **AWS Textract**: Used for document analysis.
- **AWS Lambda**: Used for serverless deployment.
- **AWS ECR**: Used for containerized deployment.
- **GitHub Actions**: Used for CI/CD and deploying the backend.

## Setup and Deployment

### Prerequisites
- Node.js installed
- Firebase account and project setup
- AWS account with Rekognition, Textract, Lambda, and ECR services enabled
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tushar2001bbdu/SMS_BACKEND
   ```

   2. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     FIREBASE_API_KEY=<your-firebase-api-key>
     FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
     FIREBASE_PROJECT_ID=<your-firebase-project-id>
     AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
     AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
     OPENAI_API_KEY=<your-openai-api-key>
     ```

### Running the Application

1. Start the development server:
   ```bash
   npm run start
   ```

2. The backend will be available at `http://localhost:3001`.

### Deployment

- The backend is deployed using AWS Lambda and AWS ECR for containerized deployments. GitHub Actions are used to automate the deployment process. Each push to the `main` branch triggers a deployment workflow.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Open a pull request to the `main` branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact tusharkumargupta032@gmail.com.

