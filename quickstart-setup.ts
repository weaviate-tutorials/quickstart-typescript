// From: https://weaviate.io/developers/weaviate/quickstart

//============ Ignore above here
import weaviate, { WeaviateClient } from 'weaviate-client'
import { vectorizer, generative } from 'weaviate-client'

// Get environment variables
const weaviate_cloud_url_env = process.env.WCD_URL;
const weaviate_cloud_url = weaviate_cloud_url_env !== undefined ? weaviate_cloud_url_env : 'not-present'

const weaviate_cloud_api_key_env = process.env.WCD_API_KEY;
const weaviate_cloud_api_key = weaviate_cloud_api_key_env !== undefined ? weaviate_cloud_api_key_env : 'not-present'

const openai_api_key_env = process.env.OPENAI_API_KEY;
const openai_api_key = openai_api_key_env !== undefined ? openai_api_key_env : 'not-present'

// Create client object
const client: WeaviateClient = await weaviate.connectToWeaviateCloud(
  weaviate_cloud_url as string,
  {
    authCredentials: new weaviate.ApiKey(weaviate_cloud_api_key as string),
    headers: { 'X-OpenAI-Api-Key': openai_api_key as string, }
  }
)

// Check client status
// console.log(await client.isReady())

// Delete old collection if it exists
if(client.collections.get('Question')){
  await client.collections.delete('Question')
}

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
