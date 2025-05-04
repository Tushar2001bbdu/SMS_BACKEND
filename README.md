Student Management System Backend
A robust and scalable backend system designed to streamline educational administration and enhance student learning experiences. This project integrates modern technologies to manage student and teacher records, facilitate learning materials distribution, automate attendance tracking, and ensure secure examinations.

🚀 Features
🔐 Authentication & Authorization
Student Authentication: Utilizes Firebase Authentication for secure student login.

Teacher Authentication: Implements custom authentication mechanisms for teachers.

👥 User Management
CRUD Operations: Create, read, update, and delete records for students and teachers.

Profile Access: Both students and teachers can access and manage their profiles.

📚 Learning Materials & Assignments
Material Distribution: Teachers can distribute learning materials via GraphQL APIs.

Assignment Management: Students can submit assignments, which are auto-evaluated using OpenAI's ChatGPT APIs.

📊 Academic Information
Fee Details: Students can view their fee payment history and pending dues.

Results: Access to academic results and performance metrics.

📆 Attendance & Examination
Automated Attendance: Leverages AWS Rekognition for facial recognition-based attendance tracking.

Examination Proctoring: Ensures exam integrity using AWS Rekognition for real-time monitoring.

🛠️ Tech Stack
Backend Framework: Node.js with Express.js

Database: MongoDB

Authentication: Firebase Authentication, Custom JWT-based authentication

GraphQL Server: Apollo Server

Cloud Services:

AWS Rekognition & Textract: For facial recognition and document analysis

AWS Lambda & ECR: For serverless functions and containerized deployments

AI Integration: OpenAI's ChatGPT API for assignment evaluation

CI/CD: GitHub Actions for automated testing and deployment

Containerization: Docker & Docker Compose

📁 Project Structure
bash
Copy
Edit
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── graphql/                # GraphQL schema and resolvers
├── middlewares/            # Custom middleware functions
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── servers/                # Server initialization scripts
├── services/               # External service integrations
├── utils/                  # Utility functions
├── .github/workflows/      # GitHub Actions workflows
├── .vscode/                # VSCode settings
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Project metadata and dependencies
├── server.js               # Entry point of the application
└── README.md               # Project documentation
⚙️ Setup & Installation
Clone the Repository:

bash
Copy
Edit
git clone https://github.com/Tushar2001bbdu/SMS_BACKEND.git
cd SMS_BACKEND
Install Dependencies:

bash
Copy
Edit
npm install
Configure Environment Variables:
Create a .env file in the root directory and add the necessary environment variables:

env
Copy
Edit
PORT=3001
MONGODB_URI=your_mongodb_connection_string
FIREBASE_CONFIG=your_firebase_config
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
OPENAI_API_KEY=your_openai_api_key
Run the Application:

bash
Copy
Edit
npm start
The server will start on http://localhost:3001.

🧪 Running Tests
To run tests, use the following command:

bash
Copy
Edit
npm test
📦 Deployment
The application is containerized using Docker. To build and run the Docker container:

bash
Copy
Edit
docker-compose up --build
For serverless deployment using AWS Lambda and ECR:

Build Docker Image:

bash
Copy
Edit
docker build -t sms_backend .
Push to AWS ECR:

bash
Copy
Edit
aws ecr create-repository --repository-name sms_backend
aws ecr get-login-password | docker login --username AWS --password-stdin your_aws_account_id.dkr.ecr.region.amazonaws.com
docker tag sms_backend:latest your_aws_account_id.dkr.ecr.region.amazonaws.com/sms_backend:latest
docker push your_aws_account_id.dkr.ecr.region.amazonaws.com/sms_backend:latest
Deploy with Serverless Framework:
Ensure you have the Serverless Framework installed and configured.

bash
Copy
Edit
serverless deploy
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Commit your changes:

bash
Copy
Edit
git commit -m 'Add your feature'
Push to the branch:

bash
Copy
Edit
git push origin feature/your-feature-name
Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

📬 Contact
For any inquiries or feedback, please contact Tushar Gupta