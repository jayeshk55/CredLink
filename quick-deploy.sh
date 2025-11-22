#!/bin/bash

# Quick Deploy Script for MyKard
# Just run: ./quick-deploy.sh

echo "🚀 MyKard Quick Deploy"
echo "====================="

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_ACCOUNT_ID

echo "📋 Using AWS Account: $AWS_ACCOUNT_ID"

# Build and deploy
echo "🔨 Building and deploying..."
./deploy.sh

echo "🎉 Deployment complete!"
echo "🌐 Check your app at: https://mykard.in"
