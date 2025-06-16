import type {
    PageObjectResponse,
    RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import z from "zod/v4";

export interface TsgBlockMetadata {
    blockId: string;
    type: BlockType;
    children?: TsgBlockMetadata[];
    //Because the other properties can be used to impurely determine a bunch of other side effects.
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    otherProperties?: any;
    toc?: TableOfContent[];
    setToc?: (toc: TableOfContent[]) => void;
}

export interface TableOfContent {
    level: number;
    text: string;
    id: string;
}

export enum ArticleStatus {
    DRAFT = "Draft",
    PUBLISHED = "Published",
}

export interface ImageAttributes {
    url: string;
    alt?: string;
}

export interface ArticleProperties {
    id: string;
    name: string;
    description: string;
    slug: string;
    status: ArticleStatus;
    group: string;
    subgroup?: string;
    coverImageFocus: string;
    coverImage?: ImageAttributes;
    coverImgIsVideo?: boolean;
    ogImage?: string;
    ogDescription?: string;
    order?: number;
}

export enum BlockType {
    LB_1 = "lb1",
    LB_2 = "lb2",
    TB_BL = "tbbl",
    TB_NL = "tbnl",
    CB_1 = "cb1",
    CB_2 = "cb2",
    CB_3 = "cb3",
    CB_4 = "cb4",
    CB_5 = "cb5",
    CB_6 = "cb6",
    CB_7 = "cb7",
    DB = "db",
    UNKNOWN = "???",
    COLUMN = "col",
    PARAGRAPH = "para",
    IMAGE = "img",
    H3 = "h3",
    H2 = "h2",
    VIDEO = "vid",
    OL = "ol",
    UL = "ul",
    LI = "li",
    BUTTON = "btn",
    HR = "hr",
    QUOTE = "quote",
    TABLE = "table",
    TABLE_ROW = "table_row",
    LINK_PREVIEW = "link_preview",
    LINK_TO_PAGE = "link_to_page",
    DB_1 = "db1",
    DB_2 = "db2",
    DB_3 = "db3",
    DB_4 = "db4",
    DB_5 = "db5",
    DB_6 = "db6",
}

export type DB1Type = PageObjectResponse & {
    properties: {
        date: {
            id: string;
            type: "date";
            date: {
                start: Date;
                end: Date | null;
            };
        };
        time: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        slug: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        description: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        "cover image alt": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        "cta text": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        "call to action": {
            id: string;
            type: "url";
            url: string;
        };
        tags: {
            id: string;
            type: "multi_select";
            multi_select: { id: string; name: string }[];
        };
        name: { title: RichTextItemResponse[] };
    };
};

export type DB2Type = PageObjectResponse & {
    properties: {
        "date published": {
            id: string;
            type: "date";
            date: {
                start: Date;
                end: Date | null;
            };
        };

        "cover image alt": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        description: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        slug: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        status: {
            id: string;
            type: "status";
            status: {
                id: string;
                name: "Draft" | "Published" | "Review";
            };
        };
        tags: {
            id: string;
            type: "multi_select";
            multi_select: { id: string; name: string }[];
        };
        name: { title: RichTextItemResponse[] };
    };
};
export type DB3Type = PageObjectResponse & {
    properties: {
        name: { title: RichTextItemResponse[] };
        category: {
            id: string;
            type: "select";
            select: { id: string; name: string };
        };

        excerpt: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse;
        };
        address: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse;
        };
        "diversity statement": {
            id: string;
            type: "url";
            url: string;
        };
        phone: {
            id: string;
            type: "phone_number";
            phone_number: string;
        };
        email: {
            id: string;
            type: "email";
            email: string;
        };
        facebook: {
            id: string;
            type: "url";
            url: string;
        };
        instagram: {
            id: string;
            type: "url";
            url: string;
        };
        linkedin: {
            id: string;
            type: "url";
            url: string;
        };
        website: {
            id: string;
            type: "url";
            url: string;
        };
        careers: {
            id: string;
            type: "url";
            url: string;
        };
        youtube: {
            id: string;
            type: "url";
            url: string;
        };
        "cover image alt": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse;
        };
        slug: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse;
        };
        id: {
            id: string;
            type: "unique_id";
            unique_id: { prefix: "TFE"; number: number };
        };
    };
};

export type DB4Type = PageObjectResponse & {
    properties: {
        type: {
            id: string;
            type: "select";
            select: { id: string; name: string };
        };
        name: { title: RichTextItemResponse[] };
    };
};

export type DB5Type = PageObjectResponse & {
    properties: {
        description: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        email: {
            id: string;
            type: "email";
            email: {
                email: string | null;
            };
        };
        category: {
            id: string;
            type: "select";
            select: { id: string; name: string };
        };
        name: { title: RichTextItemResponse[] };
    };
};

export type DB6Type = PageObjectResponse & {
    properties: {
        expiry: {
            id: string;
            type: "date";
            date: {
                start: Date;
                end: Date | null;
            };
        };
        description: {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
        "cover image alt": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };

        url: {
            id: string;
            type: "url";
            url: string;
        };
        order: {
            id: string;
            type: "number";
            number: number;
        };

        name: { title: RichTextItemResponse[] };
        "url text": {
            id: string;
            type: "rich_text";
            rich_text: RichTextItemResponse[];
        };
    };
};
