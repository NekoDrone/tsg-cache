import { SYNC_TRIGGER_AUTH_TOKEN } from "@/data/consts";
import {
    BatchJob,
    SyncTriggerBody,
    SyncTriggerBodySchema,
} from "@/types/lambda";
import { getNavigationItems } from "@/utils/getNavigationItems";
import { getArticleProperties } from "@/utils/getArticleProperties";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { SQS } from "@aws-sdk/client-sqs";

const sqs = new SQS();

export const handler = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
    let eventBodyString: string | undefined;
    if (event.body) {
        if (event.isBase64Encoded) {
            eventBodyString = Buffer.from(event.body, "base64").toString(
                "utf-8",
            );
        } else {
            eventBodyString = event.body;
        }
    }

    let eventBodyParsed: SyncTriggerBody | undefined;
    try {
        eventBodyParsed = eventBodyString ? JSON.parse(eventBodyString) : {};
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid JSON in request body",
                error,
                event,
                eventBodyParsed,
                eventBodyString,
            }),
        };
    }

    const { success, error, data } =
        SyncTriggerBodySchema.safeParse(eventBodyParsed);
    if (!success) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Zod type error.",
                error,
                event,
            }),
        };
    }

    const { authToken } = data;
    if (authToken != SYNC_TRIGGER_AUTH_TOKEN) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: "Invalid auth token",
                event,
            }),
        };
    }

    const items = await getNavigationItems(true);

    const batchJobs: BatchJob[] = [];

    for (const item of items) {
        const articleProperties = await getArticleProperties(item.slug, true);

        const notionBlockId = articleProperties.id;

        batchJobs.push({
            type: "updateArticlesInCache",
            id: notionBlockId,
            metadata: {
                slug: item.slug,
                label: item.label,
                timestamp: new Date().toISOString(),
            },
        });
    }

    try {
        await sendJobsToQueue(batchJobs);
        console.log(`Successfully queued ${batchJobs.length} jobs`);
    } catch (error) {
        console.error("Error sending jobs to queue:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to queue jobs",
                error: error instanceof Error ? error.message : "Unknown error",
                event,
            }),
        };
    }

    const itemsProcessed = batchJobs.length;
    const itemsSkipped = items.length - batchJobs.length;

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Added ${itemsProcessed} articles to queue.${itemsSkipped > 0 ? ` Skipped ${itemsSkipped} items.` : ""}`,
            details: {
                totalItems: items.length,
                processed: itemsProcessed,
                skipped: itemsSkipped,
            },
        }),
    };
};

async function sendJobsToQueue(jobs: BatchJob[]): Promise<any[]> {
    const queueUrl = process.env.QUEUE_URL!;
    const results = [];

    // Send jobs in batches of 3 (Notion limit)
    for (let i = 0; i < jobs.length; i += 3) {
        const batch = jobs.slice(i, i + 3);
        const entries = batch.map((job, index) => ({
            Id: `${i + index}`,
            MessageBody: JSON.stringify(job),
            MessageAttributes: {
                JobType: {
                    DataType: "String",
                    StringValue: job.type,
                },
                JobId: {
                    DataType: "String",
                    StringValue: job.id,
                },
            },
        }));

        const result = await sqs.sendMessageBatch({
            QueueUrl: queueUrl,
            Entries: entries,
        });

        results.push(result);
        console.log(`Sent batch ${Math.floor(i / 3) + 1}`, {
            successful: result.Successful?.length || 0,
            failed: result.Failed?.length || 0,
        });
    }

    return results;
}
