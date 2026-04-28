# 🚀 CodeInsight AI

**AI-powered code review and refactoring tool for developers**

Live Demo: [https://code-insight-cyan.vercel.app/](https://code-insight-cyan.vercel.app/)

---

## 📌 Overview

CodeInsight AI is a full-stack web application that analyzes your code using AI, detects issues, suggests improvements, and provides a clean refactored version — similar to a senior engineer review.

It helps developers write:

* cleaner code
* more secure code
* better structured code

---

## ✨ Features

* 🧠 AI-powered code review (Groq LLM)
* 📊 Code quality scoring (0–10)
* 🐞 Issue detection (security, performance, style)
* 🔧 Refactored code suggestions
* 🔀 Diff view (original vs improved code)
* 🧾 Click-to-highlight issue lines
* 📋 One-click copy for refactored code
* 🎯 Language support (JavaScript, Python, Java)
* 🎨 Modern SaaS-style UI

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Monaco Editor
* Framer Motion

### Backend

* Node.js
* Express.js
* Groq AI API

### Deployment

* Frontend: Vercel
* Backend: Render

## 🏗️ Architecture

```text
Frontend (React + Monaco Editor)
        ↓
Backend (Express API)
        ↓
Groq AI Model
        ↓
Structured JSON Response
        ↓
UI Rendering (Issues, Score, Diff)
```

## 🚀 How It Works

1. User writes or pastes code
2. Frontend sends code to backend API
3. Backend sends request to Groq AI
4. AI returns:

   * issues
   * summary
   * refactored code
   * score
5. UI renders results in structured tabs

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/BhaweshPandey-03/CodeInsight.git
```

---

### 2. Backend setup

```bash
cd server
npm install
npm run dev
```

Create `.env`:

```
GROQ_API_KEY=your_api_key
```

---

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

Create `.env`:

```
VITE_API_URL=https://your-backend-url
```

---

## 🌟 Future Improvements

* 🔐 Authentication (login system)
* 💾 Save code history
* 📊 Advanced scoring breakdown (security/performance/style)
* 🤝 Shareable review links
* 🌙 Dark/light theme toggle

---

## 👨‍💻 Author

**Bhawesh Pandey**

* GitHub: [https://github.com/BhaweshPandey-03](https://github.com/BhaweshPandey-03)
* Project: CodeInsight AI

---

## 📄 License

MIT License
