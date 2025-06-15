# TSG Cache

This repository contains code written for TSG for the caching layer on the main site.

It is a simple [Golang](https://go.dev/) service deployed on AWS Lambda that retrieves blocks from [Notion](https://notion.so/), constructs the required consumer objects for the frontend, and inserts them into a [Turso](https://turso.tech/) database.

## Installation

To get started with development, see here.

### Requirements

- Go 1.24.4

### Steps

1. Clone this repository. `git clone https://github.com/NekoDrone/tsg-cache.git`
2. Enter the folder. `cd tsg-cache`
3. Run the service. `go run cmd/functions/main.go`

The project is built as a single function goroutines run in AWS Lambda. This will incur significant execution time on Lambda (about 15 minutes per run?) so be prepared whenever you call the endpoint.