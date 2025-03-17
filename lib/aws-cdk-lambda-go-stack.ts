import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import {CfnOutput} from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkLambdaGoStack extends cdk.Stack {
  // Property to store the stage
  private readonly stage: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Determine the stage from the stack ID or tags
    if (id.toLowerCase().includes('dev')) {
      this.stage = 'development';
    } else if (id.toLowerCase().includes('prod')) {
      this.stage = 'production';
    } else if (props?.tags && 'Environment' in props.tags) {
      // If stage not in ID, try to get it from tags
      this.stage = props.tags['Environment'] as string;
    } else {
      this.stage = 'unknown';
    }

    console.log(`Deploying stack in ${this.stage} stage`);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCdkLambdaGoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const lambda1 = new lambda.Function(this, 'GoFunction1', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      functionName: 'gofunction1',

      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/function1'), {
        bundling: {
          image: cdk.DockerImage.fromRegistry("golang:1.22"),
          command: [
            'bash', '-c', [
              'GOCACHE=/tmp go mod tidy',
               'GOCACHE=/tmp GOARCH=arm64 GOOS=linux go build -tags lambda.norpc -o /asset-output/bootstrap'
            ].join(' && ')
          ],

        },
      }),
    });

    new CfnOutput(this, 'GoFunction1Arn', {
        value: lambda1.functionArn,
        });

  }

  // Method to get the current stage
  public getStage(): string {
    return this.stage;
  }
}
