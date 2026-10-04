# Aarav's Story — Interactive Mental Health Awareness Experience

> A cinematic, interactive mental-health awareness story game built as a college academic project.

---

## What Is This?

"Aarav's Story" is a web experience where a college participant:

1. Enters their name and register number
2. Reads a fictional 9-chapter story about Aarav — a student struggling with his mental wellbeing
3. Answers 5 multiple-choice questions about the story
4. Receives a score
5. Has their participation saved to a Google Sheet

This is **not** a diagnostic tool or mental-health survey. It is purely an awareness and education experience.

---

## Features

- Cinematic 9-chapter scrolling story
- 5 MCQs scored server-side (client never knows the correct answers)
- Google Sheets data collection via Apps Script
- Rate limiting, input validation, and sanitisation
- No login, no email, no personal health data collected
- Deployable on Render as a single Web Service

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Vanilla CSS with design tokens |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Data | Google Sheets via Apps Script Web App |
| Deployment | Render |

---

## Local Development

### Prerequisites

- Node.js ≥ 18
- A Google account (for Sheets integration)

### Installation

```bash
git clone <your-repo-url>
cd mental-health-story

# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the project root (use `.env.example` as a template):

```bash
cp .env.example .env
```

Fill in the values:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001 in dev) |
| `GOOGLE_APPS_SCRIPT_URL` | Your deployed Apps Script Web App URL |
| `CORRECT_ANSWERS` | JSON string of correct answers (optional override) |

### Run in Development

Two terminals:

**Terminal 1 — Backend:**
```bash
node server/index.js
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

The Vite dev server proxies `/api` requests to `localhost:3001`.

```
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

---

## Google Sheets Setup

### Step 1 — Create the Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name the first sheet `Responses`.
3. Add these headers in Row 1 (A1 through O1):
   ```
   Timestamp | Name | Register Number | Q1 Answer | Q1 Result | Q2 Answer | Q2 Result | Q3 Answer | Q3 Result | Q4 Answer | Q4 Result | Q5 Answer | Q5 Result | Total Score | Completed
   ```

### Step 2 — Create the Apps Script

1. In your Google Sheet: **Extensions → Apps Script**
2. Delete all existing code and paste the following:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.registerNumber,
      data.q1Answer,  data.q1Result,
      data.q2Answer,  data.q2Result,
      data.q3Answer,  data.q3Result,
      data.q4Answer,  data.q4Result,
      data.q5Answer,  data.q5Result,
      data.totalScore,
      data.completed
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy → New Deployment**
4. Select **Type: Web App**
5. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy** and copy the Web App URL.
7. Paste the URL as `GOOGLE_APPS_SCRIPT_URL` in your `.env`.

> **Note:** If `GOOGLE_APPS_SCRIPT_URL` is not set, the server will still function but skip the Sheets append (useful for local testing).

---

## Correct Answers

The correct answers live **server-side only** in `server/config/answers.js`. The defaults are:

| Question | Correct | Rationale |
|----------|---------|-----------|
| Q1 | B | He started withdrawing from conversations |
| Q2 | A | Priya asked gently without pressuring him |
| Q3 | C | Dr. Pillai privately checked in and gave him the card |
| Q4 | B | He rebuilt small daily routines |
| Q5 | D | Healing is gradual and non-linear |

To override via environment variable:
```
CORRECT_ANSWERS={"q1":"B","q2":"A","q3":"C","q4":"B","q5":"D"}
```

---

## Production Build

```bash
npm run build    # builds client/dist/
npm start        # starts Express, serves API + built React app
```

---

## Render Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "init: mental health story project"
   git remote add origin <your-github-url>
   git push -u origin main
   ```

2. **Create Render Web Service:**
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub repository

3. **Configure:**
   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |
   | Environment | `Node` |

4. **Add Environment Variables in Render Dashboard:**
   - `NODE_ENV` = `production`
   - `GOOGLE_APPS_SCRIPT_URL` = your Apps Script URL
   - `CORRECT_ANSWERS` = (optional JSON override)

5. **Deploy.** Render will build and start the service.

6. **Test** your live Render URL end-to-end.

---

## Project Structure

```
mental/
├── client/                    # Vite + React frontend
│   ├── src/
│   │   ├── context/           # AppContext (global session state)
│   │   ├── data/              # storyData.ts, quizData.ts
│   │   ├── pages/             # Landing, Registration, Story, Quiz, Result
│   │   ├── services/          # api.ts (POST /api/submit)
│   │   └── utils/             # validation.ts
│   ├── index.html
│   └── vite.config.ts
│
├── server/
│   ├── config/answers.js      # Correct answers (server-only)
│   ├── middleware/             # Rate limiter, input validation
│   ├── routes/submit.js       # POST /api/submit
│   ├── services/sheets.js     # Google Apps Script proxy
│   └── index.js               # Express entry point
│
├── .env.example
├── .gitignore
├── package.json
├── render.yaml
└── README.md
```

---

## Security Notes

- Correct answers are never sent to the browser
- `GOOGLE_APPS_SCRIPT_URL` is a server-only env var
- Rate limiting: 20 requests per 15 minutes per IP on `/api/submit`
- All inputs are validated and sanitised server-side
- No credentials are committed to the repository

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Sheets not saving | Check `GOOGLE_APPS_SCRIPT_URL` is set and the Apps Script is deployed with "Anyone" access |
| Build fails | Run `cd client && npm install` and retry `npm run build` |
| Port conflict | Set `PORT=3002` in `.env` |
| SPA routes 404 on Render | Express already handles `*` fallback; ensure `NODE_ENV=production` is set |

---

## Disclaimer

This experience is intended for awareness and education. It is **not** a substitute for professional mental-health care. No personal mental-health information is collected from participants.
