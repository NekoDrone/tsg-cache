import type {
	BlockObjectResponse,
	CalloutBlockObjectResponse,
	ImageBlockObjectResponse,
	PartialBlockObjectResponse,
	VideoBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import {
	BlockType,
	type DB1Type,
	type DB2Type,
	type DB3Type,
	type DB4Type,
	type DB5Type,
	type DB6Type,
	type TsgBlockMetadata
} from '@/types';
import { getBlockChildren, notionClient } from '@/utils/notion';
import { isFullBlock } from '@notionhq/client';
import { richTextToHtml } from '@/utils/parsers/richText';

export const createBlockMetadata = async (
	notionBlockObj: PartialBlockObjectResponse | BlockObjectResponse
): Promise<TsgBlockMetadata> => {
	if (!isFullBlock(notionBlockObj)) {
		throw new Error(
			`Received partial block object when trying to create block metadata. Received object was ${notionBlockObj}`
		);
	}

	if (notionBlockObj.has_children) {
		const { results } = await getBlockChildren(notionBlockObj.id);

		// cursed recursion mapping
		// probably extremely inefficient
		// allows this one function call to recursively generate child metadata as well.
		const children: TsgBlockMetadata[] = [];
		for (const child of results) {
			children.push(await createBlockMetadata(child));
		}

		const type = determineBlockType(notionBlockObj);

		const otherProperties = {
			table: type == BlockType.TABLE && notionBlockObj.type == 'table' && notionBlockObj.table,
			hr: type == BlockType.HR && notionBlockObj.type == 'divider',
			title:
				type == BlockType.LB_1 &&
				notionBlockObj.type == 'heading_1' &&
				richTextToHtml(notionBlockObj.heading_1.rich_text),
			backgroundColor:
				(type == BlockType.PARAGRAPH &&
					notionBlockObj.type == 'paragraph' &&
					notionBlockObj.paragraph.color) ||
				(type == BlockType.LB_1 &&
					notionBlockObj.type == 'heading_1' &&
					notionBlockObj.heading_1.color) ||
				(type == BlockType.CB_4 &&
					notionBlockObj.type == 'heading_3' &&
					notionBlockObj.heading_3.color),
			columnWidth: type == BlockType.COLUMN && getColumnWidth(notionBlockObj),
			calloutIcon:
				type == BlockType.CB_2 &&
				notionBlockObj.type == 'callout' &&
				getCalloutIcon(notionBlockObj),
			calloutIconType:
				type == BlockType.CB_2 &&
				notionBlockObj.type == 'callout' &&
				notionBlockObj.callout.icon &&
				notionBlockObj.callout.icon.type,
			accordionTitle:
				type == BlockType.CB_3 &&
				notionBlockObj.type == 'toggle' &&
				richTextToHtml(notionBlockObj.toggle.rich_text),
			cardTitle:
				type == BlockType.CB_4 &&
				notionBlockObj.type == 'heading_3' &&
				richTextToHtml(notionBlockObj.heading_3.rich_text),
			ul:
				type == BlockType.UL &&
				notionBlockObj.type == 'bulleted_list_item' &&
				richTextToHtml(notionBlockObj.bulleted_list_item.rich_text),
			ol:
				type == BlockType.OL &&
				notionBlockObj.type == 'numbered_list_item' &&
				richTextToHtml(notionBlockObj.numbered_list_item.rich_text),
			quote: type == BlockType.QUOTE &&
				notionBlockObj.type == 'quote' && {
					...notionBlockObj.quote,
					html: richTextToHtml(notionBlockObj.quote.rich_text)
				},
			paragraph:
				type == BlockType.PARAGRAPH &&
				notionBlockObj.type == 'paragraph' &&
				richTextToHtml(notionBlockObj.paragraph.rich_text),
			callout:
				type == BlockType.CB_2 &&
				notionBlockObj.type == 'callout' &&
				richTextToHtml(notionBlockObj.callout.rich_text)
		};

		return {
			blockId: notionBlockObj.id,
			type,
			children: children,
			otherProperties
		};
	}

	const type = determineBlockType(notionBlockObj);

	if (type == BlockType.DB_1) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id,
				filter: {
					property: 'status',
					status: { equals: 'Published' }
				}
			});

			return {
				blockId: notionBlockObj.id,
				type,
				otherProperties: {
					db1: results as DB1Type[]
				}
			};
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}
	if (type == BlockType.DB_2) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id
			});

			return {
				blockId: notionBlockObj.id,
				type,
				otherProperties: {
					db2: results as DB2Type[]
				}
			};
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}
	if (type == BlockType.DB_3) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id
			});

			return {
				blockId: notionBlockObj.id,
				type,
				otherProperties: {
					db3: results as DB3Type[]
				}
			};
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}
	if (type == BlockType.DB_4) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id
			});

			if (results) {
				return {
					blockId: notionBlockObj.id,
					type,
					otherProperties: {
						db4: results as DB4Type[]
					}
				};
			}
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}
	if (type == BlockType.DB_5) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id
			});

			return {
				blockId: notionBlockObj.id,
				type,
				otherProperties: {
					db5: results as DB5Type[]
				}
			};
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}
	if (type == BlockType.DB_6) {
		try {
			const { results } = await notionClient.databases.query({
				database_id: notionBlockObj.id
			});

			return {
				blockId: notionBlockObj.id,
				type,
				otherProperties: {
					db6: results as DB6Type[]
				}
			};
		} catch (err) {
			console.log('err', err);
			return {
				blockId: notionBlockObj.id,
				type
			};
		}
	}

	const otherProperties = {
		// db1: type == BlockType.DB_1 && (await createBlockMetadata(notionBlockObj)),
		backgroundColor:
			(type == BlockType.PARAGRAPH &&
				notionBlockObj.type == 'paragraph' &&
				notionBlockObj.paragraph.color) ||
			(type == BlockType.LB_1 &&
				notionBlockObj.type == 'heading_1' &&
				notionBlockObj.heading_1.color) ||
			(type == BlockType.CB_4 &&
				notionBlockObj.type == 'heading_3' &&
				notionBlockObj.heading_3.color),
		quote: type == BlockType.QUOTE &&
			notionBlockObj.type == 'quote' && {
				...notionBlockObj.quote,
				html: richTextToHtml(notionBlockObj.quote.rich_text)
			},
		table_row:
			type == BlockType.TABLE_ROW &&
			notionBlockObj.type == 'table_row' &&
			notionBlockObj.table_row?.cells,
		hr: type == BlockType.HR && notionBlockObj.type == 'divider',
		title:
			(type == BlockType.CB_1 &&
				notionBlockObj.type == 'heading_1' &&
				richTextToHtml(notionBlockObj.heading_1.rich_text)) ||
			(type == BlockType.LB_1 &&
				notionBlockObj.type == 'heading_1' &&
				richTextToHtml(notionBlockObj.heading_1.rich_text)),
		paragraph:
			(type == BlockType.PARAGRAPH &&
				notionBlockObj.type == 'paragraph' &&
				richTextToHtml(notionBlockObj.paragraph.rich_text)) ||
			(type == BlockType.BUTTON &&
				notionBlockObj.type == 'paragraph' &&
				richTextToHtml(notionBlockObj.paragraph.rich_text)),
		image: {
			src: type == BlockType.IMAGE && notionBlockObj.type == 'image' && getImageSrc(notionBlockObj),
			alt: 'placeholder image desc. TODO: implement alt-text handler',
			caption: richTextToHtml(
				BlockType.IMAGE && notionBlockObj.type == 'image' ? notionBlockObj.image.caption : []
			)
		},
		video: {
			src: type == BlockType.VIDEO && notionBlockObj.type == 'video' && getVideoSrc(notionBlockObj),
			alt: 'placeholder video desc. TODO: implement alt-text handler'
		},
		h3:
			type == BlockType.H3 &&
			notionBlockObj.type == 'heading_3' &&
			richTextToHtml(notionBlockObj.heading_3.rich_text),
		h2:
			type == BlockType.H2 &&
			notionBlockObj.type == 'heading_2' &&
			richTextToHtml(notionBlockObj.heading_2.rich_text),
		ul:
			type == BlockType.UL &&
			notionBlockObj.type == 'bulleted_list_item' &&
			richTextToHtml(notionBlockObj.bulleted_list_item.rich_text),
		ol:
			type == BlockType.OL &&
			notionBlockObj.type == 'numbered_list_item' &&
			richTextToHtml(notionBlockObj.numbered_list_item.rich_text),

		calloutText:
			type == BlockType.CB_2 &&
			notionBlockObj.type == 'callout' &&
			richTextToHtml(notionBlockObj.callout.rich_text),
		calloutIcon:
			type == BlockType.CB_2 && notionBlockObj.type == 'callout' && getCalloutIcon(notionBlockObj),
		calloutIconType:
			type == BlockType.CB_2 &&
			notionBlockObj.type == 'callout' &&
			notionBlockObj.callout.icon &&
			notionBlockObj.callout.icon.type
	};

	return {
		blockId: notionBlockObj.id,
		type,
		otherProperties
	};
};

const determineBlockType = (notionBlockObj: BlockObjectResponse): BlockType => {
	if (notionBlockObj.type == 'heading_1' && notionBlockObj.heading_1.is_toggleable)
		return BlockType.LB_1;
	if (notionBlockObj.type == 'column_list') return BlockType.LB_2;
	if (notionBlockObj.type == 'column') return BlockType.COLUMN;
	if (notionBlockObj.type == 'heading_1') return BlockType.CB_1;
	if (
		notionBlockObj.type == 'paragraph' &&
		notionBlockObj.paragraph.rich_text.some((rto) => {
			return (
				rto.annotations.color === 'gray' ||
				rto.annotations.color === 'blue' ||
				rto.annotations.color === 'red' ||
				rto.annotations.color === 'pink' ||
				rto.annotations.color === 'yellow'
			);
		})
	)
		return BlockType.BUTTON;

	if (notionBlockObj.type == 'paragraph') return BlockType.PARAGRAPH;
	if (notionBlockObj.type == 'callout') return BlockType.CB_2;
	if (notionBlockObj.type == 'toggle') return BlockType.CB_3;
	if (notionBlockObj.type == 'heading_3' && notionBlockObj.heading_3.is_toggleable)
		return BlockType.CB_4;
	if (notionBlockObj.type == 'image') return BlockType.IMAGE;
	if (notionBlockObj.type == 'video') return BlockType.VIDEO;
	if (notionBlockObj.type == 'heading_3') return BlockType.H3;
	if (notionBlockObj.type == 'heading_2') return BlockType.H2;
	if (notionBlockObj.type == 'numbered_list_item') return BlockType.OL;
	if (notionBlockObj.type == 'bulleted_list_item') return BlockType.UL;
	if (notionBlockObj.type == 'divider') return BlockType.HR;
	if (notionBlockObj.type == 'quote') return BlockType.QUOTE;
	if (notionBlockObj.type == 'table') return BlockType.TABLE;
	if (notionBlockObj.type == 'table_row') return BlockType.TABLE_ROW;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'Events')
		return BlockType.DB_1;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'Blog')
		return BlockType.DB_2;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'Employers')
		return BlockType.DB_3;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'FAQ')
		return BlockType.DB_4;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'Volunteer')
		return BlockType.DB_5;
	if (notionBlockObj.type == 'child_database' && notionBlockObj.child_database.title == 'Links')
		return BlockType.DB_6;

	return BlockType.UNKNOWN;
};

const getColumnWidth = (notionBlockObj: BlockObjectResponse): number => {
	if (notionBlockObj.type == 'column' && notionBlockObj.column) {
		return Math.round(notionBlockObj.column.width_ratio ?? 1);
	} else return 1;
};

const getCalloutIcon = (notionBlockObj: CalloutBlockObjectResponse) => {
	const { icon } = notionBlockObj.callout;
	if (!icon) return '';
	if (icon.type == 'emoji') return `${icon.emoji}`;
	if (icon.type == 'external') return icon.external.url;
	if (icon.type == 'file') return icon.file.url;
	if (icon.type == 'custom_emoji') return icon.custom_emoji.url;
	return '';
};

const getImageSrc = (notionBlockObj: ImageBlockObjectResponse) => {
	const { image } = notionBlockObj;

	if (image.type == 'file') return image.file.url;
	if (image.type == 'external') return image.external.url;
	return '';
};

const getVideoSrc = (notionBlockObj: VideoBlockObjectResponse) => {
	const { video } = notionBlockObj;
	if (video.type == 'file') return video.file.url;
	if (video.type == 'external') return video.external.url;
	return '';
};