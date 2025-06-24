import { Client, isFullPage } from "@notionhq/client";
import { NOTION_INTEGRATION_SECRET } from "@/data/consts";
import { TSG_DATABASE_PAGE_ID } from "@/data/consts";
import type {
    PageObjectResponse,
    QueryDatabaseParameters,
    RichTextItemResponse,
    TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { ArticleProperties } from "@/types";
import { NavigationItems } from "@/db/schema/navItems";

export const notionClient = new Client({
    auth: NOTION_INTEGRATION_SECRET,
});

export const getNavigationItems = async () => {
    const { results } = await notionClient.databases.query({
        database_id: TSG_DATABASE_PAGE_ID,
    });

    return results.map((article): NavigationItems => {
        if (!isFullPage(article)) {
            throw new Error(
                "When getting nav items, Notion returned a partial response. Please try again later.",
            );
        }

        const {
            name: label,
            slug,
            group,
            subgroup,
            order,
        } = extractArticleProps(article);

        const now = new Date();

        return {
            label,
            slug,
            group,
            subgroup: subgroup ?? null,
            order: order ?? null,
            createdAt: now,
            updatedAt: now,
        };
    });
};

export function getRichTextContent(
    property: TextRichTextItemResponse[],
): string {
    return Array.isArray(property)
        ? property.map((item: RichTextItemResponse) => item.plain_text).join("")
        : property;
}

export const extractArticleProps = (
    notionObj: PageObjectResponse,
): ArticleProperties => {
    const { properties } = notionObj;

    const coverImageUrl =
        notionObj.cover?.type === "external"
            ? notionObj.cover.external.url
            : notionObj.cover?.type === "file"
              ? notionObj.cover.file.url
              : "/images/general/content-default.png";

    return {
        id: notionObj.id,
        order:
            notionObj.properties.order.type === "number"
                ? notionObj.properties.order.number || 0
                : 0,
        coverImgIsVideo:
            properties["cover image webm"].type === "checkbox" &&
            properties["cover image webm"].checkbox,
        name:
            properties.name?.type === "title"
                ? //@ts-expect-error Not sure why the notion API returns the title property as EmptyObject.
                  getRichTextContent(properties.name.title)
                : "Article Title",
        description:
            properties.description?.type == "rich_text"
                ? //@ts-expect-error Not sure why the notion API returns the rich_text property as EmptyObject.
                  getRichTextContent(properties.description.rich_text)
                : "Article Description",
        slug:
            properties.slug?.type == "rich_text"
                ? //@ts-expect-error Not sure why the notion API returns the rich_text property as EmptyObject.
                  getRichTextContent(properties.slug.rich_text)
                : "article-slug",
        //@ts-expect-error Funky enum stuff.
        status:
            properties.status?.type == "status"
                ? //@ts-expect-error Not sure why the notion API returns the status property weirdly. It should have status.name, not the array stuff.
                  getRichTextContent(properties.status.status.name)
                : "",
        group:
            properties.group?.type == "select"
                ? //@ts-expect-error Not sure why the notion API returns the select property as an Array.
                  getRichTextContent(properties.group.select.name)
                : "Group",
        subgroup:
            properties.subgroup?.type == "select" && properties.subgroup?.select
                ? //@ts-expect-error Not sure why the notion API returns the select property as an Array.
                  getRichTextContent(properties.subgroup.select.name)
                : undefined,
        ogDescription:
            properties["og description"]?.type == "rich_text"
                ? //@ts-expect-error Not sure why the notion API returns the rich_text property as EmptyObject.
                  getRichTextContent(properties["og description"].rich_text)
                : properties.description?.type == "rich_text"
                  ? //@ts-expect-error Not sure why the notion API returns the rich_text property as EmptyObject.
                    getRichTextContent(properties.description.rich_text)
                  : "Article Description",
        ogImage:
            properties["og image"].type == "files" &&
            properties["og image"].files.length > 0
                ? properties["og image"].files[0].type === "file"
                    ? properties["og image"].files[0].file.url
                    : properties["og image"].files[0].type === "external"
                      ? properties["og image"].files[0].external.url
                      : coverImageUrl
                : coverImageUrl,
        coverImage: {
            url: coverImageUrl,
            alt:
                properties["cover image alt"]?.type === "rich_text"
                    ? getRichTextContent(
                          //@ts-expect-error Not sure why the notion API returns the rich_text property as EmptyObject.
                          properties["cover image alt"].rich_text,
                      )
                    : "An illustration of a person reading a book between bookshelves in the library",
        },
        coverImageFocus:
            properties["cover image focus position"]?.type === "select" &&
            properties["cover image focus position"].select?.name
                ? getRichTextContent(
                      //@ts-expect-error Not sure why the notion API returns the select property as an Array.
                      properties["cover image focus position"].select?.name,
                  )
                : "center",
    };
};
