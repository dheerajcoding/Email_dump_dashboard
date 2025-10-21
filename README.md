# Email Lead Sync Dashboard - Simple Version# Email Lead Sync Dashboard 📧



## 📋 What It DoesA full-stack MERN application that automatically fetches emails from a specified mailbox, extracts lead data from Excel attachments, and displays them in a real-time dashboard.



This system automatically fetches **ONLY TODAY'S LEADS** from your email and displays them on a dashboard.## 🎯 Features



### Key Features:- **Automatic Email Polling**: Checks for new emails every 10 minutes

- ✅ Fetches emails from specific sender- **Excel Data Extraction**: Reads and parses Excel/CSV attachments automatically

- ✅ Looks for **TODAY'S DATE** in email subject- **Real-time Updates**: Uses Socket.io for instant dashboard updates

- ✅ Extracts data from Excel attachments- **Daily Database Reset**: Clears all data at 12:00 AM IST using cron jobs

- ✅ Displays on dashboard with pagination- **Search & Sort**: Filter and sort leads by any column

- ✅ Clears database at midnight automatically- **Responsive Design**: Modern UI built with React and TailwindCSS

- ✅ Real-time updates

## 🏗️ Tech Stack

---

### Backend

## 🚀 Quick Start- Node.js + Express.js

- MongoDB with Mongoose

### 1. Start Backend- ImapFlow (IMAP email client)

```bash- XLSX (Excel parsing)

cd backend- Socket.io (real-time communication)

node server.js- Node-cron (scheduled tasks)

```

### Frontend

### 2. Start Frontend- React 18

```bash- Vite (build tool)

cd frontend- TailwindCSS (styling)

npm run dev- Axios (HTTP client)

```- Socket.io Client (real-time updates)

- React Icons

### 3. Open Dashboard

```## 📁 Project Structure

http://localhost:5174

``````

email_dumper/

---├── backend/

│   ├── models/

## 🔄 How It Works│   │   └── Lead.js              # MongoDB schema for leads

│   ├── routes/

### Daily Workflow:│   │   └── leadRoutes.js        # API endpoints

│   ├── services/

1. **System checks emails every 10 minutes**│   │   ├── emailService.js      # IMAP email fetching

2. **Searches for emails with TODAY'S DATE in subject**│   │   └── excelService.js      # Excel parsing

   - Example: "SRS0735Live Policy Bazaar Pendency Report as on 19-October-2025"│   ├── utils/

3. **Downloads Excel attachments**│   │   ├── cronJobs.js          # Daily reset scheduler

4. **Extracts data from Sheet2**│   │   └── emailPoller.js       # Email polling logic

5. **Stores in MongoDB with today's date (2025-10-19)**│   ├── server.js                # Main server file

6. **Displays on dashboard immediately**│   ├── package.json

│   └── .env.example

### Midnight Behavior:├── frontend/

│   ├── src/

- **12:00 AM IST**: Database clears automatically│   │   ├── components/

- **New day starts**: Only new date's emails will be fetched│   │   │   ├── Dashboard.jsx    # Main dashboard

- **Previous data**: Completely removed│   │   │   ├── Header.jsx       # Header with stats

│   │   │   ├── LeadsTable.jsx   # Data table

---│   │   │   └── Toast.jsx        # Notifications

│   │   ├── App.jsx

## 🔍 How Date Filtering Works│   │   ├── main.jsx

│   │   └── index.css

### Email Subject Format:│   ├── package.json

```│   └── vite.config.js

SRS0735Live Policy Bazaar Pendency Report as on 19-October-2025├── package.json                 # Root package.json

                                                 ^^^^^^^^^^^^^^^^└── README.md

                                                 Must match TODAY```

```

## 🚀 Quick Start

### Logic:

1. System generates today's date: `19-October-2025`### Prerequisites

2. Searches ALL emails from sender (not just unread)

3. Only processes emails where subject contains today's date- Node.js (v16 or higher)

4. Stores with date: `2025-10-19`- MongoDB (running locally or MongoDB Atlas)

5. Dashboard shows only today's leads- Email account with IMAP access

- App-specific password (for Gmail)

---

### Installation

## 📅 Example Timeline

1. **Clone or navigate to the project directory**

### October 19, 2025 (Today):   ```bash

- System looks for: `19-October-2025` in subject   cd "c:\Users\Anuj kumar\OneDrive\Desktop\email_dumper"

- Dashboard shows: All leads from Oct 19 emails   ```

- Total leads: Based on today's emails

2. **Install all dependencies**

### October 20, 2025 (Tomorrow):   ```bash

- **12:00 AM**: Database clears (Oct 19 data deleted)   npm run install-all

- System looks for: `20-October-2025` in subject   ```

- Dashboard shows: Only Oct 20 leads

- Oct 19 leads: Gone forever3. **Configure Backend Environment**

   ```bash

---   cd backend

   copy .env.example .env

## 🎯 Key Points   ```



1. **NOT based on "unread" emails** - Searches ALL emails by date   Edit `backend/.env` with your credentials:

2. **Only TODAY's date** - Ignores yesterday and future dates   ```env

3. **Automatic cleanup** - Midnight reset   MONGODB_URI=mongodb://localhost:27017/email-leads

4. **Real-time updates** - Socket.io   IMAP_HOST=imap.gmail.com

5. **Paginated** - 50 leads per page   IMAP_PORT=993

   IMAP_SECURE=true

---   EMAIL_USER=ABHICL.MIS@adityabirlahealth.com

   EMAIL_PASS=your-app-specific-password

## 🛠️ Configuration   SENDER_EMAIL=ABHICL.MIS@adityabirlahealth.com

   SUBJECT_PATTERN=SRS0735Live Policy Bazaar Pendency Report

Edit `backend/.env`:   PORT=5000

```env   FRONTEND_URL=http://localhost:5173

SENDER_EMAIL=ABHICL.MIS@adityabirlahealth.com   ```

SUBJECT_PATTERN=SRS0735Live Policy Bazaar Pendency Report

```4. **Start MongoDB**

   Make sure MongoDB is running on your system.

---

5. **Run the application**

## ✅ System is Ready!   ```bash

   cd ..

- ✅ Fetches ONLY today's leads   npm run dev

- ✅ Filters by date in subject line   ```

- ✅ Ignores unread/read status

- ✅ Clears daily at midnight   This will start:

- ✅ Shows on dashboard with pagination   - Backend server on `http://localhost:5000`

   - Frontend development server on `http://localhost:5173`

**Open Dashboard**: http://localhost:5174

## 🔧 Configuration

---

### Email Setup (Gmail)

**Date**: October 19, 2025

1. Enable IMAP in Gmail settings
2. Create an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification
   - App passwords → Generate new password
3. Use the app password in `.env` file

### MongoDB Setup

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/email-leads
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-leads
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Fetch all leads |
| GET | `/api/stats` | Get statistics |
| DELETE | `/api/leads` | Clear all leads (manual) |
| GET | `/health` | Health check |

## 🔄 How It Works

1. **Email Polling**: Every 10 minutes, the app checks for new emails from the specified sender
2. **Excel Extraction**: Downloads Excel attachments and parses all rows
3. **Data Storage**: Saves extracted data to MongoDB (including duplicates)
4. **Real-time Updates**: Emits Socket.io events to update the dashboard instantly
5. **Daily Reset**: At 12:00 AM IST, the database is cleared automatically

## 🎨 Frontend Features

- **Auto-refresh**: Dashboard updates automatically when new leads arrive
- **Search**: Filter leads by any column
- **Sort**: Click column headers to sort
- **Toast Notifications**: Visual feedback for new leads and updates
- **Responsive Design**: Works on desktop and mobile

## 📦 Available Scripts

### Root Directory
- `npm run install-all` - Install all dependencies
- `npm run dev` - Run both frontend and backend in development mode
- `npm run backend` - Run only backend
- `npm run frontend` - Run only frontend
- `npm run build` - Build frontend for production

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Email Connection Issues
- Verify IMAP is enabled
- Check app password is correct
- Ensure firewall allows IMAP connections (port 993)

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database user has proper permissions

### No Emails Detected
- Check subject pattern matches exactly
- Verify sender email is correct
- Look for emails in "All Mail" folder (not just Inbox)

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use app-specific passwords, not account passwords
- Keep MongoDB credentials secure
- Use environment variables for all sensitive data

## 📝 Notes

- The app stores ALL rows from Excel, including duplicates
- Database clears at 12:00 AM IST daily (configurable in `utils/cronJobs.js`)
- Email polling interval is 10 minutes (configurable in `utils/emailPoller.js`)
- Temp files are automatically cleaned after processing

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC

---

**Built with ❤️ using the MERN stack**
