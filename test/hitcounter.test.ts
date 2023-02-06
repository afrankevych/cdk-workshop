import * as cdk from 'aws-cdk-lib';
import { HitCounter } from '../lib/hitcounter';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';

describe('HitCounter Construct Tests', () => {
    test('DynamoDB Table Created With Encryption', () => {
        const stack = new cdk.Stack();

        new HitCounter(stack, 'MyTestConstruct', {
            downstream: new lambda.Function(stack, 'TestFunction', {
                runtime: lambda.Runtime.NODEJS_16_X,
                handler: 'hello.handler',
                code: lambda.Code.fromAsset('dist/lambda'),
            })
        });

        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::DynamoDB::Table', {
            SSESpecification: {
                SSEEnabled: true,
            },
        });
    });

    test('Lambda Has Environment Variables', () => {
        const stack = new cdk.Stack();

        new HitCounter(stack, 'MyTestConstruct', {
            downstream: new lambda.Function(stack, 'TestFunction', {
                runtime: lambda.Runtime.NODEJS_16_X,
                handler: 'hello.handler',
                code: lambda.Code.fromAsset('dist/lambda'),
            })
        });

        const template = Template.fromStack(stack);
        const envCapture = new Capture();
        template.hasResourceProperties('AWS::Lambda::Function', {
            Environment: envCapture,
        });

        expect(envCapture.asObject()).toEqual({
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {
                    Ref: 'TestFunction22AD90FC',
                },
                HITS_TABLE_NAME: {
                    Ref: 'MyTestConstructHits24A357F0',
                },
            },
        });
    });

    test('read capacity can be configured', () => {
        const stack = new Stack();

        expect(() => {
            new HitCounter(stack, 'MyTestConstruct', {
                downstream: new lambda.Function(stack, 'TestFunction', {
                    runtime: lambda.Runtime.NODEJS_16_X,
                    handler: 'hello.handler',
                    code: lambda.Code.fromAsset('dist/lambda')
                }),
                readCapacity: 3
            });
        }).toThrowError(/readCapacity must be greater than 5 and less than 20/)
    })
});
