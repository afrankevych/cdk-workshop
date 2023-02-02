import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';

export class CdkWorkshop2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

      const helloHandler = new lambda.Function(this, 'CDKWorkshopHelloHandler', {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset('dist/lambda'),
        handler: 'hello.handler',
      });

      new apigw.LambdaRestApi(this, 'Endpoit', {
        handler: helloHandler
      });
  }
}
