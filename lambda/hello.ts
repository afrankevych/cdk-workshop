import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => ({
    statusCode: 200,
    body: JSON.stringify({
        message: `Hello, World! You've hit ${event.path}`
    }),
});
