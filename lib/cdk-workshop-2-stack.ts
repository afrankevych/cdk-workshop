import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshop2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

      const helloHandler = new lambda.Function(this, 'CDKWorkshopHelloHandler', {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('dist/lambda'),
        handler: 'hello.handler',
      });

      const helloHandlerWithCounter = new HitCounter(this, 'HelloHitCounter', {
        downstream: helloHandler
      })

      new apigw.LambdaRestApi(this, 'Endpoit', {
        handler: helloHandlerWithCounter.handler
      });

      new TableViewer(this, 'ViewHitCounter', {
        title: 'Hello Hots',
        table: helloHandlerWithCounter.table,
        sortBy: '-hits'
      });
  }
}
