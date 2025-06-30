#!/bin/bash

# Render Deployment Setup Script
# This script helps prepare the project for Render deployment

echo "🚀 Setting up Household Gamification App for Render deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not found. Initializing git..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/frontend/build
/backend/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary files
tmp/
temp/
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to render.com and create an account"
echo "3. Deploy using Blueprint with the render.yaml file"
echo "4. Or follow the manual deployment steps in DEPLOYMENT.md"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"