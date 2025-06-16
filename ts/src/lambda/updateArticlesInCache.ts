import db from "@/db";
import { articlesTable } from "@/db/schema";
import { TsgBlockMetadata } from "@/types";
import { createBlockMetadata } from "@/utils/createBlockMetadata";
import { getBlockChildren } from "@/utils/notion";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

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

    const { results } = await getBlockChildren(articleId);

    const articleBlocks: TsgBlockMetadata[] = [];

    for (const child of results) {
        articleBlocks.push(await createBlockMetadata(child));
    }

    const now = new Date();

    await db
        .insert(articlesTable)
        .values({
            id: articleId,
            articleMetadata: JSON.stringify(articleBlocks),
            createdAt: now,
            updatedAt: now,
        })
        .onConflictDoUpdate({
            target: articlesTable.id,
            set: {
                articleMetadata: JSON.stringify(articleBlocks),
                updatedAt: now,
            },
        });

    const responseBody = {
        articles: articleBlocks,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};
