# 🚀 Deploying to Render

This guide will help you deploy the Email Lead Sync Dashboard to Render.

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

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Fill in the environment variables (see below)
6. Click "Apply" to deploy

### Option B: Manual Deployment

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `email-lead-sync-dashboard`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preferred plan)

## 🔐 Step 4: Configure Environment Variables

Add the following environment variables in Render dashboard:

### Required Variables:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (Render provides this automatically) |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/email-leads` | MongoDB connection string |
| `IMAP_HOST` | `imap.gmail.com` | IMAP server hostname |
| `IMAP_PORT` | `993` | IMAP port (usually 993 for secure) |
| `IMAP_SECURE` | `true` | Use secure connection |
| `EMAIL_USER` | `your.email@domain.com` | Email account to monitor |
| `EMAIL_PASS` | `your-app-password` | Email app-specific password |
| `SENDER_EMAIL` | `sender@domain.com` | Filter emails from this sender |
| `SUBJECT_PATTERN` | `Daily Report` | Subject line pattern to match |
| `FRONTEND_URL` | `https://your-app.onrender.com` | Your Render app URL |

### How to Add Environment Variables in Render:

1. In your web service dashboard, go to "Environment"
2. Click "Add Environment Variable"
3. Enter the key and value
4. Click "Save Changes"
5. Render will automatically redeploy with new variables

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

After deployment completes:

1. Visit your app URL: `https://your-app-name.onrender.com`
2. Check the logs in Render dashboard for any errors
3. Test the health endpoint: `https://your-app-name.onrender.com/health`
4. Verify the dashboard loads correctly
5. Wait for email polling to start (first check happens immediately, then every 10 minutes)

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
