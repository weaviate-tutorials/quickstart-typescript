// From: https://weaviate.io/developers/weaviate/quickstart

//============ Ignore above here
import weaviate, { WeaviateClient } from 'weaviate-client'
import { vectorizer, generative } from 'weaviate-client'

// Get environment variables
const weaviate_cloud_url = process.env.WCD_URL;
const weaviate_cloud_api_key = process.env.WCD_API_KEY;
const openai_api_key = process.env.OPENAI_API_KEY;

// Create client object
const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
  weaviate_cloud_url || 'NEEDS A CLOUD URL',
  {
    authCredentials: new weaviate.ApiKey(weaviate_cloud_api_key || 'NEEDS A CLOUD KEY',),
    headers: { 'X-OpenAI-Api-Key': openai_api_key || 'NEEDS AN OPENAI KEY', }
  }
)

// Check client status
// console.log(await client.isReady())

// Run a near text query
async function nearTextQuery() {
  const questions = client.collections.get('Question');

  const result = await questions.query.nearText('biology', {
    limit:2
  });

  for (let object of result.objects) {
    console.log(JSON.stringify(object.properties, null, 2));
  }

  return result;
}
// Uncomment to run the near text query
// await nearTextQuery();

// Add a boolean filter
async function nearTextWhereQuery() {
  const questions = client.collections.get('Question');

  const result = await questions.query.nearText('biology', {
    filters: client.collections.get('Question')
             .filter
             .byProperty('category')
             .equal('ANIMALS'),
    limit:2
  });

  for (let object of result.objects) {
    console.log(JSON.stringify(object.properties, null, 2));
  }
  return result;
}
// Uncomment to run the filter query
// await nearTextWhereQuery();

// Generative search query
async function generativeSearchQuery() {
 const questions = client.collections.get('Question');

 const result = await questions.generate.nearText('biology',
   { singlePrompt: `Explain {answer} as you might to a five-year-old.` },
   { limit: 2 }
 );

 for (let object of result.objects) {
   console.log(JSON.stringify(object.properties, null, 2));
   console.log(object.generated);
 }
 return result;
}
// Uncomment to run the generative search
// await generativeSearchQuery();

// Generative search query - grouped prompt
async function generativeSearchGroupedQuery() {
 const questions = client.collections.get('Question');

 const result = await questions.generate.nearText('biology',
   { groupedTask: `Write a tweet with emojis about these facts.` },
   { limit: 2 }
 );

 console.log(result.generated);
 return result;
}
// Uncomment to run the grouped generative search
// await generativeSearchGroupedQuery();