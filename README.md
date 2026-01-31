# 💻 LeetLab - A Clone of Leetcode

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

A fullstack coding practice platform inspired by LeetCode, built with modern web technologies.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deploy to AWS EC2](#deploy-to-aws-ec2-github-actions)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Code Execution Flow](#-code-execution-flow)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

LeetLab is a comprehensive coding challenge platform that allows users to create, solve, and manage programming problems with an integrated code execution environment powered by judge0.

---

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration
- 📝 **Problem Management** - Create and manage coding challenges
- ⚡ **Real-time Code Execution** - Run code with multiple test cases
- 📊 **Progress Tracking** - Monitor solved problems and submissions
- 🎯 **Playlist Organization** - Group problems into themed collections
- 🧪 **Test Case Validation** - Automatic validation against reference solutions

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Code Execution:** judge0

### Frontend
- **Language:** JavaScript
- **Framework:** React.js / Vue
- **Styling:** Tailwind CSS
- **UI Components:** DiceyUI
- **State Management:** Zustand
- **Form Validation:** Zod + React-Hook-Forms

---

## 📐 Architecture

### API Structure

```
API
├── Authentication
├── Problem Management
├── Code Execution (judge0)
├── Submission Tracking
└── Playlist Management
```

### Database Schema

The application uses Prisma ORM with PostgreSQL for:
- User profiles and authentication
- Problem definitions with test cases
- Submission history and results
- Playlist collections

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- PostgreSQL database
- judge0 API access

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/leetlab.git
cd leetlab

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

```bash
# Navigate to backend directory
cd backend

# Create .env file (see Environment Variables section)
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Running the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Running with Docker

Prerequisites: Docker and Docker Compose.

```bash
# From project root - build and start all services (PostgreSQL, backend, frontend)
docker compose up --build

# Or run in background
docker compose up -d --build
```

- **Frontend:** http://localhost:3000 (served by nginx; `/api` is proxied to the backend)
- **Backend API:** http://localhost:8081 (host port 8081 to avoid conflict with local backend on 8080)
- **PostgreSQL:** localhost:5433 (user: `leetlab`, password: `leetlab_secret`, db: `leetlab`) — host port 5433 to avoid conflict with local PostgreSQL on 5432

Migrations run automatically when the backend container starts. For code execution (judge0), set `JUDGE0_API_URL` (and optionally API key) in a `.env` file in the project root or pass them when running `docker compose up`.

### Deploy to AWS EC2 (GitHub Actions)

The repo includes a GitHub Actions workflow that deploys to an EC2 instance on every push to `main` (or manually via **Actions → Deploy to AWS EC2 → Run workflow**).

**1. EC2 setup**

- Launch an Ubuntu or Amazon Linux EC2 instance.
- Install Docker and Docker Compose on the instance (e.g. [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose plugin](https://docs.docker.com/compose/install/)).
- Ensure the instance security group allows:
  - **Inbound:** SSH (22) from your IP or GitHub’s IPs, and ports **80** (or **3000**) and **8080** for the app and API.
- Create an SSH key pair for deployments (e.g. `ssh-keygen -t ed25519 -f deploy_key`). Add the **public** key to the EC2 user’s `~/.ssh/authorized_keys` (e.g. `ec2-user` or `ubuntu`).

**2. GitHub repository secrets**

In the repo: **Settings → Secrets and variables → Actions**, add:

| Secret           | Description                                      |
|------------------|--------------------------------------------------|
| `EC2_HOST`       | EC2 public IP or hostname (e.g. `3.110.xx.xx`)  |
| `EC2_SSH_KEY`    | Full contents of the **private** deploy key file |
| `EC2_USER`       | SSH user (e.g. `ec2-user` or `ubuntu`); optional, defaults to `ec2-user` |

**3. First-time setup on EC2**

SSH into the instance and create the app directory and optional `.env`:

```bash
mkdir -p ~/leetlab
# Optional: create ~/leetlab/.env for production (CORS, judge0)
# CORS_ORIGIN=http://YOUR_EC2_PUBLIC_IP:3000
# JUDGE0_API_URL=https://your-judge0-url
```

**4. Deploy**

- Push to `main` to trigger the workflow, or run **Deploy to AWS EC2** from the Actions tab.
- The workflow syncs the repo to `~/leetlab` on EC2 and runs `docker compose up -d --build`.

After a successful run, open **http://YOUR_EC2_IP:3000** (frontend) and **http://YOUR_EC2_IP:8080** (API). For production, set `CORS_ORIGIN` in `~/leetlab/.env` to your frontend URL (e.g. `http://your-domain.com:3000` or your domain).

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/leetlab"

# Authentication
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# judge0 API
JUDGE0_API_URL="https://judge0-ce.p.rapidapi.com"
JUDGE0_API_KEY="your-judge0-api-key"

# Server
PORT=5000
NODE_ENV="development"
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create new problem (Admin)
- `PUT /api/problems/:id` - Update problem (Admin)
- `DELETE /api/problems/:id` - Delete problem (Admin)

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/user/:userId` - Get user submissions

### Playlists
- `GET /api/playlists` - List all playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get playlist with problems

---

## 🔄 Code Execution Flow

### 1. Problem Creation (Admin/User)
```
User creates problem → Define test cases → Add reference solution → Save to DB
```

### 2. Problem Selection
```
User browses problems → Selects problem → Loads editor with boilerplate
```

### 3. Code Submission & Execution
```
User submits code → Loop through test cases → Execute via judge0 → 
If fail: Stop and return error → If pass: Continue to next test → 
Save results to DB
```

### 4. Progress Tracking
```
Store test results → Update user statistics → Display submission history
```

---



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by [LeetCode](https://leetcode.com/)
- Code execution powered by [judge0](https://judge0.com/)
- Built with modern web development best practices

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

**Happy Coding! 🚀**
