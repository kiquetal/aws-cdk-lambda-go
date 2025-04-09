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

You can deploy to different environments (development or production) using either npm scripts or direct CDK commands:

#### Using npm Scripts (Recommended)

```bash
# Deploy to development environment
npm run deploy:dev -- --profile your-dev-profile

# Deploy to production environment
npm run deploy:prod -- --profile your-prod-profile
```

#### Using Direct CDK Commands

```bash
# Deploy to development environment
# Using environment variables for account and region
AWS_ACCOUNT=your-dev-account-id AWS_REGION=your-dev-region cdk deploy --context stage=dev --profile your-dev-profile

# Or using the context configuration from cdk.json
cdk deploy --context stage=dev --profile your-dev-profile

# Deploy to production environment
cdk deploy --context stage=prod --profile your-prod-profile
```

The deployment will create only the stack for the specified stage. The account and region information will be taken from:
1. Environment variables (if provided)
2. Context configuration in cdk.json
3. Default AWS profile configuration

### Run Locally

You can test the API locally using AWS SAM. First, synthesize the CDK stack for your desired environment:

#### Using npm Scripts (Recommended)

```bash
# Synthesize the development stack
npm run synth:dev

# Or synthesize the production stack
npm run synth:prod
```

#### Using Direct CDK Commands

```bash
# Synthesize the development stack
cdk synth --context stage=dev

# Or synthesize the production stack
cdk synth --context stage=prod
```

Then start the local API Gateway using the generated CloudFormation template:

```bash
# For development environment
sam local start-api -t cdk.out/AwsCdkLambdaGoStackDev.template.json --profile your-dev-profile

# For production environment
sam local start-api -t cdk.out/AwsCdkLambdaGoStackProd.template.json --profile your-prod-profile
```

This starts a local API Gateway that invokes your Lambda function for the specified environment.

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

## Environment Selection

This project supports multiple deployment environments (development and production) using AWS CDK's context mechanism. The environment selection works as follows:

1. The deployment stage is determined by the `stage` context parameter:
   ```bash
   cdk deploy --context stage=dev  # For development
   cdk deploy --context stage=prod  # For production
   ```

2. If no stage is specified, it defaults to `dev` (development).

3. Based on the selected stage, only one stack will be synthesized and deployed:
   - For `dev`: `AwsCdkLambdaGoStackDev`
   - For `prod`: `AwsCdkLambdaGoStackProd`

4. Each stack uses environment-specific configurations from:
   - Environment variables
   - Context values in `cdk.json`
   - Default AWS profile settings

This approach ensures that only the stack for the specified environment is processed during deployment, avoiding the issue of multiple stacks being synthesized simultaneously.

## Project Structure

- `bin/`: CDK app entry point
- `lib/`: CDK stack definitions
- `lambdas/`: Go Lambda function code
- `cdk.out/`: Generated CloudFormation templates
