# 🚀 Deploying to Render (Separate Frontend & Backend)

This guide will help you deploy the Email Lead Sync Dashboard to Render with **separate services** for frontend and backend. This approach provides better performance, independent scaling, and is the recommended production setup.

## 🏗️ Architecture

- **Backend Service**: Node.js web service running the API and email polling
- **Frontend Service**: Static site serving the React application
- **Database**: MongoDB Atlas (cloud database)

## 📋 Prerequisites

Before deploying, make sure you have:

1. A GitHub account with this repository pushed to it
2. A Render account (sign up at https://render.com)
3. A MongoDB Atlas database (or other cloud MongoDB provider)
4. Your email credentials ready (IMAP settings and app password)

## 🗄️ Step 1: Set Up MongoDB Atlas (if not already done)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Create a database user with password
4. Add `0.0.0.0/0` to IP whitelist (allow from anywhere)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/email-leads`)

## 📦 Step 2: Push to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Render deployment"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## 🌐 Step 3: Deploy on Render

You'll create **TWO separate services**: one for backend and one for frontend.

### Deploy Backend First

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the **Backend Service**:
   - **Name**: `email-lead-sync-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for always-on service)
5. Click "Create Web Service"
6. **Note the backend URL**: `https://email-lead-sync-backend-xxxx.onrender.com`

### Deploy Frontend Second

1. In Render dashboard, click "New" → "Static Site"
2. Connect the same GitHub repository
3. Configure the **Frontend Service**:
   - **Name**: `email-lead-sync-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free
4. Click "Create Static Site"

### Option: Use Blueprint (Easier)

Alternatively, use the `render.yaml` file for automatic setup:

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and set up **both services automatically**
5. Fill in the environment variables (see below)
6. Click "Apply"

## 🔐 Step 4: Configure Environment Variables

### Backend Environment Variables

Add these in the backend service's "Environment" tab:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (Render sets this automatically) |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/email-leads` | MongoDB connection string |
| `IMAP_HOST` | `imap.gmail.com` | IMAP server hostname |
| `IMAP_PORT` | `993` | IMAP port (usually 993 for secure) |
| `IMAP_SECURE` | `true` | Use secure connection |
| `EMAIL_USER` | `your.email@domain.com` | Email account to monitor |
| `EMAIL_PASS` | `your-app-password` | Email app-specific password |
| `SENDER_EMAIL` | `sender@domain.com` | Filter emails from this sender |
| `SUBJECT_PATTERN` | `Daily Report` | Subject line pattern to match |
| `FRONTEND_URL` | `https://email-lead-sync-frontend-xxxx.onrender.com` | Your frontend URL (for CORS) |

### Frontend Environment Variables

Add these in the frontend service's "Environment" tab:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `VITE_API_URL` | `https://email-lead-sync-backend-xxxx.onrender.com` | Your backend API URL |

### Important Notes:

⚠️ **FRONTEND_URL** in backend must match your frontend's Render URL  
⚠️ **VITE_API_URL** in frontend must match your backend's Render URL  
⚠️ Make sure both URLs use `https://` protocol

## 🔧 Step 5: Gmail App Password Setup

If using Gmail, you need an app-specific password:

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to Security
3. Enable 2-Step Verification (if not already enabled)
4. Go to "App passwords"
5. Select "Mail" and "Other (Custom name)"
6. Name it "Email Lead Sync"
7. Copy the 16-character password
8. Use this password in the `EMAIL_PASS` environment variable

## ✅ Step 6: Verify Deployment

After both services are deployed:

### Test Backend
1. Visit: `https://your-backend.onrender.com/health`
2. Should return: `{"status":"ok","message":"Email Lead Sync Dashboard API is running"}`
3. Check logs for email polling messages

### Test Frontend
1. Visit: `https://your-frontend.onrender.com`
2. Dashboard should load correctly
3. Check browser console for any errors
4. Verify data loads from backend API

### Test Integration
1. Open browser developer tools (Network tab)
2. Verify API calls go to your backend URL
3. Check WebSocket connection is established
4. Wait for email polling cycle (check backend logs)

## 🐛 Troubleshooting

### Deployment Fails

**Problem**: Build or deployment errors

**Solutions**:
- Check the logs in Render dashboard
- Ensure all environment variables are set correctly
- Verify `package.json` scripts are correct
- Make sure MongoDB connection string is valid

### MongoDB Connection Error

**Problem**: Cannot connect to MongoDB

**Solutions**:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has proper permissions
- Test connection string locally first

### Email Not Fetching

**Problem**: No emails are being fetched

**Solutions**:
- Verify IMAP settings are correct
- Check app password is valid
- Ensure IMAP is enabled on your email account
- Look for error messages in Render logs
- Test email credentials locally first

### Frontend Not Loading

**Problem**: App shows "Cannot GET /"

**Solutions**:
- Ensure build completed successfully
- Check that `frontend/dist` folder was created during build
- Verify `NODE_ENV=production` is set
- Check server.js has static file serving code

### Real-time Updates Not Working

**Problem**: Dashboard doesn't update automatically

**Solutions**:
- Check Socket.io connection in browser console
- Verify CORS settings include your Render URL
- Ensure `FRONTEND_URL` environment variable is set correctly
- Try refreshing the page manually

## 📊 Monitoring Your App

### View Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Filter by error level if needed

### Check Metrics
1. Go to "Metrics" tab in Render dashboard
2. Monitor CPU, Memory, and Request metrics
3. Set up alerts for errors or downtime

## 🔄 Updating Your App

When you push changes to GitHub:

1. Render will automatically detect the push
2. It will trigger a new build and deploy
3. Your app will be updated with zero downtime

To manually trigger a deploy:
1. Go to your service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

## 💰 Cost Considerations

### Render Free Tier:
- **Web Services**: Free tier available (spins down after inactivity)
- **Limitations**: 
  - 750 hours/month of runtime
  - App spins down after 15 minutes of inactivity
  - Takes 30-60 seconds to spin up when accessed
  - Not suitable for always-on email polling

### For Production (Recommended):
- **Starter Plan**: $7/month
  - Always-on (no spin down)
  - Better for email polling
  - Faster performance

### MongoDB Atlas:
- **Free Tier (M0)**: 512MB storage (sufficient for most use cases)
- **Paid Tiers**: Start at $9/month for more storage

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong passwords** for MongoDB
3. **Rotate app passwords** regularly
4. **Use app-specific passwords**, not your main email password
5. **Monitor logs** for suspicious activity
6. **Keep dependencies updated** with `npm audit`

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Gmail IMAP Settings](https://support.google.com/mail/answer/7126229)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Getting Help

If you encounter issues:

1. Check Render logs first
2. Review the troubleshooting section above
3. Search Render community forum
4. Check MongoDB Atlas status page
5. Review email provider's IMAP documentation

## ✨ Success!

If everything is working:
- ✅ Dashboard loads at your Render URL
- ✅ Health endpoint returns status OK
- ✅ Emails are being fetched (check logs)
- ✅ Data appears in the dashboard
- ✅ Real-time updates work
- ✅ Midnight cleanup runs as scheduled

Your Email Lead Sync Dashboard is now live! 🎉

---

**Note**: First deployment can take 5-10 minutes. Be patient and monitor the logs.
