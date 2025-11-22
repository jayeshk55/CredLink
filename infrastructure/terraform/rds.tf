# External MySQL Database Configuration
# Using existing Hostinger MySQL database instead of RDS

# Store database URL in Secrets Manager
resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.app_name}/database-url"
  description = "Database URL for MyKard application (External MySQL)"

  tags = {
    Name = "${var.app_name}-database-url"
  }
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = "mysql://u825197931_visitingCard:1qAPjf%26C%3E%21@srv1835.hstgr.io:3306/u825197931_visitingCard"
}
