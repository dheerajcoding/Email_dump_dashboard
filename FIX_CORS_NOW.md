# 🔧 URGENT FIX - CORS Error Resolution

## Current Issue:
Your frontend and backend are deployed but can't communicate due to CORS policy.

**Frontend URL**: `https://email1-dump-dashboard-1.onrender.com`
**Backend URL**: `https://email1-dump-dashboard.onrender.com`

## ⚡ IMMEDIATE FIX - Do This Now:

### 1. Fix Backend CORS (2 minutes)

1. Go to: https://dashboard.render.com
2. Click on your **BACKEND service** (email1-dump-dashboard)
3. Click **"Environment"** on the left sidebar
4. Find `FRONTEND_URL` variable (or add it if missing)
5. **Set it to EXACTLY**:
   ```
   https://email1-dump-dashboard-1.onrender.com
   ```
6. Click **"Save Changes"**
7. Backend will auto-redeploy (wait ~2 minutes)

### 2. Fix Frontend API Connection (2 minutes)

1. Stay on https://dashboard.render.com
2. Click on your **FRONTEND service** (email1-dump-dashboard-1)
3. Click **"Environment"** on the left sidebar
4. Find `VITE_API_URL` variable (or add it if missing)
5. **Set it to EXACTLY**:
   ```
   https://email1-dump-dashboard.onrender.com
   ```
6. Click **"Save Changes"**
7. Frontend will auto-redeploy (wait ~2 minutes)

### 3. Clear Browser Cache

After both services finish redeploying:
1. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
2. Or press **F12** → Right-click refresh button → "Empty Cache and Hard Reload"

### 4. Verify It Works

Open: `https://email1-dump-dashboard-1.onrender.com`

You should see:
- ✅ No CORS errors in console
- ✅ "Connected to server" message
- ✅ Data loading from backend

---

## 📋 Environment Variables Summary

**Backend Service Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://neerajkumar4:neeraj123@dumper.7mm3hgn.mongodb.net/emaildumper
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_SECURE=true
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASS=qfrydpwiewurwxed
SENDER_EMAIL=ABHICL.MIS@adityabirlahealth.com
SUBJECT_PATTERN=SRS0735Live Policy Bazaar Pendency Report
FRONTEND_URL=https://email1-dump-dashboard-1.onrender.com
```

**Frontend Service Environment Variables:**
```
VITE_API_URL=https://email1-dump-dashboard.onrender.com
```

---

## 🐛 Still Not Working?

### Check Backend Logs:
1. Go to backend service on Render
2. Click "Logs" tab
3. Look for: "Connected to MongoDB" and "Server running"

### Check Frontend Console:
1. Open browser DevTools (F12)
2. Console tab should show: "✅ Connected to server"
3. Network tab should show successful API calls

### Verify URLs:
- Backend health: `https://email1-dump-dashboard.onrender.com/health`
- Should return: `{"status":"ok",...}`

---

## ⏱️ Timeline:
- Backend redeploy: ~2-3 minutes
- Frontend redeploy: ~2-3 minutes
- **Total time**: ~5 minutes

After both finish, your app will work! 🎉
