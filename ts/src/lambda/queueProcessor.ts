import { SQSHandler, SQSBatchResponse, SQSBatchItemFailure } from "aws-lambda";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { BatchJob } from "@/types/lambda";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
    const batchItemFailures: SQSBatchItemFailure[] = [];

    for (const record of event.Records) {
        try {
            const job: BatchJob = JSON.parse(record.body);

            console.log(`Processing job: ${job.type} for article ${job.id}`);

            if (job.type !== "updateArticlesInCache") {
                console.warn(`Unknown job type: ${job.type}, skipping`);
                continue;
            }

            const invokeCommand = new InvokeCommand({
                FunctionName: process.env.UPDATE_ARTICLES_FUNCTION_NAME,
                InvocationType: "RequestResponse",
                Payload: JSON.stringify({
                    queryStringParameters: {
                        articleId: job.id,
                    },
                }),
            });

            const response = await lambdaClient.send(invokeCommand);
            const responsePayload = JSON.parse(
                new TextDecoder().decode(response.Payload),
            );

            if (
                response.StatusCode !== 200 ||
                responsePayload.statusCode !== 200
            ) {
                throw new Error(
                    `Update function returned error: ${JSON.stringify(responsePayload)}`,
                );
            }

            console.log(
                `Successfully updated article ${job.id}${job.metadata?.label ? ` (${job.metadata.label})` : ""}`,
            );
        } catch (error) {
            console.error(
                `Failed to process record ${record.messageId}:`,
                error,
            );

            batchItemFailures.push({
                itemIdentifier: record.messageId,
            });
        }
    }

    return {
        batchItemFailures,
    };
};
