#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkLambdaGoStack } from '../lib/aws-cdk-lambda-go-stack';
import { AwsCdkLambdaGoStackProd } from "../lib/aws-cdk-lambda-go-stack-prod";

const app = new cdk.App();

// Get the stage from context or default to 'dev'
// Usage: cdk deploy --context stage=prod
// or: cdk deploy --context stage=dev
const stage = app.node.tryGetContext('stage') || 'dev';

console.log(`Deploying for stage: ${stage}`);

if (stage.toLowerCase() === 'dev') {
    new AwsCdkLambdaGoStack(app, 'AwsCdkLambdaGoStackDev', {
        /* Development environment configuration */
        tags: {
            Environment: 'development',
            project: 'aws-go-lambda',
        },
        env: {
            account: process.env.AWS_ACCOUNT || app.node.tryGetContext('env')?.dev?.account || process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.AWS_REGION || app.node.tryGetContext('env')?.dev?.region || process.env.CDK_DEFAULT_REGION,
        },
    });
} else if (stage.toLowerCase() === 'prod') {
    new AwsCdkLambdaGoStackProd(app, 'AwsCdkLambdaGoStackProd', {
        /* Production environment configuration */
        tags: {
            Environment: 'production',
            project: 'aws-go-lambda',
        },
        env: {
            account: app.node.tryGetContext('env')?.prod?.account || process.env.CDK_DEFAULT_ACCOUNT,
            region: app.node.tryGetContext('env')?.prod?.region || process.env.CDK_DEFAULT_REGION,
        },
    });
} else {
    throw new Error(`Invalid stage: ${stage}. Must be 'dev' or 'prod'.`);
}
