import "dotenv/config";
import {
  RAGApplicationBuilder,
  SIMPLE_MODELS,
  OpenAi3SmallEmbeddings,
  WebLoader,
} from "@llm-tools/embedjs";

// Both HNSWDb and MemoryCache are in-memory implementations.
import { HNSWDb } from "@llm-tools/embedjs/vectorDb/hnswlib";
import { MemoryCache } from "@llm-tools/embedjs/cache/memory";

const dataUrls = [
  "https://www.meetup.com/berlin-unstructured-data/events/301850640/",
  "https://www.meetup.com/postgresql-meetup-berlin/events/301568465/",
  "https://www.meetup.com/radia-network/events/301937066/",
  "https://www.meetup.com/data-berlin/events/301757414/",
  "https://www.meetup.com/berlin-co-working-networking-meetup-group/events/302016279/",
  "https://www.meetup.com/berlinawsug/events/301755845/",
  "https://www.meetup.com/it-freelancers-in-berlin/events/302038094/",
  "https://www.meetup.com/meetupai-berlin/events/301894368/",
  "https://www.meetup.com/acbebb/events/301919705/",
  "https://www.meetup.com/microsoft-reactor-berlin/events/301057600/",
  "https://www.meetup.com/founders-meetup-berlin/events/301573989/",
  "https://www.meetup.com/creativecodeberlin/events/300994030/",
  "https://www.meetup.com/berlin-js/events/301270360/",
  "https://www.meetup.com/beats-and-burpees/events/301952534/",
  "https://www.meetup.com/communityvillage/events/300925367/",
];

/**
 * Retrieves the prompt based on the command line arguments.
 * If no arguments are provided, a default prompt is returned.
 * @returns {string} The prompt to be used.
 */
const getPrompt = () => {
  const args = process.argv.slice(2);
  let prompt = `${args[0]}`;

  if (args.length === 0) {
    prompt = "What does Ash write about?";
  }

  return prompt;
};

/**
 * Retrieves the RAG application with the specified configuration.
 * @returns {Promise<RAGApplication>} The RAG application.
 */
const getRagApplication = async () => {
  console.log("Getting RAG application...");

  const ragApplication = await new RAGApplicationBuilder()
    .setModel(SIMPLE_MODELS["OPENAI_GPT3.5_TURBO"])
    .setEmbeddingModel(new OpenAi3SmallEmbeddings())
    .setVectorDb(new HNSWDb())
    .setCache(new MemoryCache())
    .build();

  console.log(
    `Built RAG application with: ${ragApplication.model.modelName}\n`
  );

  return ragApplication;
};

/**
 * Loads the resources specified in the dataUrls array.
 * @param {RAGApplication} ragApplication - The RAG application to load the resources into.
 * @param {Array<string>} dataUrls - The URLs of the resources to load.
 * @returns {Promise<Array<LoaderSummary>>} The loader summaries for the resources.
 */
const loadResources = async (ragApplication, dataUrls) => {
  const loaderSummaries = await Promise.all(
    dataUrls.map(async (url) => {
      console.log("Adding loader for:", url);
      const loaderSummary = await ragApplication.addLoader(
        new WebLoader({ urlOrContent: url })
      );

      return loaderSummary;
    })
  );

  console.log(
    "\nLoader summaries:\n",
    loaderSummaries.map((summary) => JSON.stringify(summary)).join("\n")
  );

  return loaderSummaries;
};

/**
 * Prints the output of the RAG query.
 * @param {Object} output - The output object containing the result and sources.
 */
const printRagOutput = (output) => {
  console.log(`
RAG output:
${output.result}

Sourced from:
${output.sources.map((url) => "-" + url).join("\n")}
  `);
};

/**
 * Prompts the RAG application with the specified prompt.
 * @param {RAGApplication} ragApplication - The RAG application to prompt.
 * @param {string} prompt - The prompt to use.
 * @returns {Promise<Object>} The output of the RAG query.
 */
const promptRag = async (ragApplication, prompt) => {
  console.log("\nPrompting with:", prompt);
  const res = await ragApplication.query(prompt);

  return res;
};

/**
 * The main function that executes the RAG query.
 */
const main = async () => {
  const ragApplication = await getRagApplication();
  const loaderSummaries = await loadResources(ragApplication, dataUrls);

  if (loaderSummaries.length && loaderSummaries.length === dataUrls.length) {
    const prompt = getPrompt();
    const ragRes = await promptRag(ragApplication, prompt);
    printRagOutput(ragRes);
  } else {
    console.error("Failed to load resources");
  }
};

main();
