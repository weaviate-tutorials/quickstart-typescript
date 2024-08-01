// From: https://weaviate.io/developers/weaviate/quickstart
// Use this file to create the example collection.
// To run a query, edit `quickstart-query.ts` to uncomment the line that calls
// the query.

import weaviate, { WeaviateClient } from 'weaviate-client'
import { vectorizer, generative } from 'weaviate-client'

// Get environment variables
const weaviate_cloud_url = process.env.WCD_URL || 'NEEDS A CLOUD URL';
const weaviate_cloud_api_key = process.env.WCD_API_KEY || 'NEEDS A CLOUD API KEY';
const openai_api_key = process.env.OPENAI_API_KEY || 'NEEDS AN OPENAI API KEY';

// Create client object
const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
 weaviate_cloud_url,
 {
   authCredentials: new weaviate.ApiKey(weaviate_cloud_api_key),
   headers: { 'X-OpenAI-Api-Key': openai_api_key, }
 }
)

// Check client status
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
await createCollection();

// Verify collection schema was created
// let check_schema = client.collections.get('Question')
// const collectionConfig = await check_schema.config.get()
// console.log(collectionConfig)

// Get data file
const dataFile = 'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json';
async function getJsonData() {
  const file = await fetch(dataFile);
  return file.json();
}

// Upload data
async function importQuestions() {
  const questions = client.collections.get('Question');
  const data = await getJsonData();
  const result = await questions.data.insertMany(data)
  console.log('Bulk inserted: ', result);
}

await importQuestions();