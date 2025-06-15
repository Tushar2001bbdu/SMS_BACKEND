# 🎓 Student Management System – Backend API

This is the **backend server** for the Student Management System project built using **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs to manage student data, handle authentication, and serve as the core service for the student management portal.

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (with Mongoose)**
- **JWT Authentication**
- **CORS**
- **Dotenv for environment management**
- **AWS Rekognition For Attendnance Mangement And Exam Proctoring**

---

## 🚀 Features

- 🔐 **Admin Authentication**
  - JWT-based secure login system for admins
- 🧑‍🎓 **CRUD Operations for Students**
  - Add, update, delete, and view student records
- 📝 **Attendance and Marks Management** *(optional, if applicable)*
- 🌐 **CORS-enabled** for frontend integration
- 📁 **Environment Config** using `.env` for secrets and DB config

---

## 📁 Project Structure

```

SMS\_BACKEND/
│
├── models/           # Mongoose models for Students, Admin, etc.
├── routes/           # Express route handlers
├── controllers/      # Logic separated from routes
├── config/           # DB connection and config
├── servers/          # All Servers( Websocket server, Graphql Server and Http Server)
├── .env              # Environment variables
├── server.js         # Entry point for Express app
├── utils.js          # Contains logic for password hashing and authentication based on roll numbers
└── package.json

````

---

## 📦 Installation & Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/Tushar2001bbdu/SMS_BACKEND.git

# 2. Navigate into the folder
cd SMS_BACKEND

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file in the root with the following:

( I will upload the structure a bit later)



# 5. Start the development server
npm run start

## 🔐 Authentication Format

Send token in headers like this:

```http
Authorization: <your_token>
```

---

## 📌 Future Enhancements (Suggestions)

* Add search/filter functionality for students
* Add fee modules
* Dockerize the backend for production use

---

## 👨‍💻 Author

**Tushar Kumar Gupta**
📧 [Email](mailto:tusharkumargupta032@gmail.com)

---

## 📜 License

This project is licensed under the MIT License.
