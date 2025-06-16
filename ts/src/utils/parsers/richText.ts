import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import sanitize from "sanitize-html";

export const richTextToHtml = (richText: RichTextItemResponse[]) => {
    try {
        return richText
            .map((text) => {
                let content = text.plain_text;

                if (text.annotations.bold)
                    content = sanitiseHtml(`<strong>${content}</strong>`);
                if (text.annotations.italic)
                    content = sanitiseHtml(`<em>${content}</em>`);
                if (text.annotations.strikethrough)
                    content = sanitiseHtml(`<s>${content}</s>`);
                if (text.annotations.underline)
                    content = sanitiseHtml(`<u>${content}</u>`);
                if (text.annotations.code)
                    content = sanitiseHtml(`<code>${content}</code>`);
                if (text.href)
                    content =
                        text.annotations.color &&
                        text.annotations.color !== "default" &&
                        text.annotations.color !== "default_background"
                            ? sanitiseHtml(
                                  `<div class="button-wrapper link-button"><a class="${text.annotations.color} button-basic block w-fit mr-4 last-of-type:mr-0" href="${text.href}">${content}</a></div>`,
                              )
                            : sanitiseHtml(
                                  `<a class="underline underline-offset-2" href="${text.href}">${content}</a>`,
                              );

                return content;
            })
            .join("");
    } catch (err) {
        console.log(richText, err);
    }
};

export const sanitiseHtml = (dirty: string) => {
    return sanitize(dirty, {
        allowedTags: sanitize.defaults.allowedTags.concat([
            "img",
            "em",
            "i",
            "strong",
            "p",
            "span",
            "div",
        ]),
        allowedAttributes: {
            a: ["href", "class"],
            img: [
                "src",
                "srcset",
                "alt",
                "title",
                "width",
                "height",
                "loading",
                "class",
            ],
            div: ["class"],
        },
    });
};
