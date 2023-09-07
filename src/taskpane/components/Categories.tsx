import { Tabs, Button } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { generateGPT35Completion } from '../../gpt-service';

interface Prompt {
    name: string;
    prompt: string;
    prefix?: string;
}

export interface Category {
    id: number;
    name: string;
    prompts: Prompt[];
}

interface Props {
    guessedCategory: string;
    categories: Category[];
    setState: Function;
    setIsLoading: Function;
}


const Categories: React.FC<Props> = ({ categories, setState, setIsLoading, guessedCategory }) => {
    const [activeTab, setActiveTab] = useState<string | null>(categories.at(0).name);

    useEffect(() => {
        setActiveTab(guessedCategory)
    }, [guessedCategory])


    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            documentText: '',
        }));
    }, [activeTab])

    const handleClick = async (prompt: Prompt) => {
        setIsLoading(true);
        setState((prevState) => ({
            ...prevState,
            documentText: '',
        }));
        return Word.run(async (context) => {
            /**
             * Insert your Word code here
             */

            // Get the body of the document
            const body = context.document.body;

            // Load the body content
            body.load("text");

            await context.sync();
            try {
                const res = await generateGPT35Completion(prompt.prompt, body.text);
                console.log('summary - ', res)

                // Update the state with the first 200 characters from the document
                await setState((prevState) => ({
                    ...prevState,
                    documentText: `${prompt.prefix || ''}${res}`,
                }));
                await setIsLoading(false)
            } catch (err) {
                setState((prevState) => ({
                    ...prevState,
                    documentText: err,
                }));
                setIsLoading(false);
            }

        });

    }
    return (
        <>
            <Tabs variant="default" value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    {categories.map(category => (
                        <Tabs.Tab value={category.name}>{category.name}</Tabs.Tab>
                    ))}
                    <Tabs.Tab value='q&a'>Q&A</Tabs.Tab>
                </Tabs.List>

                {categories.map(cateogry => (
                    <Tabs.Panel value={cateogry.name} pt="xs">
                        {cateogry.prompts.map(prompt => (
                            <Button variant="subtle" compact onClick={() => handleClick(prompt)}>{prompt.name}</Button>
                        ))}
                    </Tabs.Panel>
                ))}
                <Tabs.Panel value="q&a">Future home of Mini-LenAI</Tabs.Panel>
            </Tabs>
            <hr></hr>
        </>
    );
}

export default Categories;
