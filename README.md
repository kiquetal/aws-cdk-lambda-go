## Run with environment variables

AWS_ACCOUNT=0000000000017  AWS_REGION=us-east-1   cdk2 deploy AwsCdkLambdaGoStackDev --profile devKiquetal


## To be able to use arm 

docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

## Run locally

sam local start-api -t cdk.out/AwsCdkLambdaGoStackDev.template.json --profile devKiquetal
