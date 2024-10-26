/* eslint-disable */
/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
// import Grid from '@mui/material/Grid2';
import ApiChatPoweredBy from './components/ApiChatPoweredBy';
import ApiChatBanner from './components/ApiChatBanner';
import ApiChatExecute from './components/ApiChatExecute';
import ApiChatResponse from './components/ApiChatResponse';
import SampleQueryCard from './components/SampleQueryCard';
import LinearDeterminate from './components/LinearDeterminate';
import AlertDialog from './components/AlertDialog';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';


/**
 * Renders the Create API with AI UI.
 * @returns {JSX} Create API with AI page to render.
 */
const ApiCreateWithAI = () => {
    const [inputQuery, setInputQuery] = useState('');
    const [lastQuery, setLastQuery] = useState('');
    const [finalOutcome, setFinalOutcome] = useState('');
    const [executionResults, setExecutionResults] = useState([]);
    const [taskId, setTaskId] = useState('');  // State to track task ID

    // const abortControllerRef = useRef(new AbortController());

    const handleQueryChange = (event) => {
        const { value } = event.target;
        setInputQuery(value);
    };

    const handleExecute = async () => {
        if (inputQuery.length !== 0) {
            // abortControllerRef.current = new AbortController();
            const query = inputQuery;
            setInputQuery('');
            setLastQuery(inputQuery);
            sendInitialRequest(query);
        }
    };

    const generateTaskId = () => {
        return `task-${Date.now()}`;
    };

    const sendInitialRequest = async (query) => {
        // setFinalOutcome('');
        const newTaskId = 1728534776568;
        setTaskId(newTaskId);
        console.log(newTaskId);

        try {
            console.log(query);
            
            const response = await fetch('http://127.0.0.1:5000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: query,
                    task_id: newTaskId
                }),
            });
            
            const text = await response.text();
            console.log(text);
            setFinalOutcome(<pre>{text}</pre>);
        } catch (error) {
            console.error('Error:', error);
            setFinalOutcome('An error occurred while fetching the data.');
        }
    };

    // styling for the right side box
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%', // Ensure the item takes full height within the stack
        display: 'flex', // Enable Flexbox for vertical alignment
        justifyContent: 'center', // Horizontally center content (optional)
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      }));


    // return (
    //     <div>
    //         <ApiChatPoweredBy/>
    //         <h1>qwerty2</h1>
    //         <ApiChatBanner/>
    //         <ApiChatResponse
    //             lastQuery={lastQuery}
    //             executionResults={executionResults}
    //             finalOutcome={finalOutcome}
    //         />       
    //         <ApiChatExecute
    //             lastQuery={lastQuery}
    //             inputQuery={inputQuery}
    //             handleExecute={handleExecute}
    //             handleQueryChange={handleQueryChange}
    //         />
    //     </div>
    // );
    


    return (
        <div>
            <Stack
                direction="row"
                spacing={1}
                sx={{ width: '100%', height: '80vh' }}
            >
                <Item sx={{ flex: 6 }}>
                    <Stack direction="column" spacing={2} sx={{ width: '100%', height: '100%' }}>
                        <Box><ApiChatPoweredBy sx={{ textAlign: 'left', alignItems: 'flex-start' }} /></Box>
                        {!lastQuery && (
                            <Box>
                                <Stack 
                                    direction="row" 
                                    spacing={7} 
                                    justifyContent="center"
                                >
                                    <SampleQueryCard sx={{ textAlign: 'left' }} />
                                    <SampleQueryCard sx={{ textAlign: 'left' }} />
                                </Stack>
                            </Box>
                        )}
                        {/* <Box>
                            <Stack 
                                direction="row" 
                                spacing={7} 
                                justifyContent="center"
                            >
                                <SampleQueryCard sx={{ textAlign: 'left' }} />
                                <SampleQueryCard sx={{ textAlign: 'left' }} />
                            </Stack>
                        </Box> */}
                        <Box sx={{ flexGrow: 1 }}>
                            {(lastQuery || finalOutcome) && (
                                <ApiChatResponse
                                    lastQuery={lastQuery}
                                    executionResults={executionResults}
                                    finalOutcome={finalOutcome}
                                />
                            )}
                        </Box> {/* Fixed Item 1.3 with flexGrow */}
                        <Box>
                            <ApiChatExecute
                                    lastQuery={lastQuery}
                                    inputQuery={inputQuery}
                                    handleExecute={handleExecute}
                                    handleQueryChange={handleQueryChange}
                            />
                        </Box>
                    </Stack>
                </Item>
                <Item sx={{ flex: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left' }}>
                    {!lastQuery && (
                        <ApiChatBanner />
                        // <LinearDeterminate />
                        // <MonacoEditor
                        //     width='100%'
                        //     height='100%'
                        //     language='yaml'
                        //     theme='vs-dark'
                        //     value={finalOutcome}
                        //     options={{
                        //         readOnly: true,
                        //         minimap: { enabled: false },
                        //         scrollBeyondLastLine: false,
                        //         wordWrap: 'on',
                        //     }}
                        // /> 
                        
                        // TESTING DIALOG BOX
                        // <AlertDialog/>                           
                    )}
                </Item>
            </Stack>
        </div>
    );
};

export default ApiCreateWithAI;
