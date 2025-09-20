#!/bin/bash

# GitHub Repository Setup Script
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME REPO_NAME

set -e

GITHUB_USERNAME=${1:-"your-username"}
REPO_NAME=${2:-"height-wealth-analyzer"}

echo "🚀 Setting up GitHub repository for Height Wealth Analyzer..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI not found. Installing..."
    
    # Check if brew is available
    if command -v brew &> /dev/null; then
        brew install gh
    else
        print_warning "Please install GitHub CLI manually: https://cli.github.com/"
        print_step "Alternative: Create repository manually at https://github.com/new"
        exit 1
    fi
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
    print_warning "Not logged in to GitHub. Please login:"
    gh auth login
fi

print_step "Creating GitHub repository..."

# Create repository
gh repo create $REPO_NAME \
    --public \
    --description "Interactive Height vs Wealth Analysis Tool - Production ready with real billionaire data and success calculator" \
    --add-readme=false

print_status "Repository created: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

print_step "Adding remote origin..."

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

print_step "Pushing code to GitHub..."

# Push to GitHub
git push -u origin main

print_status "✅ Code pushed to GitHub successfully!"

echo ""
echo "🎉 Repository is now live at:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📋 Next steps:"
echo "   1. Get a VPS server (DigitalOcean $5/month recommended)"
echo "   2. Buy a domain name (~$10/year)"
echo "   3. Deploy with: ./deploy.sh production yourdomain.com"
echo ""
echo "🚀 Your app is ready for production deployment!"

# Show current status
print_step "Current Git status:"
git status --short

print_step "Repository information:"
echo "   Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   Clone URL: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "   Raw files: https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/"

echo ""
print_status "🎯 Ready for deployment! Check GITHUB_SETUP.md for next steps."
