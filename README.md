🚀 LeetLab – A LeetCode Clone

LeetLab is a full-stack coding practice platform inspired by LeetCode.
It allows users to solve coding problems, execute code against test cases, track submissions, and monitor problem-solving progress, while providing admins the ability to manage problems and test cases.

📌 Features
👤 User Features

User authentication (login/signup)

Browse coding problems

Submit solutions in multiple languages

Real-time code execution using Judge0

View submission results with detailed test case outputs

Track solved problems and submission history

🛠️ Admin Features

Create and manage problems

Add test cases, constraints, and reference solutions

Validate problems before publishing

Monitor user submissions

🧱 Project Architecture

LeetLab is designed as a full-stack application with a clear separation of concerns.

🖥️ Tech Stack
Backend

Node.js

Express.js

PostgreSQL

Prisma ORM

Judge0 API (Code execution)

Frontend

React.js (Vite)

JavaScript

Tailwind CSS

DaisyUI

Zustand (State Management)

Zod (Schema Validation)

React Hook Form

🧩 System Architecture
LeetLab (Fullstack Project)
│
├── Backend
│   ├── Authentication
│   ├── Problem Management
│   ├── Code Execution (Judge0)
│   ├── Submissions
│   └── Playlists
│
└── Frontend
    ├── Problem Listing
    ├── Code Editor
    ├── Submission Results
    └── User Dashboard

🔌 API Architecture
/api
│
├── /auth            → Authentication
├── /problems        → Problem Management
├── /execute-code    → Code Execution
├── /submissions     → User Submissions
└── /playlist        → Problem Playlists

⚙️ Code Execution Flow

Admin

Creates a problem with:

Description

Test cases

Constraints

Reference solution

Problem is validated using Judge0

Saved to database if validation passes

User

Selects a problem

Writes and submits code

Code is executed against all test cases

If any test case fails → execution stops

If all pass → submission saved

System

Stores:

Submission result

Individual test case outputs

Tracks solved problems

Allows fetching submission history

🗄️ Database Design (High Level)
User

id

name

email

role (USER / ADMIN)

Problem

id

title

description

userId (creator)

testCases

referenceSolution

Submission

id

userId

problemId

code

language

status

testCaseResults

🛠️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/leetlab.git
cd leetlab

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/leetlab
JUDGE0_API_KEY=your_api_key
PORT=5000


Run backend:

npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

📷 Architecture Diagram

🎯 Future Enhancements

Code editor with syntax highlighting

Contest & leaderboard system

Discussion forums

Difficulty-based filtering

Dockerized deployment

CI/CD pipeline

🤝 Contributing

Contributions are welcome!
Feel free to fork the repo, open issues, and submit pull requests.

📜 License

This project is licensed under the MIT License.

✨ Author

Rahul Kumar
Full Stack Developer | MERN | System Design Enthusiast
