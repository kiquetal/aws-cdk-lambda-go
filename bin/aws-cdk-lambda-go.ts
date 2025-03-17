#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkLambdaGoStack } from '../lib/aws-cdk-lambda-go-stack';
import {AwsCdkLambdaGoStackProd} from "../lib/aws-cdk-lambda-go-stack-prod";

const app = new cdk.App();

// Development stack
new AwsCdkLambdaGoStack(app, 'AwsCdkLambdaGoStackDev', {
  /* Development environment configuration */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* You can add development-specific properties here */
  tags: {
    Environment: 'development',
    project: 'aws-go-lambda',
  },

  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },

});


new AwsCdkLambdaGoStackProd(app, 'AwsCdkLambdaGoStackProd', {
  /* Production environment configuration */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    env: {
        account: app.node.tryGetContext('env') ? app.node.tryGetContext('env').prod.account : process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('env') ? app.node.tryGetContext('env').prod.region : process.env.CDK_DEFAULT_REGION,
    },

  /* You can add production-specific properties here */
  tags: {
    Environment: 'production',
    project: 'aws-go-lambda',
  },
});
