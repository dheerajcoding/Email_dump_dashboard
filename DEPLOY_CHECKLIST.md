# 🚀 Quick Deployment Checklist

## Before You Deploy

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string ready
- [ ] Email IMAP credentials ready (with app password)
- [ ] GitHub repository created and code pushed
- [ ] Render account created

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `email-lead-sync-dashboard`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for production)

### 3. Add Environment Variables

Copy these to Render Environment section:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/email-leads
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_SECURE=true
EMAIL_USER=your.email@domain.com
EMAIL_PASS=your-app-password
SENDER_EMAIL=sender@domain.com
SUBJECT_PATTERN=Your Subject Pattern
FRONTEND_URL=https://your-app-name.onrender.com
```

### 4. Deploy

Click "Create Web Service" - Render will:
- Clone your repository
- Install dependencies
- Build the frontend
- Start the server

### 5. Verify

- [ ] Visit `https://your-app-name.onrender.com`
- [ ] Check `/health` endpoint
- [ ] Monitor logs for email polling
- [ ] Test dashboard functionality

## Important Notes

⚠️ **Free Tier Limitations**:
- App spins down after 15 minutes of inactivity
- Takes 30-60 seconds to spin up
- Not ideal for continuous email polling

💰 **For Production Use**:
- Upgrade to Starter plan ($7/month)
- Ensures always-on service
- Better for email polling requirements

🔒 **Security**:
- Never commit `.env` files
- Use app-specific passwords
- Keep MongoDB credentials secure

## Troubleshooting

**Build Fails**: Check logs for specific errors
**MongoDB Error**: Verify connection string and IP whitelist
**Email Not Working**: Confirm IMAP settings and app password
**Frontend 404**: Ensure build completed and NODE_ENV=production

## Need Help?

See detailed guide in `DEPLOYMENT.md`
