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

# Firebase Configuration
resource "aws_secretsmanager_secret" "firebase_project_id" {
  name        = "${var.app_name}/firebase-project-id"
  description = "Firebase Project ID for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-project-id"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_project_id" {
  secret_id = aws_secretsmanager_secret.firebase_project_id.id
  secret_string = "credlink-01"
}

resource "aws_secretsmanager_secret" "firebase_client_email" {
  name        = "${var.app_name}/firebase-client-email"
  description = "Firebase Client Email for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-client-email"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_client_email" {
  secret_id = aws_secretsmanager_secret.firebase_client_email.id
  secret_string = "firebase-adminsdk-fbsvc@credlink-01.iam.gserviceaccount.com"
}

resource "aws_secretsmanager_secret" "firebase_private_key" {
  name        = "${var.app_name}/firebase-private-key"
  description = "Firebase Private Key for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-private-key"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_private_key" {
  secret_id = aws_secretsmanager_secret.firebase_private_key.id
  secret_string = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Z7K6Z9Q2rX8\nYwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9\nP2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8\nYwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9\nP2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8\nYwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9\nP2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8\nYwLJk9o2j4f5Q2R8m3K6L9P2Q8rX5Y9L2K6M9Q2rX8YwLJk9o2j4f5Q2R8m3K6L9\n-----END PRIVATE KEY-----\n"
}

resource "aws_secretsmanager_secret" "firebase_storage_bucket" {
  name        = "${var.app_name}/firebase-storage-bucket"
  description = "Firebase Storage Bucket for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-storage-bucket"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_storage_bucket" {
  secret_id = aws_secretsmanager_secret.firebase_storage_bucket.id
  secret_string = "credlink-01.firebasestorage.app"
}

resource "aws_secretsmanager_secret" "next_public_firebase_storage_bucket" {
  name        = "${var.app_name}/next-public-firebase-storage-bucket"
  description = "Next.js Public Firebase Storage Bucket for MyKard application"

  tags = {
    Name = "${var.app_name}-next-public-firebase-storage-bucket"
  }
}

resource "aws_secretsmanager_secret_version" "next_public_firebase_storage_bucket" {
  secret_id = aws_secretsmanager_secret.next_public_firebase_storage_bucket.id
  secret_string = "credlink-01.firebasestorage.app"
}

# Cloudinary Configuration
resource "aws_secretsmanager_secret" "cloudinary_url" {
  name        = "${var.app_name}/cloudinary-url"
  description = "Cloudinary configuration for MyKard application"

  tags = {
    Name = "${var.app_name}-cloudinary-url"
  }
}

resource "aws_secretsmanager_secret_version" "cloudinary_url" {
  secret_id = aws_secretsmanager_secret.cloudinary_url.id
  secret_string = "cloudinary://722424578963231:cBku03LYMZCDMcGTe9V8gcMmg8Q@dxmppxnst"
}

# SMTP Configuration
resource "aws_secretsmanager_secret" "smtp_host" {
  name        = "${var.app_name}/smtp-host"
  description = "SMTP Host for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-host"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_host" {
  secret_id = aws_secretsmanager_secret.smtp_host.id
  secret_string = "smtp.gmail.com"
}

resource "aws_secretsmanager_secret" "smtp_port" {
  name        = "${var.app_name}/smtp-port"
  description = "SMTP Port for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-port"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_port" {
  secret_id = aws_secretsmanager_secret.smtp_port.id
  secret_string = "587"
}

resource "aws_secretsmanager_secret" "smtp_user" {
  name        = "${var.app_name}/smtp-user"
  description = "SMTP User for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-user"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_user" {
  secret_id = aws_secretsmanager_secret.smtp_user.id
  secret_string = "dastarkhwandeveloper@gmail.com"
}

resource "aws_secretsmanager_secret" "smtp_pass" {
  name        = "${var.app_name}/smtp-pass"
  description = "SMTP Password for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-pass"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_pass" {
  secret_id = aws_secretsmanager_secret.smtp_pass.id
  secret_string = "ojlb axhr qotv hrmx"
}

resource "aws_secretsmanager_secret" "smtp_from" {
  name        = "${var.app_name}/smtp-from"
  description = "SMTP From for MyKard application"

  tags = {
    Name = "${var.app_name}-smtp-from"
  }
}

resource "aws_secretsmanager_secret_version" "smtp_from" {
  secret_id = aws_secretsmanager_secret.smtp_from.id
  secret_string = "dastarkhwandeveloper@gmail.com"
}

# JWT Secret
resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${var.app_name}/jwt-secret"
  description = "JWT Secret for MyKard application"

  tags = {
    Name = "${var.app_name}-jwt-secret"
  }
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id
  secret_string = "mykard"
}

# Firebase Public API Key
resource "aws_secretsmanager_secret" "firebase_api_key" {
  name        = "${var.app_name}/firebase-api-key"
  description = "Firebase Public API Key for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-api-key"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_api_key" {
  secret_id = aws_secretsmanager_secret.firebase_api_key.id
  secret_string = "AIzaSyBCt_QhVfDJiuG6GXbI9_lqBHa3hDsmDV4"
}

# Firebase Auth Domain
resource "aws_secretsmanager_secret" "firebase_auth_domain" {
  name        = "${var.app_name}/firebase-auth-domain"
  description = "Firebase Auth Domain for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-auth-domain"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_auth_domain" {
  secret_id = aws_secretsmanager_secret.firebase_auth_domain.id
  secret_string = "credlink-01.firebaseapp.com"
}

# Firebase Messaging Sender ID
resource "aws_secretsmanager_secret" "firebase_messaging_sender_id" {
  name        = "${var.app_name}/firebase-messaging-sender-id"
  description = "Firebase Messaging Sender ID for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-messaging-sender-id"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_messaging_sender_id" {
  secret_id = aws_secretsmanager_secret.firebase_messaging_sender_id.id
  secret_string = "226902678503"
}

# Firebase App ID
resource "aws_secretsmanager_secret" "firebase_app_id" {
  name        = "${var.app_name}/firebase-app-id"
  description = "Firebase App ID for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-app-id"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_app_id" {
  secret_id = aws_secretsmanager_secret.firebase_app_id.id
  secret_string = "1:226902678503:web:fd3d13d4482ea4cd19fb42"
}

# Firebase Measurement ID
resource "aws_secretsmanager_secret" "firebase_measurement_id" {
  name        = "${var.app_name}/firebase-measurement-id"
  description = "Firebase Measurement ID for MyKard application"

  tags = {
    Name = "${var.app_name}-firebase-measurement-id"
  }
}

resource "aws_secretsmanager_secret_version" "firebase_measurement_id" {
  secret_id = aws_secretsmanager_secret.firebase_measurement_id.id
  secret_string = "G-RV6R387M1G"
}

# App URL
resource "aws_secretsmanager_secret" "app_url" {
  name        = "${var.app_name}/app-url"
  description = "App URL for MyKard application"

  tags = {
    Name = "${var.app_name}-app-url"
  }
}

resource "aws_secretsmanager_secret_version" "app_url" {
  secret_id = aws_secretsmanager_secret.app_url.id
  secret_string = "https://mykard.in"
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
