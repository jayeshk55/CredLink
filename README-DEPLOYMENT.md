# MyKard AWS Deployment Guide

This guide will help you deploy your MyKard application to AWS using a complete CI/CD pipeline.

## 🏗️ Architecture Overview

The deployment uses the following AWS services:
- **ECS Fargate**: Container orchestration
- **ECR**: Container registry
- **External MySQL**: Hostinger MySQL database (no RDS needed)
- **Application Load Balancer**: Load balancing and routing
- **VPC**: Network isolation
- **Secrets Manager**: Secure credential storage
- **CloudWatch**: Logging and monitoring

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** installed (v1.0+)
4. **Docker** installed
5. **GitHub repository** for your code
6. **Node.js 18+** for local development

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Make scripts executable
chmod +x scripts/setup-aws.sh scripts/deploy.sh

# Run AWS setup
./scripts/setup-aws.sh
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

**Required:**
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `DATABASE_URL`: mysql://u825197931_visitingCard:1qAPjf%26C%3E%21@srv1835.hstgr.io:3306/u825197931_visitingCard

**Optional (for email functionality):**
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_USER`: Your Gmail address
- `SMTP_PASS`: Your Gmail App Password
- `SMTP_FROM`: Your Gmail address

### 3. Update Configuration

Edit `infrastructure/terraform/secrets.tf` to update:
- SMTP configuration with your email credentials
- Cloudinary configuration (if using image uploads)

### 4. Deploy Infrastructure

```bash
# Deploy using Terraform
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

### 5. Push to GitHub

Push your code to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

## 🔧 Manual Deployment

For manual deployment without GitHub Actions:

```bash
./scripts/deploy.sh
```

## 📊 Monitoring and Logs

### CloudWatch Logs
- Log Group: `/ecs/mykard-task`
- View logs in AWS Console > CloudWatch > Log groups

### Application Health
- Health check endpoint: `http://your-alb-dns/api/health`
- ECS Service status in AWS Console > ECS > Clusters > mykard-cluster

## 🗄️ Database Management

### Migrations
Database migrations run automatically during deployment via GitHub Actions.

### Manual Migration
```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="your-database-url"

# Run migrations
npx prisma generate
npx prisma db push
```

### Database Access
```bash
# Get database URL from Secrets Manager
aws secretsmanager get-secret-value --secret-id mykard/database-url --query SecretString --output text
```

## 🔐 Security Configuration

### Environment Variables
All sensitive data is stored in AWS Secrets Manager:
- Database credentials
- NextAuth configuration
- SMTP credentials
- API keys

### Network Security
- Application runs in private subnets
- Database accessible only from application
- Load balancer in public subnets
- Security groups restrict access

## 🌐 Domain and SSL (Optional)

To use a custom domain with SSL:

1. **Register domain** or use existing one
2. **Create ACM certificate**:
   ```bash
   aws acm request-certificate --domain-name yourdomain.com --validation-method DNS
   ```
3. **Update ALB configuration** in `infrastructure/terraform/alb.tf`
4. **Create Route 53 records** pointing to ALB

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`/.github/workflows/deploy.yml`) automatically:

1. **Tests** the application
2. **Builds** Docker image
3. **Pushes** to ECR
4. **Updates** ECS service
5. **Runs** database migrations

### Pipeline Triggers
- Push to `main` or `production` branch
- Pull requests (testing only)

## 🛠️ Troubleshooting

### Common Issues

**Deployment fails:**
- Check GitHub Actions logs
- Verify AWS credentials and permissions
- Ensure all required secrets are set

**Application not accessible:**
- Check ECS service status
- Verify security group rules
- Check ALB target group health

**Database connection issues:**
- Verify DATABASE_URL in Secrets Manager
- Check RDS security group
- Ensure database is in correct subnets

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster mykard-cluster --services mykard-service

# View recent logs
aws logs tail /ecs/mykard-task --follow

# Force new deployment
aws ecs update-service --cluster mykard-cluster --service mykard-service --force-new-deployment

# Get application URL
terraform output application_url
```

## 💰 Cost Optimization

### Development Environment
- Use `db.t3.micro` for RDS (included in free tier)
- Use minimal ECS task resources (512 CPU, 1024 Memory)
- Enable ALB deletion protection = false

### Production Environment
- Scale ECS tasks based on load
- Use RDS Multi-AZ for high availability
- Enable CloudWatch detailed monitoring
- Consider Reserved Instances for predictable workloads

## 🧹 Cleanup

To destroy all AWS resources:

```bash
cd infrastructure/terraform
terraform destroy
```

**Warning:** This will permanently delete all data including the database.

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Verify all configuration files
4. Ensure all prerequisites are met

## 🔄 Updates and Maintenance

### Application Updates
- Push code to `main` branch for automatic deployment
- Monitor deployment in GitHub Actions
- Check application health after deployment

### Infrastructure Updates
- Modify Terraform files as needed
- Run `terraform plan` to preview changes
- Apply changes with `terraform apply`

### Security Updates
- Regularly update base Docker images
- Keep dependencies up to date
- Monitor AWS security advisories
- Rotate secrets periodically
