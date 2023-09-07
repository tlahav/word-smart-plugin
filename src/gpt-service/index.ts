import axios from "axios";
import { OpenAI } from "langchain/llms/openai";

const apiKey = process.env.OPENAI_API_KEY
const llm = new OpenAI({
  openAIApiKey: apiKey,
  temperature: 0.1,
  maxTokens: 1000
});


export async function generateGPT35Completion(basePrompt: string, document: string): Promise<string> {

  // const systemPrompt = `Given the following document:\n\n${document}\n\nPlease provide a detailed summary of the document and list its major concepts and ideas using a proper reference system.\n\nSummary:`;
  const systemPrompt = basePrompt.trim() === '' ? `Given the following document:\n\n${document}\n\n Create a list of the general subjects detailing where in the text the occur\n\nList:`
    : `Given the following document:\n\n${document}\n\n ${basePrompt}`;

  try {
    const results = await llm.predict(systemPrompt);
    if(results.at(0) === '.') {
      return results.slice(1,-1).trim();
    }
    return results;

  } catch (err) {
    console.error("Error sending request to OpenAI:", err);
    throw err;
  }
}

export async function findCategoryFromText(catNames: string[], bodyText: string) {
  const systemPrompt = `Given the following document: \n\n ${bodyText}\n\n select one category from this list that best captures which type of document this is. List of possible categories: ${catNames.map(cn => cn + '\n')}. If unsure, return 'General'`;
  try {
    const results = await llm.predict(systemPrompt);
    return results.trim();

  } catch (err) {
    console.error("Error sending request to OpenAI:", err);
    throw err;
  }
}