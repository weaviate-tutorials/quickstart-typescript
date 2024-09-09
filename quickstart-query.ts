// From: https://weaviate.io/developers/weaviate/quickstart
// Use `quickstart-setup.ts` to create the example collection.
// To run a query, edit this file, to uncomment the line that calls the query.

import weaviate, { WeaviateClient } from 'weaviate-client'
import 'dotenv/config'


// Get environment variables
// Set these environment variables before you run the script. For more details,
// the README file
const weaviateCloudUrl = process.env.WCD_URL || 'NEEDS A CLOUD URL';
const weaviateCloudApiKey = process.env.WCD_API_KEY || 'NEEDS A CLOUD API KEY';
const openaiApiKey = process.env.OPENAI_API_KEY || 'NEEDS AN OPENAI API KEY';

// Create client object
const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
 weaviateCloudUrl,
 {
   authCredentials: new weaviate.ApiKey(weaviateCloudApiKey),
   headers: { 'X-OpenAI-Api-Key': openaiApiKey, }
 }
)

// Check client status
// console.log('Weaviate Ready:', await client.isReady())

async function fetchObjects() {
  const questionCollection = client.collections.get('Question')

  const response = await questionCollection.query.fetchObjects({
    limit: 5,
    returnMetadata: ['creationTime']
  })

  console.log(response.objects)
  
}

// await fetchObjects()

// Run a near text query
async function nearTextQuery() {
  const questions = client.collections.get('Question');

  const result = await questions.query.nearText('biology', {
    limit: 2,
    returnMetadata: ['distance']
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
    limit: 2
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

 for (let object of result.objects) {
  console.log(JSON.stringify(object.properties, null, 2));
}

 console.log(result.generated);
 return result;
}
// Uncomment to run the grouped generative search
// await generativeSearchGroupedQuery();