terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
}

// Calculator Host
provider "aws" {
  region     = "eu-central-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

// Access Keys
resource "aws_key_pair" "discord_bot" {
  key_name   = "discord_bot"
  public_key = file("../disc_bot.pub")
}

// VPC Modem
resource "aws_vpc" "discord_bot_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "DiscordBotVPC"
  }
}

// Security group inbound/outbound
resource "aws_security_group" "discord_bot_sg" {
  vpc_id      = aws_vpc.discord_bot_vpc.id
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

// slice of modem
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.discord_bot_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "PublicSubnet"
  }
}

// internet access for modem
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.discord_bot_vpc.id

  tags = {
    Name = "DiscordBotIGW"
  }
}

// modem configuration for routes
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.discord_bot_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "PublicRouteTable"
  }
}

// modem configuration connection to modem slice(subnet)
resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

variable "iam_role_name" {
  description = "EC2 Access to S3 bucket"
  type        = string
  default     = "EC2toS3Access"
}

data "aws_iam_role" "existing_role" {
  name = var.iam_role_name
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "${data.aws_iam_role.existing_role.name}_instance_profile"
  role = data.aws_iam_role.existing_role.name
}

// Calculator PC
resource "aws_instance" "discord_bot" {
  ami                    = "ami-04dfd853d88e818e8"
  instance_type          = "t3.nano"
  subnet_id              = aws_subnet.public_subnet.id
  key_name               = aws_key_pair.discord_bot.key_name
  vpc_security_group_ids = [aws_security_group.discord_bot_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name
  user_data              = <<-EOF
    #!/bin/bash
    sudo apt update -y
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo apt install -y git

    sudo git clone https://github.com/The-Estonian/SchoolBot.git /home/ubuntu/SchoolBot
    cd /home/ubuntu/SchoolBot
    sudo docker build -t estonian/discord-bot:latest .
    sudo docker run -e DISCORD_TOKEN=${var.DISCORD_TOKEN} -e LOGIN=${var.LOGIN} -e PASSWORD=${var.PASSWORD} -d --name bot estonian/discord-bot:latest
    git config --global --add safe.directory /home/ubuntu/SchoolBot
  EOF

  tags = {
    Name = "Discord Bot"
  }
  associate_public_ip_address = true
}
