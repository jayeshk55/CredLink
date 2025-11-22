#!/bin/bash

# MyKard AWS Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
APP_NAME=${APP_NAME:-mykard}
ENVIRONMENT=${ENVIRONMENT:-prod}

echo -e "${GREEN}🚀 Starting MyKard deployment to AWS...${NC}"

# Check if required tools are installed
check_requirements() {
    echo -e "${YELLOW}📋 Checking requirements...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}❌ Terraform is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements satisfied${NC}"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "${YELLOW}🏗️  Deploying infrastructure with Terraform...${NC}"
    
    cd infrastructure/terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan the deployment
    terraform plan -var="aws_region=$AWS_REGION" -var="app_name=$APP_NAME" -var="environment=$ENVIRONMENT"
    
    # Apply the changes
    terraform apply -var="aws_region=$AWS_REGION" -var="app_name=$APP_NAME" -var="environment=$ENVIRONMENT" -auto-approve
    
    # Get outputs
    ECR_REPOSITORY_URL=$(terraform output -raw ecr_repository_url)
    ALB_DNS_NAME=$(terraform output -raw alb_dns_name)
    
    cd ../..
    
    echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
    echo -e "${GREEN}📦 ECR Repository: $ECR_REPOSITORY_URL${NC}"
    echo -e "${GREEN}🌐 Application URL: http://$ALB_DNS_NAME${NC}"
}

# Build and push Docker image
build_and_push_image() {
    echo -e "${YELLOW}🐳 Building and pushing Docker image...${NC}"
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL
    
    # Build the image
    docker build -t $APP_NAME .
    
    # Tag the image
    docker tag $APP_NAME:latest $ECR_REPOSITORY_URL:latest
    docker tag $APP_NAME:latest $ECR_REPOSITORY_URL:$(git rev-parse --short HEAD)
    
    # Push the image
    docker push $ECR_REPOSITORY_URL:latest
    docker push $ECR_REPOSITORY_URL:$(git rev-parse --short HEAD)
    
    echo -e "${GREEN}✅ Docker image built and pushed successfully${NC}"
}

# Update ECS service
update_ecs_service() {
    echo -e "${YELLOW}🔄 Updating ECS service...${NC}"
    
    # Force new deployment
    aws ecs update-service \
        --cluster $APP_NAME-cluster \
        --service $APP_NAME-service \
        --force-new-deployment \
        --region $AWS_REGION
    
    # Wait for deployment to complete
    echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
    aws ecs wait services-stable \
        --cluster $APP_NAME-cluster \
        --services $APP_NAME-service \
        --region $AWS_REGION
    
    echo -e "${GREEN}✅ ECS service updated successfully${NC}"
}

# Run database migrations
run_migrations() {
    echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
    
    # This would typically be done in the ECS task or a separate migration job
    # For now, we'll skip this as it's handled in the GitHub Actions workflow
    echo -e "${GREEN}✅ Database migrations will be handled by the deployment pipeline${NC}"
}

# Main deployment function
main() {
    echo -e "${GREEN}🎯 MyKard AWS Deployment${NC}"
    echo -e "${GREEN}========================${NC}"
    
    check_requirements
    deploy_infrastructure
    build_and_push_image
    update_ecs_service
    run_migrations
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}🌐 Your application is available at: http://$ALB_DNS_NAME${NC}"
    echo -e "${YELLOW}📝 Note: It may take a few minutes for the application to be fully available.${NC}"
}

# Run the main function
main "$@"
