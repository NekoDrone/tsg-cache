import db from "@/db";
import { articlesTable } from "@/db/schema";
import { TsgBlockMetadata } from "@/types";
import { createBlockMetadata } from "@/utils/createBlockMetadata";
import { getBlockChildren } from "@/utils/notion";
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
    Context,
} from "aws-lambda";
import { differenceInDays } from "date-fns";
import { eq } from "drizzle-orm";

export const handler = async (
    event: APIGatewayProxyEventV2,
    context: Context,
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

    if (differenceInDays(now, dbResults[0].createdAt) >= 1) {
        // TODO: fire off updateArticlesInCache call.
    }

    const articleBlocks = JSON.parse(dbResults[0].articleMetadata);

    const responseBody = {
        articles: articleBlocks,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};
