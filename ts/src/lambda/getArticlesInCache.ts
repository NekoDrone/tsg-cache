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

    const articleBlocks = JSON.parse(dbResults[0].articleMetadata);

    const responseBody = {
        articleBlocks,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};
