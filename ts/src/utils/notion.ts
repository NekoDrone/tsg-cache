import { NOTION_INTEGRATION_SECRET } from "@/data/consts";
import { Client } from "@notionhq/client";

export const notionClient = new Client({
    auth: NOTION_INTEGRATION_SECRET,
});

export const getBlockChildren = async (id: string) => {
    return await notionClient.blocks.children.list({ block_id: id });
};
