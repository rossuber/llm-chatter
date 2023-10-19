/* eslint-disable no-useless-concat */
import { React, useState } from 'react';
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import XClose from "./XClose";
import { debounce } from 'lodash';
import copy from "copy-to-clipboard";
import Hyphenated from 'react-hyphen';
import { animated, Spring } from "react-spring";

const Chat = ({numba, onClose, systemMessage, responseType, model, temperature, topp, userID, apiKey, langchainURL}) => {

    let sysMsgs = [];
    switch (responseType) {
        case "OpenAI Chat" :
            sysMsgs = [{"role": "system", "content": systemMessage}];
            break;
        case "Ollama LangChain" :
            sysMsgs = [];
            break;
        case "Ollama Chat" :
            sysMsgs = [{"role": "system", "content": systemMessage}];
            break;
      };

    const [chatInput, setChatInput] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [sentOne, setSentOne] = useState(false);
    const [chatMessages, setChatMessages] = useState(sysMsgs);
    const [chatContext, setChatContext] = useState([]);
    const [chatDuration, setChatDuration] = useState(0.0);

    const fetchData = async (input) => {
        let endPath = "";
        let sendPacket = {};
        let sendHeaders = {};
        const bearer = "Bearer " + apiKey;
        const contType = { "Content-Type": "application/json" };

        switch (responseType) {
          case "OpenAI Chat" :
              endPath = "https://api.openai.com/v1/chat/completions";
              sendPacket = {
                  model: model,
                  messages: chatMessages.concat({ "role": "user", "content": input }),
                  temperature: parseFloat(temperature),
                  top_p: parseFloat(topp),
                  user: userID
              };
              sendHeaders = {
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': bearer
                }
              };
          break;
          case "Ollama LangChain" :
              endPath = "http://localhost:8080";
              sendPacket = {
                  model: model,
                  input: input,
                  temperature: parseFloat(temperature),
                  topP: parseFloat(topp),
                  langchainURL: langchainURL
              };
              sendHeaders = { headers: contType };
          break;
          case "Ollama Chat" :
              endPath = "http://localhost:11434/api/generate";
              sendPacket = {
                  model: model,
                  prompt: input,
                  system: systemMessage,
                  context: chatContext,
                  options: {"temperature": parseFloat(temperature), "top_p": parseFloat(topp)},
                  stream: false
              };
              sendHeaders = { headers: contType };
          break;
        };

        try {
            const startTime = Date.now();

            let response = await axios.post(
                endPath,
                sendPacket,
                sendHeaders
            );
            
            const endTime = Date.now();
            console.log(response);
            const durTime = ((endTime - startTime) / 1000).toFixed(2);
            setChatDuration(durTime);

            let theEnd = "";

            switch (responseType) {
                case "OpenAI Chat" : 
                    theEnd = response.data.choices[0].message.content;
                    break;

                case "Ollama Chat" : 
                    const respo = response.data.response;
                    theEnd = respo.trim();
                    setChatContext(response.data.context);
                    break;
                
                case "Ollama LangChain" : 
                    const respon = response.data.text;
                    theEnd = respon.trim();
                    break;
              };
  
              return theEnd;
        } catch (error) {
          console.log(error);
          setIsError(true);
          return "Error: " + error.code;
        };
    };

    const handleChat = debounce(async () => {
        if ( chatInput ) {
            setIsClicked(true);
            setChatInput("");
            try {
                const chatOut = await fetchData(chatInput);
                setSentOne(true);
                setIsClicked(false);
                setChatMessages(chatMessages.concat({ "role": "user", "content": chatInput }, { "role": "assistant", "content": chatOut }));
            } catch (error) {
                setIsClicked(false);
                console.error(error);
                setIsError(true);
                setChatMessages(chatMessages.concat({ "role": "user", "content": chatInput }, { "role": "assistant", "content": "Error: " + error }));
            };
        };
    }, 1000, { leading: true, trailing: false });
     
    const handleEnterKey = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleChat();
        }
    };

    const chatHandler = () => event => {
        const value = event.target.value;
        setChatInput(value);
    };

    const handleCopy = (e) => {
        e.preventDefault();
        const selectedText = document.getSelection().toString();
        const textContent = selectedText.replace(/\xAD/g, '');
        navigator.clipboard.writeText(textContent);
    };

    const copyClick = (value) => {
        if (typeof value === 'string') {
          copy(value);
        };
    };

    return (
        <Spring
        from={{ opacity: 0 }}
        to={[
          { opacity: 1 }
        ]}
        delay={80}>
        {styles => (
          <animated.div style={styles} className="min-w-full self-start mt-1 mb-1 inline p-6 bg-nosferatu-200 rounded-3xl bg-gradient-to-tl from-nosferatu-500 shadow-2xl">
            <table className="border-separate border-spacing-y-4">
                <tbody>
                    <tr>
                        <td colSpan="2" className="pb-4 tracking-wide text-4xl text-center font-bold text-nosferatu-900">
                            <i className="fa-regular fa-comments mr-4 text-nosferatu-800"></i>
                            {responseType} #{numba}
                        </td>
                        <td>
                            <XClose onClose={onClose} />
                        </td>
                    </tr>
                    <tr>
                        <td><b>Model:</b><br/><i>{model}</i></td>
                        <td><b>temperature:</b><br/><i>{temperature}</i></td>
                        <td><b>top_p:</b><br/><i>{topp}</i></td>
                    </tr>
                    { responseType === "Ollama LangChain" &&
                        <tr>
                            <td colSpan="3"><b>Embed Source:</b><br/>
                            <a className="underline" href={langchainURL} alt={langchainURL}>Link</a></td>
                        </tr>
                    }
                    {chatMessages.map((obj, index) => (
                        <tr key={index}>
                            <td onCopy={handleCopy} colSpan="3" className={obj.role === "user" || obj.role === "system" ? 
                                  "py-3 p-3 bg-cullen-300 font-sans rounded-xl text-black-800 text-sm ring-1 whitespace-pre-wrap" : 
                                  "py-3 whitespace-pre-wrap p-3 bg-nosferatu-800 font-mono rounded-xl text-vanHelsing-200 text-sm ring-1"}>
                                <div className="items-end justify-end text-right mb-3">
                                    <i onClick={() => copyClick(obj.content)} className="m-2 fa-solid fa-copy fa-2x cursor-pointer shadow-xl hover:shadow-dracula-900"></i>
                                </div>
                                <div>
                                    <Hyphenated>
                                        {obj.content}
                                    </Hyphenated>
                                </div>
                            </td>
                        </tr>
                    ))}
                    { (!isError && ((responseType != "Ollama LangChain") || !sentOne)) && 
                        <>
                            {sentOne &&
                                <tr>
                                    <td colSpan="3">
                                        <span><b>Process time:</b> {chatDuration} seconds</span>
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td colSpan="2">
                                    <TextareaAutosize autoFocus onKeyDown={handleEnterKey} minRows="3" maxRows="15" className="placeholder:text-6xl placeholder:italic mt-3 hover:bg-nosferatu-400 p-4 min-w-full bg-nosferatu-100 text-sm font-mono text-black ring-1 hover:ring-2 ring-vonCount-900 rounded-xl" placeholder="Chat" onChange={chatHandler()} value={chatInput} />
                                </td>
                                <td className="items-baseline justify-evenly text-center align-middle text-4xl">
                                    <i onClick={ !isClicked ? () => handleChat() : null } className={ isClicked ? "text-dracula-900 mt-4 m-2 fa-solid fa-hat-wizard fa-2x cursor-pointer hover:text-dracula-300" : "text-blade-300 mt-4 m-2 fa-solid fa-message fa-2x cursor-pointer hover:text-blade-900" }></i>
                                </td>
                            </tr>
                        </>
                    }
                </tbody>
            </table>
            </animated.div>
          )}
        </Spring>
    )
};

export default Chat;