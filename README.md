# CrackrDev - AI-Powered Interview Preparation Platform

A modern, interactive platform to help developers prepare for technical interviews across multiple specializations. Practice real interview scenarios with AI-generated questions, receive instant feedback, and track your progress.

## 🎯 Project Overview

CrackrDev is a Next.js-based application that simulates technical interview experiences. Users can:
- Select their target role and experience level
- Upload their resume for context-aware questions
- Practice interviews with AI-generated questions
- Get real-time transcription and feedback
- Track performance across multiple interview sessions

## ✨ Key Features

### Interview Customization
- **8 Role Options**: Frontend, Backend, Full Stack, Android, Data Engineering, Machine Learning, Data Science, DevOps
- **4 Experience Levels**: Fresher, 1-2 years, 3-5 years, 5+ years
- **3 Difficulty Tiers**: Easy, Medium, Hard

### Core Capabilities
- **Resume Parsing**: Upload and parse resumes for personalized question generation
- **Real-time Audio Transcription**: Groq Whisper integration for speech-to-text
- **Session Management**: Create, manage, and complete interview sessions
- **Dashboard**: Track interview history and performance metrics
- **Authentication**: Secure user authentication with Supabase

### User Experience
- Responsive design with Tailwind CSS
- Smooth animations with GSAP
- Role-based access control
- Protected routes for authenticated users

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Animations**: GSAP

### Backend & Services
- **Database & Auth**: Supabase
- **Audio Processing**: Groq (Whisper API)
- **API**: Next.js API Routes

### Developer Tools
- **Linting**: ESLint
- **PostCSS**: PostCSS with Tailwind
- **Build**: Next.js built-in build system

## 📁 Project Structure

```
app/
├── (auth)/                 # Authentication pages
│   ├── login/
│   ├── signup/
│   ├── callback/
│   └── reset-password/
├── (protected)/            # Protected routes
│   ├── dashboard/          # User dashboard
│   └── interview/          # Interview setup & management
│       └── [sessionId]/     # Session-specific pages
├── (public)/               # Public pages
├── api/                    # API routes
│   ├── questions/          # Fetch interview questions
│   ├── sessions/           # Session management
│   ├── resume/             # Resume parsing
│   └── transcribe/         # Audio transcription
└── components/             # Reusable React components

lib/
├── auth.ts                 # Authentication utilities
├── auth-context.tsx        # Auth context provider
├── supabase/               # Supabase clients (admin, client, server)
└── [utility files]         # Session, resume, question utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crackrdev_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Create optimized production build
- **`npm start`** - Run production server
- **`npm run lint`** - Run ESLint for code quality checks

## 🔐 Authentication Flow

The application uses Supabase with SSR (Server-Side Rendering) for secure authentication:
- Sign up / Login pages
- Password reset functionality
- OAuth callback handling
- Protected routes that require authentication
- Session-based access control

## 💾 Database Schema

Interview sessions store:
- `question_ids` - Array of question IDs for the session
- `user_id` - Associated user
- Session metadata for tracking and analysis

## 🎤 Audio Processing

The application uses the **Groq Whisper API** for real-time audio transcription:
- Supports English language transcription
- Handles large audio files efficiently
- Integrated into the interview experience for response capturing

## 🔄 API Routes Overview

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/questions` | GET | Fetch interview questions for a session |
| `/api/sessions/start` | POST | Create new interview session |
| `/api/sessions/[id]/complete` | POST | Complete an interview session |
| `/api/resume/parse` | POST | Parse uploaded resume |
| `/api/transcribe` | POST | Transcribe audio to text |

## 🎨 Difficulty Breakdown by Role

Each role has specific topics for each difficulty level:
- **Easy**: Fundamentals (JavaScript, Python, etc.)
- **Medium**: In-depth concepts (Data structures, APIs, system basics)
- **Hard**: Advanced topics (System design, complex DSA, performance optimization)

```

