terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
}

provider "aws" {
  region     = "eu-central-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_key_pair" "discord_bot" {
  key_name   = "discord_bot"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_instance" "discord_bot" {
  ami               = "ami-04dfd853d88e818e8"
  instance_type     = "t2.nano"
  availability_zone = "eu-central-1a"
  key_name          = aws_key_pair.discord_bot.key_name
  security_groups   = [aws_security_group.discord_bot_sg.name]

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker

    sudo docker pull your-docker-image
    sudo docker run -d your-docker-image
  EOF

  tags = {
    Name = "Discord Bot"
  }
  associate_public_ip_address = true
}

resource "aws_security_group" "discord_bot_sg" {
  name        = "discord_bot_sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "instance_ip" {
  value = aws_instance.discord_bot.public_ip
}