#!/bin/bash

echo "🚀 Deploying MyKard to AWS..."

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t mykard-app .
docker tag mykard-app:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mykard:latest

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Push to ECR
echo "⬆️ Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mykard:latest

# Deploy to ECS
echo "🎯 Deploying to ECS..."
aws ecs update-service --cluster mykard-cluster --service mykard-service --force-new-deployment

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://mykard.in"
