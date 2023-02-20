import {CfnOutput, Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CdkWorkshop2Stack} from "./cdk-workshop-2-stack";

export class PipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CdkWorkshop2Stack(this, 'WebService');
    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}