# MongoDB Atlas Setup for Render Deployment

Since Render doesn't provide MongoDB (only PostgreSQL), we'll use MongoDB Atlas's free tier.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a new project (e.g., "Household Gamification")

## Step 2: Create a Free Cluster

1. Click "Create" to build a new cluster
2. Choose **M0 Sandbox** (Free tier)
3. Select a cloud provider and region close to your users
4. Name your cluster (e.g., "household-cluster")
5. Click "Create Cluster"

## Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `household-user`
5. Password: Generate a secure password (save this!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy the connection string - it will look like:
   ```
   mongodb+srv://household-user:<password>@household-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add the database name at the end: `/household-gamification`

Final connection string example:
```
mongodb+srv://household-user:yourpassword@household-cluster.xxxxx.mongodb.net/household-gamification?retryWrites=true&w=majority
```

## Step 6: Add to Render

1. Go to your Render dashboard
2. Find your backend service
3. Go to "Environment"
4. Find `MONGODB_URI` and set its value to your connection string
5. Save and redeploy

Your backend should now connect successfully to MongoDB Atlas!