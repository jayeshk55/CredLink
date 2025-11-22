#!/bin/bash

# AWS Setup Script for MyKard Deployment
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 MyKard AWS Setup Script${NC}"
echo -e "${BLUE}===========================${NC}"

# Check if AWS CLI is configured
check_aws_config() {
    echo -e "${YELLOW}🔍 Checking AWS configuration...${NC}"
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not configured or credentials are invalid.${NC}"
        echo -e "${YELLOW}Please run 'aws configure' to set up your credentials.${NC}"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅ AWS CLI configured for account: $ACCOUNT_ID${NC}"
}

# Create GitHub Secrets
setup_github_secrets() {
    echo -e "${YELLOW}🔐 Setting up GitHub repository secrets...${NC}"
    
    echo -e "${BLUE}Please add the following secrets to your GitHub repository:${NC}"
    echo -e "${BLUE}Go to: Repository Settings > Secrets and variables > Actions${NC}"
    echo ""
    
    echo -e "${GREEN}Required GitHub Secrets:${NC}"
    echo "AWS_ACCESS_KEY_ID: [Your AWS Access Key ID]"
    echo "AWS_SECRET_ACCESS_KEY: [Your AWS Secret Access Key]"
    echo "DATABASE_URL: [Will be generated after infrastructure deployment]"
    echo ""
    
    echo -e "${YELLOW}Optional secrets (update after infrastructure deployment):${NC}"
    echo "SMTP_HOST: smtp.gmail.com"
    echo "SMTP_PORT: 587"
    echo "SMTP_USER: [Your Gmail address]"
    echo "SMTP_PASS: [Your Gmail App Password]"
    echo "SMTP_FROM: [Your Gmail address]"
}

# Update Terraform files with account ID
update_terraform_config() {
    echo -e "${YELLOW}📝 Updating Terraform configuration...${NC}"
    
    # Update task definition with account ID
    if [ -f ".aws/task-definition.json" ]; then
        sed -i.bak "s/YOUR_ACCOUNT_ID/$ACCOUNT_ID/g" .aws/task-definition.json
        echo -e "${GREEN}✅ Updated task definition with account ID: $ACCOUNT_ID${NC}"
    fi
    
    echo -e "${YELLOW}📋 Manual updates required:${NC}"
    echo "1. Update SMTP configuration in infrastructure/terraform/secrets.tf"
    echo "2. Update Cloudinary configuration if using image uploads"
    echo "3. Configure domain and SSL certificate if needed"
}

# Create IAM user for GitHub Actions (optional)
create_github_user() {
    echo -e "${YELLOW}👤 Creating IAM user for GitHub Actions...${NC}"
    
    read -p "Do you want to create a dedicated IAM user for GitHub Actions? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        USER_NAME="github-actions-mykard"
        
        # Create IAM user
        aws iam create-user --user-name $USER_NAME || echo "User might already exist"
        
        # Create access key
        CREDENTIALS=$(aws iam create-access-key --user-name $USER_NAME --output json)
        ACCESS_KEY_ID=$(echo $CREDENTIALS | jq -r '.AccessKey.AccessKeyId')
        SECRET_ACCESS_KEY=$(echo $CREDENTIALS | jq -r '.AccessKey.SecretAccessKey')
        
        # Attach policies (you might want to create a more restrictive policy)
        aws iam attach-user-policy --user-name $USER_NAME --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess
        aws iam attach-user-policy --user-name $USER_NAME --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess
        aws iam attach-user-policy --user-name $USER_NAME --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess
        aws iam attach-user-policy --user-name $USER_NAME --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
        
        echo -e "${GREEN}✅ Created IAM user: $USER_NAME${NC}"
        echo -e "${BLUE}GitHub Secrets:${NC}"
        echo "AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
        echo "AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
        echo ""
        echo -e "${RED}⚠️  Save these credentials securely! They won't be shown again.${NC}"
    fi
}

# Validate Terraform configuration
validate_terraform() {
    echo -e "${YELLOW}✅ Validating Terraform configuration...${NC}"
    
    cd infrastructure/terraform
    terraform init
    terraform validate
    cd ../..
    
    echo -e "${GREEN}✅ Terraform configuration is valid${NC}"
}

# Main setup function
main() {
    check_aws_config
    update_terraform_config
    validate_terraform
    setup_github_secrets
    create_github_user
    
    echo -e "${GREEN}🎉 AWS setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Add the GitHub secrets to your repository"
    echo "2. Update SMTP and other configurations in Terraform files"
    echo "3. Push your code to trigger the deployment pipeline"
    echo "4. Run 'chmod +x scripts/deploy.sh && ./scripts/deploy.sh' for manual deployment"
    echo ""
    echo -e "${YELLOW}📖 Check the README.md for detailed deployment instructions${NC}"
}

# Run the main function
main "$@"
