import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as CdkWorkshop2 from '../lib/cdk-workshop-2-stack';

test.skip('SQS Queue and SNS Topic Created', () => {
  // const app = new cdk.App();
  // // WHEN
  // const stack = new CdkWorkshop2.CdkWorkshop2Stack(app, 'MyTestStack');
  // // THEN

  // const template = Template.fromStack(stack);

  // template.hasResourceProperties('AWS::SQS::Queue', {
  //   VisibilityTimeout: 300
  // });
  // template.resourceCountIs('AWS::SNS::Topic', 1);
});
