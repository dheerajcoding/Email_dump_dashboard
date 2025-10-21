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

### 2. Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `email-lead-sync-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for always-on)

### 3. Add Backend Environment Variables

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
FRONTEND_URL=https://your-frontend.onrender.com
```

**Note**: Save the backend URL: `https://email-lead-sync-backend-xxxx.onrender.com`

### 4. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `email-lead-sync-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

### 5. Add Frontend Environment Variable

```
VITE_API_URL=https://email-lead-sync-backend-xxxx.onrender.com
```

**Replace** with your actual backend URL from step 3!

### 6. Update Backend CORS

Go back to backend service environment variables and update:
```
FRONTEND_URL=https://email-lead-sync-frontend-xxxx.onrender.com
```

**Replace** with your actual frontend URL from step 4!

### 7. Verify

- [ ] Visit `https://your-frontend.onrender.com`
- [ ] Check `/health` on backend: `https://your-backend.onrender.com/health`
- [ ] Monitor backend logs for email polling
- [ ] Test dashboard functionality
- [ ] Verify real-time updates work

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
