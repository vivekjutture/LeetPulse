# ⚡ LeetPulse

A fast, free, and open-source REST API to fetch LeetCode user profile data — solved problem stats, contest ratings, badges, submission history, and more. Built as a **Vercel serverless function** with a beautiful, responsive frontend.

> [!IMPORTANT]
> **No API key required. No rate limits. No authentication. Just clean JSON.**

## 🌐 Live Demo

🚀 Try LeetPulse Live Here [https://leetpulse-api.vercel.app](https://leetpulse-api.vercel.app)

---

## 📸 Features

- 🔥 **9 API Endpoints** — Profile, Solved, Contest, Badges, Submissions, Languages, Skills, and more
- 🚀 **Serverless** — Runs on Vercel's free tier with zero infrastructure
- 🎨 **Beautiful UI** — Tailwind CSS, dark theme, glassmorphism, micro-animations
- 📱 **Mobile Responsive** — Looks great on all devices
- 📋 **Copy JSON** — One-click copy of API responses
- 🔢 **Line Numbers** — JSON preview with syntax highlighting and line numbers
- ⚠️ **Error Modals** — User-friendly error handling for invalid usernames
- 🌍 **CORS Enabled** — Call from any frontend, Postman, cURL, or HTTP client

---

## 📂 Project Structure

```
├── api/
│   └── leetcode.js        # Vercel serverless function (handles all endpoints)
├── public/
│   ├── index.html         # Frontend UI
│   └── output.css         # Compiled Tailwind CSS
├── src/
│   └── input.css          # Source Tailwind CSS with custom styles
├── dev.js                 # Local development server (mimics Vercel)
├── tailwind.config.js     # Tailwind CSS theme configuration
├── vercel.json            # Vercel rewrites for clean URL routing
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/vivekjutture/LeetPulse.git
cd leetpulse
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the dev server**
```bash
npm run dev
```
---

## 📖 API Documentation

All endpoints return **JSON** and follow the pattern:

```
GET /api/leetcode/<endpoint>/<username>
```

**Base URL (after deployment):**
```
https://leetpulse-api.vercel.app
```

### Available Endpoints

| Endpoint | URL Pattern | Description |
|----------|-------------|-------------|
| **Full** | `/api/leetcode/full/<username>` | Complete profile — all data combined |
| **Profile** | `/api/leetcode/profile/<username>` | Name, avatar, ranking, reputation, bio, links |
| **Solved** | `/api/leetcode/solved/<username>` | Total solved, easy/medium/hard breakdown |
| **Badges** | `/api/leetcode/badges/<username>` | Earned badges, upcoming badges, active badge |
| **Contest** | `/api/leetcode/contest/<username>` | Contest rating, global ranking, history |
| **Submission** | `/api/leetcode/submission/<username>` | Recent submissions (title, language, status) |
| **AC Submission** | `/api/leetcode/acSubmission/<username>` | Accepted submissions only |
| **Language** | `/api/leetcode/language/<username>` | Problems solved per programming language |
| **Skill** | `/api/leetcode/skill/<username>` | Skill tags: advanced, intermediate, fundamental |

### Optional Query Parameters

| Parameter | Applies To | Default | Description |
|-----------|-----------|---------|-------------|
| `limit` | `submission`, `acSubmission` | `20` | Number of submissions to return |

---

## 🔧 Usage Examples

### cURL

**Get solved stats**
```bash
curl https://leetpulse-api.vercel.app/api/leetcode/solved/neal_wu
```

**Get full profile**
```bash
curl https://leetpulse-api.vercel.app/api/leetcode/full/tourist
```

**Get recent submissions (limit 5)**
```bash
curl "https://leetpulse-api.vercel.app/api/leetcode/submission/neal_wu?limit=5"
```

### JavaScript (Fetch)

```javascript
const response = await fetch('https://leetpulse-api.vercel.app/api/leetcode/solved/neal_wu');
const data = await response.json();
console.log(`Total solved: ${data.solvedProblem}`);
console.log(`Easy: ${data.easySolved}, Medium: ${data.mediumSolved}, Hard: ${data.hardSolved}`);
```

### React / Next.js

```jsx
import { useState, useEffect } from 'react';

function LeetCodeStats({ username }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`https://leetpulse-api.vercel.app/api/leetcode/solved/${username}`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, [username]);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>{username}'s LeetCode Stats</h2>
      <p>Total Solved: {stats.solvedProblem}</p>
      <p>Easy: {stats.easySolved}</p>
      <p>Medium: {stats.mediumSolved}</p>
      <p>Hard: {stats.hardSolved}</p>
    </div>
  );
}
```

### Python

```python
import requests

response = requests.get('https://leetpulse-api.vercel.app/api/leetcode/contest/neal_wu')
data = response.json()

print(f"Rating: {data['contestRating']}")
print(f"Global Rank: {data['contestGlobalRanking']}")
print(f"Top: {data['contestTopPercentage']}%")
```

### Postman / SoapUI

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `https://leetpulse-api.vercel.app/api/leetcode/solved/neal_wu` |
| **Headers** | None required |
| **Auth** | None required |

Simply paste the URL and hit **Send**. No configuration needed.

---

## 📦 Sample API Responses

### `GET /api/leetcode/solved/neal_wu`

```json
{
  "solvedProblem": 253,
  "easySolved": 60,
  "mediumSolved": 141,
  "hardSolved": 52,
  "allQuestionsCount": [
    { "difficulty": "All", "count": 3865 },
    { "difficulty": "Easy", "count": 930 },
    { "difficulty": "Medium", "count": 2022 },
    { "difficulty": "Hard", "count": 913 }
  ],
  "acSubmissionNum": [
    { "difficulty": "All", "count": 253, "submissions": 440 },
    { "difficulty": "Easy", "count": 60, "submissions": 76 },
    { "difficulty": "Medium", "count": 141, "submissions": 236 },
    { "difficulty": "Hard", "count": 52, "submissions": 128 }
  ]
}
```

### `GET /api/leetcode/profile/neal_wu`

```json
{
  "username": "neal_wu",
  "realName": "Neal Wu",
  "userAvatar": "https://assets.leetcode.com/users/...",
  "ranking": 42,
  "reputation": 156,
  "school": "Harvard University",
  "countryName": "United States",
  "company": "",
  "githubUrl": "",
  "linkedinUrl": ""
}
```

### Error Response (User Not Found)

```json
{
  "error": "That user does not exist."
}
```

---

## 🏗️ How It Works

```
Client Request
     │
     ▼
┌─────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Your App   │────▶│  Vercel Serverless  │────▶│  LeetCode GraphQL│
│  or Postman │     │  /api/leetcode.js   │     │  API (public)    │
│             │◀────│                     │◀────│                  │
└─────────────┘     └────────────────────┘     └──────────────────┘
     JSON              Transforms data            Raw GraphQL
```

1. **Client** sends a GET request to your Vercel URL
2. **Vercel** rewrites the clean URL to the serverless function with query params
3. **Serverless function** makes a GraphQL query to LeetCode's public API
4. **Response** is cleaned up, formatted, and returned as JSON
5. **CORS headers** are set so any origin can call the API

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML, Tailwind CSS (CDN), Vanilla JavaScript |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **API Source** | LeetCode GraphQL (public, no auth) |
| **Deployment** | Vercel (free tier) |
| **HTTP Client** | `node-fetch` |

---

## ⚙️ Configuration

### `vercel.json`

The rewrite rule maps clean URLs to the serverless function:

```json
{
  "rewrites": [
    {
      "source": "/api/leetcode/:endpoint/:username",
      "destination": "/api/leetcode?endpoint=:endpoint&username=:username"
    }
  ]
}
```

This means `/api/leetcode/solved/neal_wu` internally becomes `/api/leetcode?endpoint=solved&username=neal_wu`.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

**Built with ☕ — Powered by LeetCode's public GraphQL endpoint**
