resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier           = "${var.environment}-db"
  engine              = "postgres"
  engine_version      = "14.7"
  instance_class      = var.instance_class
  allocated_storage   = 20
  storage_type        = "gp2"
  db_name             = "${replace(var.environment, "-", "_")}_db"
  username            = "pheme_admin"
  password            = random_password.db_password.result
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  tags = {
    Name        = "${var.environment}-db"
    Environment = var.environment
  }
}

resource "random_password" "db_password" {
  length  = 16
  special = false
}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "eks_security_group_id" {
  description = "Security group ID of the EKS cluster"
  type        = string
}

# Outputs
output "db_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
}

output "db_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "db_username" {
  description = "RDS database username"
  value       = aws_db_instance.main.username
}

output "db_password" {
  description = "RDS database password"
  value       = random_password.db_password.result
  sensitive   = true
} 