package blocks

import "github.com/NekoDrone/tsg-cache/internal/notion"

func CreateBlockMetadata(notionBlockObj notion.NotionBlock) {
	if notionBlockObj.HasChildren {
		childrenBlocks, err := notion.GetBlockChildren(notionBlockObj.Id)
		if err != nil {
			panic(err)
		}

		for _, child := range childrenBlocks.Results {

		}
	}
}
