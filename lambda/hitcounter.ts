import { DynamoDB, Lambda } from 'aws-sdk';

export const handler = async (event: any) => {
    console.log('request: ', JSON.stringify(event, undefined, 2))

    const dynamoDb = new DynamoDB();
    const lambda = new Lambda();

    const tableName = process.env.HITS_TABLE_NAME;
    if (!tableName) {
        throw new Error('HITS_TABLE_NAME env not defined');
    }

    const downstreamFunctionName = process.env.DOWNSTREAM_FUNCTION_NAME;
    if (!downstreamFunctionName) {
        throw new Error('DOWNSTREAM_FUNCTION_NAME env not defined');
    }

    // update dynamo entry for "path" with hits++
    await dynamoDb.updateItem({
        TableName: tableName,
        Key: { path: { S: event.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: {':incr': { N: '1'}}
    }).promise();

    // call downstream function and capture response
    const resp = await lambda.invoke({
        FunctionName: downstreamFunctionName,
        Payload: JSON.stringify(event),
    }).promise();
    console.log('downstream response: ', JSON.stringify(resp, undefined, 2));

    const downstreamPayload = resp.Payload;
    if (!downstreamPayload) {
        throw new Error('Something went wrong on downstream call')
    }

    // return response back to upstream caller
    return JSON.parse(downstreamPayload.toString());
}