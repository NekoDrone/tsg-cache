import { NOTION_INTEGRATION_SECRET, TSG_DATABASE_PAGE_ID } from "@/data/consts";
import { ArticleProperties } from "@/types";
import { Client, isFullPage } from "@notionhq/client";
import { extractArticleProps } from "./getNavigationItems";

export const notionClient = new Client({
    auth: NOTION_INTEGRATION_SECRET,
});

export const getArticleProperties = async (
    slug: string,
    isStaging: boolean,
): Promise<ArticleProperties> => {
    const filter = !isStaging
        ? {
              and: [
                  {
                      property: "slug",
                      rich_text: {
                          equals: slug,
                      },
                  },
                  {
                      property: "status",
                      status: {
                          equals: "Published",
                      },
                  },
              ],
          }
        : {
              property: "slug",
              rich_text: {
                  equals: slug,
              },
          };

    const { results } = await notionClient.databases.query({
        database_id: TSG_DATABASE_PAGE_ID,
        filter,
        sorts: [
            {
                property: "order",
                direction: "ascending",
            },
        ],
    });

    const result = results[0];

    if (result) {
        if (!isFullPage(result)) {
            throw new Error(
                "Something went wrong. Either the article doesn't exist, or was set wrongly.",
            );
        }

        return extractArticleProps(result);
    } else {
        throw new Error(
            "Something went wrong. Either the article doesn't exist, or was set wrongly.",
        );
    }
};
