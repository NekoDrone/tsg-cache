# TSG Cache - TypeScript

This repository contains code written for TSG for the caching layer on the main site.

This is the original TypeScript function definition.

## Installation

To get started with development, see here.

### Requirements

- Node
- Git
- AWS CLI
- AWS SAM CLI
- Infinite patience

### Steps

1. Clone this repository. `git clone https://github.com/NekoDrone/tsg-cache.git`
2. Enter the folder. `cd tsg-cache`
3. Copy the provided environment example file to your own file and fill the variables appropriately. `cp .env.example .env && nvim .env`
4. Run the script to generate env variables for the SAM Lambda environment `pnpm env:generate`
5. Install dependencies. `pnpm install`
6. Run the service. `pnpm dev:<function-name>`

The project is built as a single function run in AWS Lambda. This will incur significant execution time on Lambda (about 15 minutes per run?) so be prepared whenever you call the endpoint.

Additionally, if calling from local, the function performs recursive n+1 async calls to Notion's API to load articles. This will likely rate-limit you on Notion's side. It is recommended you call this on SQS too.

## Deployment

There should be a runner provided for GitHub Actions, but if that fails you will need to perform the following to manually build, upload, and deploy to Lambda.

1. Build the project in a container using the AWS SAM CLI. `pnpm build:sam:container`
2. Run the initial SAM deployment config and provide the variables in the guided deployment. `pnpm deploy:initial`
3. Save the file as `samconfig-prod.toml` at the project root.

For subsequent deployments, if everything went fine, you should simply be able to run `pnpm deploy:prod` which automatically references the created `samconfig-prod.toml`. Note that this file is in the ignore and should not be uploaded as it contains auth tokens and other deployment secrets.
