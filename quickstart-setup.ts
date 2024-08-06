// From: https://weaviate.io/developers/weaviate/quickstart
// Use this file to create the example collection.
// To run a query, edit `quickstart-query.ts` to uncomment the line that calls
// the query.

import weaviate, { WeaviateClient, vectorizer, generative } from 'weaviate-client'

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

// Uncomment to check client status
// console.log(await client.isReady())

// Delete the collection if it exists
// To start cleanly each time you run this script, uncomment the delete
// statement. Be careful. If you happen to have another collection called
// 'Question' this statement deletes it.

// if(client.collections.get('Question')){
//   await client.collections.delete('Question')
// }

// Create collection
async function createCollection() {
  const questions = await client.collections.create({
    name: 'Question',
    vectorizers: vectorizer.text2VecOpenAI(),
    generative: generative.openAI(),
  })
  console.log(`Collection ${questions.name} created!`);
}
// Uncomment to create the collection
// await createCollection();

// Verify collection was created
async function checkCollection() {
  const questions = client.collections.get('Question')
  const collectionConfig = await questions.config.get()
  console.log(collectionConfig)
}
// Uncomment to verify the collection
await checkCollection()

// Get data file
const dataFile = 'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json';
async function getJsonData() {
  const file = await fetch(dataFile);
  return file.json();
}

// Import the data
async function importQuestions() {
  const questions = client.collections.get('Question');
  const data = await getJsonData();
  const result = await questions.data.insertMany(data)
  console.log('Bulk inserted: ', result);
}

// Uncomment to import the data
// await importQuestions();
