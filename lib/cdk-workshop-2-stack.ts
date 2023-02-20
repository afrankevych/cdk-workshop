import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshop2Stack extends Stack {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

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

      const gateway = new apigw.LambdaRestApi(this, 'Endpoit', {
        handler: helloHandlerWithCounter.handler
      });

      const tv = new TableViewer(this, 'ViewHitCounter', {
        title: 'Hello Hots',
        table: helloHandlerWithCounter.table,
        sortBy: '-hits'
      });

    this.hcEndpoint = new CfnOutput(this, 'GatewayUrl', {
      value: gateway.url
    });

    this.hcViewerUrl = new CfnOutput(this, 'TableViewerUrl', {
      value: tv.endpoint
    });
  }
}
