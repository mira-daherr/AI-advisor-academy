# AcademicAdvisor AI 🎓

An intelligent academic guidance platform that uses AI to help students find their perfect university, major, and scholarship path.

## 🚀 Quick Start (Production/Docker)

1. **Clone the repository**
2. **Setup environment variables**
   - Copy `.env.example` to `.env`
   - Add your `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, and `JWT_SECRET`.
3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
4. **Seed the database (Optional)**
   ```bash
   docker-compose exec server node scripts/seed.js
   ```

## 🛠️ Local Development Setup

### Backend (/server)
1. `cd server`
2. `npm install`
3. `npm run dev` (Runs on port 3000)

### Frontend (/client)
1. `cd client`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

## 📁 Project Structure

- `/client`: React (Vite) + Tailwind CSS + Framer Motion
- `/server`: Node.js + Express + MongoDB + Puppeteer (PDFs)
- `/server/services/aiAdvisor.ts`: Claude 3.5 Sonnet Integration
- `/server/services/pdfGenerator.ts`: PDF generation service

## ✨ Key Features

- **Conversational Questionnaire**: Beautiful multi-step student intake.
- **AI Recommendation Engine**: Personalized matching for majors and universities.
- **Interactive Dashboard**: Grade tracking, saved matches, and comparison tools.
- **AI Academic Chat (Premium)**: 24/7 advisor with context of your profile.
- **PDF Report Export (Premium)**: Professional 6-page academic assessment.
- **Stripe Subscriptions**: Tiered access for Free and Premium users.

## 🛡️ API Endpoints

- `GET /health`: System health check
- `POST /api/auth/register`: User signup
- `GET /api/recommendations/latest`: Get latest AI results
- `POST /api/chat/message`: Converse with AI Advisor
- `GET /api/reports/download`: Export PDF (Premium)

---
Built with ❤️ by the AcademicAdvisor Team.
