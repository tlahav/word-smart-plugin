import React, { useEffect, useState } from "react";
import Progress from "./Progress";
import { DefaultButton, Spinner, SpinnerSize } from "@fluentui/react";
import Header from "./Header";
import Categories, { Category } from "./Categories";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm'
import { findCategoryFromText } from "../../gpt-service";

/* global Word, require */

interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

interface AppState {
  documentText: string; // Adding this state for document text
}

const App: React.FC<AppProps> = (props) => {
  const { title, isOfficeInitialized } = props;

  const [state, setState] = useState<AppState>({
    documentText: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [documentCategory, setDocumentCategory] = useState<string>()


  if (!isOfficeInitialized) {
    return (
      <Progress
        title={title}
        logo={require("./../../../assets/logo-filled.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }
  const categories: Category[] = [{
    id: 1,
    name: 'General',
    prompts: [{
      name: 'Summarize',
      prompt: 'Create a succinct summary of the document. Use proper references, and make sure all subjects are mentioned'
    }, {
      name: 'Main Subjects',
      prompt: 'List the main subjects detailed in the document. Annotate each subject in a new line using proper reference system. Use markdown to break the reply into new lines and highlight refererences.  Do not add anything that is not in the document'
    }]
  }, {
    id: 2,
    name: 'Transcript',
    prompts: [
      {
        name: 'Topics',
        prompt: `Build a timeline of the key topics that were discussed.\n |Topic|`
      },
      {
        name: 'People and Topics',
        prompt: `Identify all Speakers and List the topics that each of the speakers care about.\n |Person|Topic|
                Use markdown to format.`
      },
      {
        name: 'Short Summary',
        prompt: `Write a summary of the conversation in under 100 words. Include the attendees and the questiions that were asked. List any action items mentioned by the attendees at the end`
      },
      {
        name: 'Questions',
        prompt: `What questions were raised in the meeting?`
      },
      {
        name: 'Action Items',
        prompt: 'List all Promises and Follow up items mentioned in the transcript. For each, write the timestamp and person in the following format: "HH:MM:SS - <Person Name> - <Item Description> - <Implied due date> USE Markdown'
      },
      {
        name: 'Timeline',
        prompt: `Use the call transcript to summarize the call in minutes. 
                Use this format for each entry: | Time range in minutes | Summary|
                return your answer in a Markdown table format. Use new lines for each time range entry
               `,
        prefix: ` | Time range in minutes | Summary|
               | ---------: | :------------------- |
               `
      },
    ]
  }, {
    id: 3,
    name: 'Proposal',
    prompts: [
      {
        name: 'Main Subjects',
        prompt: 'List the main subjects detailed in the document. Annotate each subject in a new line using proper markdown. Do not add anything that is not in the document'
      },
      {
        name: 'Action Items',
        prompt: 'List all Action Items, Promises, and Follow up items mentioned in the transcript. For each, write the timestamp and person in the following format: "HH:MM:SS - <Person Name> - <Item Description> - <Implied due date>'
      }
    ]
  }, {
    id: 4,
    name: 'Contract',
    prompts: [
      {
        name: 'Main Subjects',
        prompt: 'List the main subjects detailed in the document. Annotate each subject in a new line using proper markdown. Do not add anything that is not in the document'
      },
      {
        name: 'Action Items',
        prompt: 'List all Action Items, Promises, and Follow up items mentioned in the transcript. For each, write the timestamp and person in the following format: "HH:MM:SS - <Person Name> - <Item Description> - <Implied due date>'
      }
    ]
  }]

  Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // Get the body of the document
    const body = context.document.body;

    // Load the body content
    body.load("text");

    await context.sync();
    try {
      // const summary = await generateGPT35Completion(promptText, body.text);
      const catNames = categories.map(el => el.name);
      const cat = await findCategoryFromText(catNames, body.text);
      console.log('cat - ', cat);


      // Update the state with the first 200 characters from the document
      setDocumentCategory(catNames.includes(cat) ? cat : 'General');
      setIsLoading(false)
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        documentText: err,
      }));
      setIsLoading(false);
    }
  })

  return (
    <div className="ms-welcome">
      <Header logo={require("./../../../assets/OW_logo.jpeg")} title={title} message="OWGist" />
      {!isLoading && <Categories guessedCategory={documentCategory} setIsLoading={setIsLoading} setState={setState} categories={categories}></Categories>}
      {isLoading && <Spinner className="spinner" size={SpinnerSize.medium} label={'Processing'} />}
      <ReactMarkdown children={state.documentText} remarkPlugins={[remarkGfm]} />
    </div>
  );
};

export default App;
