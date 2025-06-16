# TSG Cache - TypeScript

This repository contains code written for TSG for the caching layer on the main site.

This is the original TypeScript function definition.

## Installation

To get started with development, see here.

### Requirements

- Node
- Git
- Infinite patience

### Steps

1. Clone this repository. `git clone https://github.com/NekoDrone/tsg-cache.git`
2. Enter the folder. `cd tsg-cache`
3. Copy the provided environment example file to your own file and fill the variables appropriately. `cp .env.example .env && nvim .env`
4. Install dependencies. `pnpm install`
5. Run the service. `pnpm dev`

The project is built as a single function run in AWS Lambda. This will incur significant execution time on Lambda (about 15 minutes per run?) so be prepared whenever you call the endpoint.

Additionally, if calling from local, the function performs recursive n+1 async calls to Notion's API to load articles. This will likely rate-limit you on Notion's side.

## Deployment

There should be a runner provided for GitHub Actions, but if that fails you will need to perform the following to manually build, upload, and deploy to Lambda.

1. Build the project `pnpm build`
2. Upload the project to Lambda using the AWS dashboard.
3. For the start command, use the one listed in `pnpm start` or whatever makes sense on Lambda.
