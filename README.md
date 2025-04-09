# AWS CDK Lambda Go

This project demonstrates how to deploy Go Lambda functions using AWS CDK (Cloud Development Kit). It creates a serverless API with AWS Lambda (using Go runtime) and API Gateway, with infrastructure defined as code using TypeScript.

## Project Overview

- **Infrastructure**: AWS CDK with TypeScript
- **Runtime**: Go on AWS Lambda (ARM64 architecture)
- **API**: AWS API Gateway REST API
- **Environments**: Supports both development and production deployments

The project includes a simple Go Lambda function that returns a JSON response when called through API Gateway.

## Prerequisites

- Node.js and npm
- Go 1.22 or later
- AWS CLI configured with appropriate credentials
- AWS CDK v2 installed (`npm install -g aws-cdk`)
- Docker (for local development and multi-architecture support)

## Setup and Deployment

### Install Dependencies

```bash
# Install CDK dependencies
npm install

# Install Go dependencies
cd lambdas/function1
go mod tidy
cd ../..
```

### Deploy to AWS

Set the required environment variables and deploy using CDK:

```bash
AWS_ACCOUNT=0000000000017 AWS_REGION=us-east-1 cdk2 deploy AwsCdkLambdaGoStackDev --profile devKiquetal
```

This command deploys the development stack to the specified AWS account and region using the provided profile.

### Run Locally

You can test the API locally using AWS SAM:

```bash
sam local start-api -t cdk.out/AwsCdkLambdaGoStackDev.template.json --profile devKiquetal
```

This starts a local API Gateway that invokes your Lambda function.

## ARM64 Architecture Support

This project uses ARM64 architecture for Lambda functions, which offers better performance and cost efficiency. To build and test ARM64 binaries on x86 machines, you need QEMU support.

### Enable ARM64 Support (One-time)

Run this command to enable ARM64 emulation:

```bash
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

### Set Up Persistent ARM64 Support

To make ARM64 support persistent across reboots, create a systemd service:

1. Create the service file:

```bash
sudo vim /etc/systemd/system/qemu-user-static-persistent.service
```

2. Add the following content:

```
[Unit]
Description=Register QEMU user-mode static binaries for cross-architecture
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=root
Privileges=yes
WorkingDirectory=/root
ExecStart=/usr/bin/docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl enable qemu-user-static-persistent.service
sudo systemctl start qemu-user-static-persistent.service
sudo systemctl status qemu-user-static-persistent.service
```

### Verify Multi-architecture Support

Check if ARM64 emulation is properly configured:

```bash
ls -l /proc/sys/fs/binfmt_misc/
cat /proc/sys/fs/binfmt_misc/qemu-aarch64
```

## Project Structure

- `bin/`: CDK app entry point
- `lib/`: CDK stack definitions
- `lambdas/`: Go Lambda function code
- `cdk.out/`: Generated CloudFormation templates
