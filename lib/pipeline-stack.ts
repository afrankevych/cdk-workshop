import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "aws-cdk-lib/pipelines";
import {PipelineStage} from "./pipeline-stage";

export class WorkshopPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const repo = new codecommit.Repository(this, 'WorkshopRepo', {
            repositoryName: "WorkshopRepo"
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            synth: new CodeBuildStep('Synth', {
                input: CodePipelineSource.codeCommit(repo, 'main'),
                installCommands: [
                  'npm i -g npm@latest',
                  'npm install -g aws-cdk'
                ],
                commands:[
                  'npm ci',
                  'npm run build',
                  'npx cdk synth'
                ]
            })
        });

      const deploy = new PipelineStage(this, 'Deploy');
      const deployStage = pipeline.addStage(deploy);

        deployStage.addPost(
          new CodeBuildStep('TestTableViewerEndpoint', {
            projectName: 'TestTableViewerEndpoit',
            envFromCfnOutputs: {
              ENDPOINT_URL: deploy.hcViewerUrl
            },
            commands: [
              'curl -Ssf $ENDPOINT_URL'
            ]
          })
        );
      deployStage.addPost(
        new CodeBuildStep('TestAPIGatewayEndpoint', {
          projectName: 'TestAPIGatewayEndpoit',
          envFromCfnOutputs: {
            ENDPOINT_URL: deploy.hcEndpoint
          },
          commands: [
            'curl -Ssf $ENDPOINT_URL',
            'curl -Ssf $ENDPOINT_URL/hello',
            'curl -Ssf $ENDPOINT_URL/world'
          ]
        })
      );
    }
}
