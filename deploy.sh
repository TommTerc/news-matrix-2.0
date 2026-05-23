#!/bin/bash

# Load environment variables
set -a
[ -f .env ] && . .env
set +a

# Check credentials
if [ -z "$CPANEL_USER" ] || [ -z "$CPANEL_HOST" ] || [ -z "$CPANEL_TOKEN" ]; then
  echo "❌ Missing cPanel credentials in .env file"
  exit 1
fi

echo "🚀 Starting deployment to cPanel..."
echo "📦 Uploading files to: $CPANEL_USER @ $CPANEL_HOST"

# Define local and remote directories
LOCAL_DIR="./dist"
REMOTE_DIR="/home/$CPANEL_USER/public_html"
SSH_HOST="$CPANEL_USER@$CPANEL_HOST"

# Check if dist folder exists
if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ dist/ folder not found. Run 'npm run build' first"
  exit 1
fi

# Deploy using rsync over SSH
echo "📤 Uploading files..."
rsync -avz --delete \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$LOCAL_DIR/" \
  "$SSH_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
  echo "✨ Deployment complete!"
  echo "🌐 Your site should update at: https://newsmatrix.org"
else
  echo "❌ Deployment failed"
  exit 1
fi
