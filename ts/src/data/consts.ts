const notionSecret = process.env.NOTION_INTEGRATION_SECRET ?? ""

if(notionSecret == "") throw new Error("Did not set NOTION_INTEGRATION_SECRET in .env file. Please try again.")

export const NOTION_INTEGRATION_SECRET = notionSecret