# Deployment Guide for Render

This guide will help you deploy the Household Gamification App to Render.com.

## Prerequisites

1. A GitHub repository with your project code
2. A Render account (free tier available)
3. Basic understanding of environment variables

## Deployment Options

### Option 1: Deploy Using Blueprint (Recommended)

1. **Push to GitHub**: Make sure your code is in a GitHub repository

2. **Create Render Account**: Sign up at [render.com](https://render.com)

3. **Deploy from Blueprint**:
   - Go to your Render dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and deploy both services

### Option 2: Deploy Services Separately

#### Step 1: Deploy the Database

1. In Render dashboard, click "New" → "PostgreSQL" → "MongoDB"
2. Choose the **Free** plan
3. Set database name: `household-gamification-db`
4. Note the connection string for later use

#### Step 2: Deploy the Backend API

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `household-gamification-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=[Your MongoDB connection string from Step 1]
   JWT_SECRET=[Generate a secure random string]
   JWT_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   ```

5. **Advanced Settings**:
   - Health Check Path: `/health`
   - Auto-Deploy: Yes

#### Step 3: Deploy the Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repository  
3. Configure:
   - **Name**: `household-gamification-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://[your-backend-service-name].onrender.com/api
   REACT_APP_APP_NAME=Household Gamification
   GENERATE_SOURCEMAP=false
   ```

#### Step 4: Update Backend CORS

1. Go back to your backend service settings
2. Add environment variable:
   ```
   CLIENT_URL=https://[your-frontend-service-name].onrender.com
   FRONTEND_URL=https://[your-frontend-service-name].onrender.com
   ```

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secure-secret` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://yourapp.onrender.com` |
| `FRONTEND_URL` | Frontend URL (alternative) | `https://yourapp.onrender.com` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `1000` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://yourapi.onrender.com/api` |
| `REACT_APP_APP_NAME` | Application name | `Household Gamification` |
| `GENERATE_SOURCEMAP` | Generate source maps | `false` |

## Post-Deployment Setup

### 1. Seed the Database

After successful deployment, seed your database with initial data:

1. Go to your backend service in Render
2. Open the "Shell" tab
3. Run: `npm run seed`

This will create:
- Demo household
- Admin user: `admin@example.com` / `password123`
- Member user: `member@example.com` / `password123`
- 25 sample chores

### 2. Test the Application

1. Visit your frontend URL
2. Try logging in with the demo credentials
3. Test all features: chores, achievements, leaderboard, etc.

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CLIENT_URL` is set correctly in backend
   - Check that URLs don't have trailing slashes

2. **Database Connection Issues**:
   - Verify `MONGODB_URI` is correctly set
   - Check MongoDB service is running

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

4. **Frontend Not Loading**:
   - Ensure `_redirects` file is in `public` folder
   - Check `REACT_APP_API_URL` points to correct backend

### Viewing Logs

1. Go to your service in Render dashboard
2. Click on "Logs" tab
3. Monitor for errors or issues

### Health Checks

- Backend health check: `https://your-backend.onrender.com/health`
- Frontend: Check if the app loads without errors

## Performance Considerations

### Free Tier Limitations

- **Cold Starts**: Services may sleep after 15 minutes of inactivity
- **Database**: 1GB storage limit
- **Bandwidth**: 100GB/month

### Optimization Tips

1. **Database Indexing**: Ensure proper indexes for queries
2. **Image Optimization**: Compress any images used
3. **Code Splitting**: React automatically handles this
4. **Caching**: Browser caching is enabled by default

## Security Considerations

1. **Environment Variables**: Never commit secrets to GitHub
2. **JWT Secret**: Generate a strong, unique secret
3. **CORS**: Only allow your frontend domain
4. **Rate Limiting**: Configured to prevent abuse
5. **Helmet**: Security headers are enabled

## Scaling

When ready to scale beyond free tier:

1. **Upgrade Plans**: Move to paid plans for better performance
2. **Database**: Consider MongoDB Atlas for production
3. **CDN**: Use a CDN for static assets
4. **Monitoring**: Add application monitoring tools

## Support

- [Render Documentation](https://render.com/docs)
- [GitHub Issues](https://github.com/your-repo/issues)
- Check service logs for detailed error information