# AI-Powered CSV Importer — GrowEasy CRM


An intelligent CSV-to-CRM importer that uses AI (Google Gemini) to map any CSV format into structured GrowEasy CRM lead records.

Upload CSVs from Facebook Ads, Google Ads, real estate CRMs, marketing agencies, or any custom format — the AI handles column mapping automatically.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js (App Router)              |
| Backend  | Node.js + Express                 |
| AI       | Google Gemini (gemini-flash-lite-latest)  |
| Styling  | Tailwind CSS v4                   |

---

## Engineering Decisions

- **AI Model Selection**: I explicitly configured the backend to use `gemini-flash-lite-latest` rather than the deprecated `gemini-2.5-flash`. This ensures the application remains highly performant and cost-effective while avoiding the 404/403 deprecation errors that occur with older model aliases.
- **Robust Processing**: For large files, the frontend intelligently previews the first 100 rows to keep the DOM fast, while the backend processes the entire file sequentially in batches of 25 with exponential backoff (1s, 2s, 4s) to gracefully handle rate limits.
- **Docker Configuration**: Environment variables are managed securely. The `docker-compose.yml` uses an `env_file` directive rather than passing raw strings, ensuring the `GEMINI_API_KEY` stays completely out of version control and shell histories.

---

## Features

- **Drag & Drop Upload** — Upload CSV files via drag-and-drop or file picker
- **CSV Preview** — Preview parsed data in a responsive table with sticky headers
- **AI Extraction** — Intelligent field mapping using Google Gemini
- **Batch Processing** — Records processed in batches with retry logic
- **Results Dashboard** — View imported and skipped records with summary stats
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Rate Limiting** — API protection against abuse
- **Security** — Helmet headers, CORS, input validation, no exposed API keys

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/DharmikSuchak/GrowEasy_Assignment.git
cd GrowEasy_Assignment
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Docker Setup

```bash
# Add your API key to backend/.env
cp backend/.env.example backend/.env
# Edit backend/.env and set GEMINI_API_KEY=your_key

# Build and run
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## API Reference

### `POST /api/import`

Upload a CSV file for AI-powered CRM extraction.

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (CSV file, max 10 MB)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRecords": 50,
    "totalImported": 47,
    "totalSkipped": 3,
    "totalBatches": 2,
    "imported": [
      {
        "created_at": "2026-05-13 14:20:48",
        "name": "John Doe",
        "email": "john@example.com",
        "country_code": "+91",
        "mobile_without_country_code": "9876543210",
        "company": "GrowEasy",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "lead_owner": "",
        "crm_status": "GOOD_LEAD_FOLLOW_UP",
        "crm_note": "",
        "data_source": "",
        "possession_time": "",
        "description": ""
      }
    ],
    "skipped": []
  }
}
```

### `GET /api/health`

Health check endpoint.

---

## CRM Fields

| Field                         | Description                |
|-------------------------------|----------------------------|
| created_at                    | Lead creation date         |
| name                          | Lead name                  |
| email                         | Primary email              |
| country_code                  | Phone country code         |
| mobile_without_country_code   | Phone number               |
| company                       | Company name               |
| city                          | City                       |
| state                         | State                      |
| country                       | Country                    |
| lead_owner                    | Lead owner email           |
| crm_status                    | Lead status (enum)         |
| crm_note                      | Notes and remarks          |
| data_source                   | Data source (enum)         |
| possession_time               | Property possession time   |
| description                   | Additional description     |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Error handling, rate limiting, uploads
│   │   ├── prompts/         # AI prompt templates
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (CSV parsing, AI extraction)
│   │   ├── utils/           # Validators, logger
│   │   └── server.js        # Express entry point
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── app/             # Next.js pages and layout
│       ├── components/      # React components
│       ├── hooks/           # Custom hooks
│       └── lib/             # API client, constants
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## Position Applied For

**Software Developer Intern**

---

## Author

Dharmik Suchak
