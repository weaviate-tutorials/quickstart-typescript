# Weaviate Quickstart code - TypeScript

This repo contains TypeScript code to follow along with the Weaviate
[Quickstart](https://weaviate.io/developers/weaviate/quickstart). The code
corresponds to the Quickstart as of 2024-07-31.

## Run the project

There are two code files. Both files use the [TypeScript v3 client](https://weaviate.io/developers/weaviate/client-libraries/typescript/typescript-v3).

- `quickstart-setup.ts` This code creates a collection.
- `quickstart-query.ts` This code queries the collection.

To run the project, follow these steps:

1. Clone the repository.
1. Install all relevant dependencies with `npm run install`. 
1. Configure [environment variables](#configure-environment-variables) to connect to a Weaviate instance.
1. Use `quickstart-setup.ts` to create the example collection by running `npm run setup` in your terminal
1. To make a query, edit `quickstart-query.ts` and uncomment the line that calls the
query then run `npm run query` in your terminal.

## Configure environment variables

The client connection uses these environment variables:

| Variable | Meaning |
| :- | :- |
| WCD_URL | The URL for your Weaviate instance |
| WCD_API_KEY | The authentication API key for your Weaviate instance |
| OPENAI_API_KEY | The authentication API key for your OpenAI account |

If you are using a Weaviate Cloud instance to run the Quickstart, the instance
URL and API key are listed in the cluster details
[panel](https://weaviate.io/developers/wcs/connect#retrieve-your-api-keys).

If you don't have an OpenAI key, [register at OpenAI](https://platform.openai.com/signup)
to get one.

For more information, see [Environment variables](https://weaviate.io/developers/weaviate/connections/connect-cloud#environment-variables)