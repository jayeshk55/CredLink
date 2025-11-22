# MyKard - Simple Deployment

## 🚀 One-Command Deployment

### Option 1: Automatic (GitHub Actions)
Just push to `demo1`, `main`, or `production` branch and it deploys automatically.

### Option 2: Manual (One Command)
```bash
./quick-deploy.sh
```

That's it! 🎉

## 📋 Prerequisites
- AWS CLI configured (`aws configure`)
- Docker installed
- AWS credentials with ECR/ECS permissions

## 🔧 What it does
1. Builds Docker image
2. Pushes to ECR
3. Deploys to ECS
4. Updates your live app

## 🌐 Your App
- **Live URL**: https://mykard.in
- **Health Check**: https://mykard.in/api/health

## 🐛 Troubleshooting
If deployment fails:
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Docker
docker --version

# Re-run with debug
./quick-deploy.sh
```

## 📞 Support
Deployment is now fully automated. If you need help, check the GitHub Actions logs or run the manual deploy command.
