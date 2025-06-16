package notion

import (
	"encoding/json"
	"time"
)

type NotionUser struct {
	Object string `json:"object"`
	ID     string `json:"id"`
}

type NotionParent struct {
	Type       string `json:"type"`
	DatabaseID string `json:"database_id"`
}

type NotionFile struct {
	URL        string    `json:"url"`
	ExpiryTime time.Time `json:"expiry_time"`
}

type NotionImage struct {
	Type string     `json:"type"`
	File NotionFile `json:"file"`
}

type NotionPageResponse struct {
	Object         string                `json:"object"`
	Id             string                `json:"id"`
	CreatedTime    time.Time             `json:"created_time"`
	LastEditedTime time.Time             `json:"last_edited_time"`
	CreatedBy      NotionUser            `json:"created_by"`
	LastEditedBy   NotionUser            `json:"last_edited_by"`
	Cover          NotionImage           `json:"cover"`
	Icon           NotionImage           `json:"icon"`
	Parent         NotionParent          `json:"parent"`
	Archived       bool                  `json:"archived"`
	InTrash        bool                  `json:"in_trash"`
	Properties     TsgDatabaseProperties `json:"properties"`
	URL            string                `json:"url"`
	PublicURL      string                `json:"public_url"`
}

type NotionRichText struct {
	Type        string            `json:"type"`
	Text        NotionText        `json:"text"`
	Annotations NotionAnnotations `json:"annotations"`
	PlainText   string            `json:"plain_text"`
	Href        string            `json:"href"`
}

type NotionText struct {
	Content string     `json:"content"`
	Link    NotionLink `json:"link"`
}

type NotionLink struct {
	Url string `json:"url"`
}

type NotionAnnotations struct {
	Bold          bool   `json:"bold"`
	Italic        bool   `json:"italic"`
	Strikethrough bool   `json:"strikethrough"`
	Underline     bool   `json:"underline"`
	Code          bool   `json:"code"`
	Color         string `json:"color"`
}

type TsgDatabaseProperties struct {
	CoverImageAlt struct {
		ID       string           `json:"id"`
		Type     string           `json:"type"`
		RichText []NotionRichText `json:"rich_text"`
	} `json:"cover image alt"`
	Live struct {
		ID      string `json:"id"`
		Type    string `json:"type"`
		Formula struct {
			Type   string `json:"type"`
			String string `json:"string"`
		} `json:"formula"`
	} `json:"live"`
	Tags struct {
		ID          string `json:"id"`
		Type        string `json:"type"`
		MultiSelect []struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"multi_select"`
	} `json:"tags"`
	CoverImageFocusPosition struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		Select struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"select"`
	} `json:"cover image focus position"`
	OgImage struct {
		ID    string `json:"id"`
		Type  string `json:"type"`
		Files []struct {
			Name string     `json:"name"`
			Type string     `json:"type"`
			File NotionFile `json:"file"`
		} `json:"files"`
	} `json:"og image"`
	Group struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		Select struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"select"`
	} `json:"group"`
	Review struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		People []any  `json:"people"`
	} `json:"Review"`
	OgDescription struct {
		ID       string           `json:"id"`
		Type     string           `json:"type"`
		RichText []NotionRichText `json:"rich_text"`
	} `json:"og description"`
	Status struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		Status struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"status"`
	} `json:"status"`
	CoverImageWebm struct {
		ID       string `json:"id"`
		Type     string `json:"type"`
		Checkbox bool   `json:"checkbox"`
	} `json:"cover image webm"`
	Staging struct {
		ID      string `json:"id"`
		Type    string `json:"type"`
		Formula struct {
			Type   string `json:"type"`
			String string `json:"string"`
		} `json:"formula"`
	} `json:"staging"`
	Description struct {
		ID       string           `json:"id"`
		Type     string           `json:"type"`
		RichText []NotionRichText `json:"rich_text"`
	} `json:"description"`
	Subgroup struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		Select struct {
			ID    string `json:"id"`
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"select"`
	} `json:"subgroup"`
	Slug struct {
		ID       string           `json:"id"`
		Type     string           `json:"type"`
		RichText []NotionRichText `json:"rich_text"`
	} `json:"slug"`
	Order struct {
		ID     string `json:"id"`
		Type   string `json:"type"`
		Number int    `json:"number"`
	} `json:"order"`
	Prod struct {
		ID      string `json:"id"`
		Type    string `json:"type"`
		Formula struct {
			Type   string `json:"type"`
			String string `json:"string"`
		} `json:"formula"`
	} `json:"prod"`
	Name struct {
		ID    string           `json:"id"`
		Type  string           `json:"type"`
		Title []NotionRichText `json:"title"`
	} `json:"name"`
}

type NotionDatabaseQueryResponse struct {
	Object    string               `json:"object"`
	HasMore   bool                 `json:"has_more"`
	Type      string               `json:"type"`
	RequestID string               `json:"request_id"`
	Results   []NotionPageResponse `json:"results"`
}

type NotionListBlockChildrenResponse struct {
	Object    string        `json:"object"`
	HasMore   bool          `json:"has_more"`
	Type      string        `json:"type"`
	RequestID string        `json:"request_id"`
	Results   []NotionBlock `json:"results"`
}

type NotionBlock struct {
	Object         string          `json:"object"`
	Id             string          `json:"id"`
	Parent         NotionParent    `json:"parent"`
	CreatedTime    time.Time       `json:"created_time"`
	LastEditedTime time.Time       `json:"last_edited_time"`
	CreatedBy      NotionUser      `json:"created_by"`
	LastEditedBy   NotionUser      `json:"last_edited_by"`
	HasChildren    bool            `json:"has_children"`
	Archived       bool            `json:"archived"`
	InTrash        bool            `json:"in_trash"`
	Type           string          `json:"type"`
	RawData        json.RawMessage `json:"-"`
}
