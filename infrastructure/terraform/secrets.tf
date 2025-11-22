# NextAuth Secret
resource "aws_secretsmanager_secret" "nextauth_secret" {
  name        = "${var.app_name}/nextauth-secret"
  description = "NextAuth secret for MyKard application"

  tags = {
    Name = "${var.app_name}-nextauth-secret"
  }
}

resource "aws_secretsmanager_secret_version" "nextauth_secret" {
  secret_id     = aws_secretsmanager_secret.nextauth_secret.id
  secret_string = random_password.nextauth_secret.result
}

resource "random_password" "nextauth_secret" {
  length  = 32
  special = true
}

# NextAuth URL
resource "aws_secretsmanager_secret" "nextauth_url" {
  name        = "${var.app_name}/nextauth-url"
  description = "NextAuth URL for MyKard application"

  tags = {
    Name = "${var.app_name}-nextauth-url"
  }
}

resource "aws_secretsmanager_secret_version" "nextauth_url" {
  secret_id     = aws_secretsmanager_secret.nextauth_url.id
  secret_string = "http://${aws_lb.main.dns_name}"
}

# SMTP Configuration
resource "aws_secretsmanager_secret" "smtp_config" {
  name        = "${var.app_name}/smtp-config"
  description = "SMTP configuration for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-config"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_config" {
  secret_id = aws_secretsmanager_secret.smtp_config.id
  secret_string = jsonencode({
    host = "smtp.gmail.com"
    port = "587"
    user = "your-email@gmail.com"      # Replace with your email
    pass = "your-app-password"         # Replace with your app password
    from = "your-email@gmail.com"      # Replace with your email
  })
}

# Cloudinary Configuration (if using Cloudinary)
resource "aws_secretsmanager_secret" "cloudinary_config" {
  name        = "${var.app_name}/cloudinary-config"
  description = "Cloudinary configuration for MyKard application"

  tags = {
    Name = "${var.app_name}-cloudinary-config"
  }
}

resource "aws_secretsmanager_secret_version" "cloudinary_config" {
  secret_id = aws_secretsmanager_secret.cloudinary_config.id
  secret_string = jsonencode({
    cloud_name = "your-cloud-name"     # Replace with your Cloudinary cloud name
    api_key    = "your-api-key"        # Replace with your Cloudinary API key
    api_secret = "your-api-secret"     # Replace with your Cloudinary API secret
  })
}
