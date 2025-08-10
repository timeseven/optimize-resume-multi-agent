# Multi-Agent Resume Optimization System

An AI-powered intelligent resume optimization platform that analyzes resume-job description matching through multi-agent collaboration, providing personalized optimization suggestions and interview preparation guidance.

## 🚀 Features

### Core Features

- **Intelligent Resume Parsing**: Automatically extracts key information from resumes (skills, experience, education, etc.)
- **Job Description Analysis**: Deep analysis of job requirements, identifying key skills and qualifications
- **Gap Analysis**: Intelligent comparison between resume and job requirements, identifying skill and experience gaps
- **Personalized Recommendations**: Provides targeted improvement suggestions, including keyword optimization and skill development paths
- **Interview Preparation**: Generates potential interview questions and areas to emphasize

### Technical Features

- **Multi-Agent Architecture**: Uses LangGraph to build intelligent agent collaboration workflows
- **AI-Driven Analysis**: Intelligent analysis based on OpenAI GPT models
- **Real-time Optimization**: Supports PDF, Word, and other resume format uploads and parsing
- **Responsive Design**: Modern web interface supporting mobile and desktop

## 🏗️ System Architecture

### Backend Architecture

- **Framework**: FastAPI + Python 3.12+
- **Database**: SQLite 
- **AI Framework**: LangChain + LangGraph + OpenAI
- **Authentication**: JWT + OAuth2 Password Grant
- **Document Processing**: PyPDF + docx2txt
- **Database Migration**: Alembic

### Frontend Architecture

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling & UI**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand + React Query
- **Form Handling**: React Hook Form + Zod validation

### Agent Architecture

```
Resume Extractor → JD Analyzer → Gap Detector → Optimization Report
```

## 📦 Installation and Setup

### Requirements

- Python 3.12+
- Node.js 18+
- Bun

### Backend Setup

1. **Clone the project and enter the backend directory**

```bash
cd backend
```

2. **Create virtual environment and install dependencies**

```bash
uv venv
source .venv/bin/activate  # Linux/Mac
# or .venv\Scripts\activate  # Windows
uv sync
```

3. **Configure environment variables**

Create a `.env` file:

```env
ENVIRONMENT=local
PROJECT_NAME="Resume Optimization API"
FRONTEND_HOST="http://localhost:3000"
BACKEND_CORS_ORIGINS="http://localhost:8000"
DATABASE_URL="sqlite+aiosqlite:///./test.db"
ALEMBIC_DATABASE_URL="sqlite:///./test.db"
OPENAI_API_KEY="your-openai-api-key"
ACCESS_SECRET_KEY="your-secret-key"
```

4. **Run database migrations**

```bash
just migrate
```

5. **Start backend service**

```bash
just run
```

### Frontend Setup

1. **Enter the frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
bun install
# or npm install
```

3. **Start development server**

```bash
bun dev
# or npm run dev
```

## 🎯 Usage

### 1. User Registration/Login

- Visit `/signup` to create a new account
- Use `/signin` to log into the system

### 2. Upload Resume

- Supports PDF, Word document formats
- System automatically parses resume content
- Extracts key information and stores it structurally

### 3. Add Job Description

- Input or paste job description
- System analyzes job requirements
- Identifies key skills and qualifications

### 4. Start Analysis

- Select the resume and job to analyze
- Click "Start Analysis" button
- System executes multi-agent collaborative analysis

### 5. View Results

- **Match Score**: Overall matching score (0-100)
- **Gap Analysis**: Specific gaps in skills, experience, education, etc.
- **Optimization Suggestions**: Keyword suggestions, resume improvement recommendations
- **Interview Preparation**: Potential interview questions and areas to emphasize

## 🔧 Development Guide

### Backend Development

**Project Structure**

```
backend/
├── app/
│   ├── core/           # Core configuration and tools
│   ├── modules/        # Business modules
│   │   ├── auth/       # Authentication module
│   │   ├── resume/     # Resume management
│   │   ├── job/        # Job management
│   │   └── optimization/ # Optimization analysis
│   └── main.py         # Application entry point
├── migrations/          # Database migrations
└── justfile            # Development commands
```

**Common Commands**

```bash
# Run development server
just run

# Code checking
just ruff

# Code formatting
just lint

# Database migration
just mm "migration message"
just migrate
```

### Frontend Development

**Project Structure**

```
frontend/
├── src/
│   ├── app/            # Next.js page routing
│   ├── components/     # Common UI components
│   ├── features/       # Feature module components
│   ├── hooks/          # Custom Hooks
│   ├── lib/            # Utility functions
│   └── stores/         # State management
```

**Common Commands**

```bash
# Development mode
bun dev

# Build production version
bun build

# Code checking
bun lint
```

## 🤖 Agent System

### Resume Extractor Agent

- Parses resume documents
- Extracts structured information
- Standardizes data format

### JD Analyzer Agent

- Analyzes job descriptions
- Identifies key requirements
- Extracts skills and qualifications

### Gap Detector Agent

- Compares resume with job requirements
- Identifies skill and experience gaps
- Generates optimization recommendations

## 📊 API Documentation

After starting the backend service, visit the following addresses to view API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details



## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework
- [Next.js](https://nextjs.org/) - React full-stack framework
- [LangChain](https://langchain.com/) - LLM application development framework
- [OpenAI](https://openai.com/) - AI model services
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
