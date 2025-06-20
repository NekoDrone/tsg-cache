import db from "@/db";
import { articlesTable } from "@/db/schema";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { differenceInDays } from "date-fns";
import { eq } from "drizzle-orm";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

export const handler = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    const articleId = event.queryStringParameters?.articleId;
    if (!articleId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Did not set articleId in query parameters.",
            }),
        };
    }

    const now = new Date();

    const dbResults = await db
        .select()
        .from(articlesTable)
        .where(eq(articlesTable.id, articleId))
        .limit(1);

    if (differenceInDays(now, dbResults[0].updatedAt) > 1) {
        const invokeCommand = new InvokeCommand({
            FunctionName: process.env.UPDATE_ARTICLES_FUNCTION_NAME,
            InvocationType: "Event",
            Payload: JSON.stringify({
                queryStringParameters: {
                    articleId: articleId,
                },
            }),
        });

        try {
            const response = await lambdaClient.send(invokeCommand);
            const responsePayload = JSON.parse(
                new TextDecoder().decode(response.Payload),
            );

            return responsePayload;
        } catch (error) {
            console.error("Error invoking update function:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error,
                    message: "Failed to fetch article",
                }),
            };
        }
    }

    const articleBlocks = JSON.parse(dbResults[0].articleMetadata);

    const responseBody = {
        articleBlocks,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};
