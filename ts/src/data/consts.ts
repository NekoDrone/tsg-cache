const notionSecret = process.env.NOTION_INTEGRATION_SECRET ?? "";

if (notionSecret == "")
    throw new Error(
        "Did not set NOTION_INTEGRATION_SECRET in .env file. Please try again.",
    );

export const NOTION_INTEGRATION_SECRET = notionSecret;

const dbUrl = process.env.TURSO_DATABASE_URL ?? "";

if (dbUrl == "")
    throw new Error(
        "Did not set TURSO_DATABASE_URL in .env file. Please try again.",
    );

export const TURSO_DATABASE_URL = dbUrl;

const dbAuthToken = process.env.TURSO_AUTH_TOKEN ?? "";

if (dbUrl == "")
    throw new Error(
        "Did not set TURSO_AUTH_TOKEN in .env file. Please try again.",
    );

export const TURSO_AUTH_TOKEN = dbAuthToken;

const syncTriggerAuthToken = process.env.SYNC_TRIGGER_AUTH_TOKEN ?? "";

if (dbUrl == "")
    throw new Error(
        "Did not set SYNC_TRIGGER_AUTH_TOKEN in .env file. Please try again.",
    );

export const SYNC_TRIGGER_AUTH_TOKEN = syncTriggerAuthToken;

const notionDbUrl = process.env.TSG_DATABASE_PAGE_ID ?? "";

if (dbUrl == "")
    throw new Error(
        "Did not set TSG_DATABASE_PAGE_ID in .env file. Please try again.",
    );

export const TSG_DATABASE_PAGE_ID = notionDbUrl;
