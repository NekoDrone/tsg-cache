import { z } from "zod/v4";

export const SyncTriggerBodySchema = z.object({
    authToken: z.string(),
});

export type SyncTriggerBody = z.infer<typeof SyncTriggerBodySchema>;

export interface BatchJob {
    id: string;
    type: string;
    data: any;
    createdAt: string;
}
