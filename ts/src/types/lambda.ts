import { z } from "zod/v4";

export const SyncTriggerBodySchema = z.object({
    authToken: z.string(),
});

export type SyncTriggerBody = z.infer<typeof SyncTriggerBodySchema>;

export interface BatchJob {
    type: "updateArticlesInCache" | string;
    id: string; // The Notion Block ID
    metadata?: {
        slug?: string; // Original slug for reference
        label?: string; // Human-readable label for logging
        timestamp?: string; // When the job was created
        [key: string]: any;
    };
}
