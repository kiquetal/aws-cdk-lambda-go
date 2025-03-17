import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import {CfnOutput} from "aws-cdk-lib";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkLambdaGoStack extends cdk.Stack {
  // Property to store the stage
  private readonly stage: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Determine the stage from the stack ID or tags
    if (id.toLowerCase().includes('dev')) {
      this.stage = 'dev';
    } else if (id.toLowerCase().includes('prod')) {
      this.stage = 'prod';
    } else if (props?.tags && 'Environment' in props.tags) {
      // If stage not in ID, try to get it from tags
      this.stage = props.tags['Environment'] as string;
    } else {
      this.stage = 'unknown';
    }

    console.log("Stage: ", this.stage);

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

    // Create an API Gateway REST API
    const api = new apigateway.RestApi(this, 'GoApi', {
      restApiName: `go-api-${this.stage}`,
      description: `API Gateway for Go Lambda functions in ${this.stage} environment`,
      deploy: true,
      deployOptions: {
        stageName: this.stage,
      },
      // Enable CORS
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create the /apis resource
    const apisResource = api.root.addResource('apis');

    // Add Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(lambda1, {
      proxy: true,
    });

    // Add method to the resource
    apisResource.addMethod('GET', lambdaIntegration);

    // Output the API Gateway URL
    new CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
    });

    // Output the full API endpoint URL
    new CfnOutput(this, 'ApiEndpoint', {
      value: `${api.url}apis`,
    });
  }


}
