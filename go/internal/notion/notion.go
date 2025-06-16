package notion

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func GetDatabaseArticles() (*NotionDatabaseQueryResponse, error) {
	databaseId := os.Getenv("TSG_DATABASE_PAGE_ID")
	if databaseId == "" {
		log.Fatal("TSG_DATABASE_PAGE_ID not set. Did you configure your environment variables correctly?")
	}

	notionDatabaseUrl := fmt.Sprintf("https://api.notion.com/v1/databases/%s/query", databaseId)

	responseBody, err := requestNotion(notionDatabaseUrl, "POST", nil)
	if err != nil {
		return nil, err
	}

	var queryResponse NotionDatabaseQueryResponse
	err = json.Unmarshal(responseBody, &queryResponse)
	if err != nil {
		return nil, err
	}

	return &queryResponse, nil
}

func GetBlockChildren(blockId string) (*NotionListBlockChildrenResponse, error) {
	notionBlockUrl := fmt.Sprintf("https://api.notion.com/v1/blocks/%s/children?page_size=100", blockId)

	responseBody, err := requestNotion(notionBlockUrl, "GET", nil)
	if err != nil {
		return nil, err
	}

	var childrenResponse NotionListBlockChildrenResponse
	err = json.Unmarshal(responseBody, &childrenResponse)
	if err != nil {
		return nil, err
	}

	return &childrenResponse, nil
}

func requestNotion(url string, method string, body io.Reader) ([]byte, error) {
	authToken := os.Getenv("NOTION_INTEGRATION_SECRET")
	if authToken == "" {
		log.Fatal("NOTION_INTEGRATION_SECRET not set. Did you configure your environment variables correctly?")
	}

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", authToken))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Notion-Version", "2022-02-22")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []byte{}, nil
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return []byte{}, nil
	}

	return responseBody, nil
}
