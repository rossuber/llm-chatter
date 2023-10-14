import { React, useState, useEffect } from 'react';
import Chat from "./components/Chat";
import { animated, Spring } from "react-spring";
import debounce from 'lodash/debounce';
import TextareaAutosize from 'react-textarea-autosize';
import axios from "axios";

function App() {
  const [sysMsg, setSysMsg] = useState("Let's work this out in a step by step way to be sure we have the right answer.");
  const [componentList, setComponentList] = useState([]);
  const [contactCount, setContactCount] = useState(1);
  const [advancedSetting, setAdvancedSetting] = useState(false);
  const [samplingType, setSamplingType] = useState("temperature");
  const [responseType, setResponseType] = useState("Ollama Chat");
  const [temperature, setTemperature] = useState("1.0");
  const [model, setModel] = useState("");
  const [topp, setTopp] = useState("1.0");
  const [localModels, setLocalModels] = useState({});
  const [apiKey, setApiKey] = useState("");

  const makeNewComponent = () => {
    const newChat = { 
      id: Date.now(), 
      numba: contactCount, 
      systemMessage: sysMsg, 
      responseType: responseType, 
      model: model, 
      samplingType: samplingType, 
      temperature: temperature, 
      topp: topp, 
      adv: advancedSetting,
      localModels: localModels,
      apiKey: apiKey
    };
    
    setComponentList([...componentList, newChat]);
    setContactCount(contactCount + 1);
  };

  const handleClose = (id) => {
    setComponentList(componentList.filter((container) => container.id !== id));
  };

  function handleSysMsgChange(e) {
    setSysMsg(e.target.value);
  };

  function handleApiKeyChange(e) {
    setApiKey(e.target.value);
  };

  function handleTypeChange(e) {
    setSamplingType(e.target.value);
  };

  function handleRespChange(e) {
    setResponseType(e.target.value);
    switch (e.target.value) {
      case "OpenAI Chat" : 
        setModel("gpt-4");
      break;
      case "Ollama Chat" : 
        setModel(model);
      break;
      default : setModel(model);
    };
  };

  function handleToppChange(e) {
    setTopp(e.target.value);
    setTemperature("1.0");
  };

  function handleTempChange(e) {
    setTemperature(e.target.value);
    setTopp("1.0");
  };


  function handleModelChange(e) {
    setModel(e.target.value);
  };

  const handleCheckboxChange = (event) => { 
    const checkedYes = event.target.checked;
    checkModels();

    if (!checkedYes) {
      setTemperature("1.0");
      setTopp("1.0");
      setResponseType("Ollama Chat");
      setSamplingType("temperature");
    };

    setAdvancedSetting(checkedYes);
  };

  const modelOptions = {
    "OpenAI Chat": [
      { name: "gpt-3.5-turbo" },
      { name: "gpt-3.5-turbo-16k" },
      { name: "gpt-4" },
      { name: "gpt-4-32k" }
    ],

    "Ollama Chat": localModels
  };

  const checkModels = async () => {
    try {
      const response = await axios.get("http://localhost:11434/api/tags");
      setLocalModels(response.data.models);
      setModel(response.data.models[0].name);
    } catch (error) { console.log(error); };
  };

  useEffect(() => {
    checkModels();
  }, []);

  return (
    <div className={`grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center mt-8`}>
        <Spring
          from={{ opacity: 0 }}
          to={[
            { opacity: 1 }
          ]}
          delay={200}>
          {styles => (
            <animated.div onClick={debounce(() => {makeNewComponent();}, 250)} style={styles} className="self-start text-nosferatu-900 place-self-center hover:bg-nosferatu-300 cursor-default bg-nosferatu-200 rounded-3xl text-5xl font-bold m-2 p-12 flex items-center justify-center mb-5 bg-gradient-to-tl from-nosferatu-500 hover:from-nosferatu-600 shadow-2xl hover:shadow-marcelin-700 cursor-pointer">
              <i className="fa-solid fa-address-card mr-4 text-nosferatu-800"></i>
              <h1>New Chat</h1>
            </animated.div>
          )}
        </Spring>
        <Spring
          from={{ opacity: 0 }}
          to={[
            { opacity: 1 }
          ]}
          delay={400}>
          {styles => (
            <animated.div style={styles} className="w-[98%] text-nosferatu-900 xl:col-span-2 2xl:col-span-3 place-self-start hover:bg-nosferatu-300 cursor-default bg-nosferatu-200 rounded-3xl font-bold p-6 flex items-center justify-center m-2 bg-gradient-to-tl from-nosferatu-500 hover:from-nosferatu-600 shadow-2xl hover:shadow-blade-800">
              <div className="w-full">
                <table className="min-w-full">
                  <tbody>
                      <tr>
                        <td className="2xl:w-[10%] xl:w-[14%] lg:w-[18%] md:w-[22%] sm:w-[26%] text-5xl text-center">
                          <i className="fa-solid text-5xl fa-gear text-nosferatu-800 text-center mb-4"></i>
                        </td>
                        <td className="2xl:w-[90%] xl:w-[86%] lg:w-[82%] md:w-[78%] sm:w-[74%] text-3xl tracking-normal text-center font-bold text-nosferatu-900 cursor-pointer">
                          <input className="w-8 h-8 cursor-pointer mb-4" type="checkbox" name="advancedSetting" checked={advancedSetting} onChange={handleCheckboxChange} /> <label className="cursor-pointer leading-6"> Advanced Settings</label> 
                        </td>
                      </tr>
                      <tr>
                        <td>
                          System Message
                        </td>
                        <td className="">
                          <TextareaAutosize minRows="3" maxRows="5" className="w-full font-bold col-span-2 hover:bg-nosferatu-400 p-4 bg-nosferatu-100 text-sm font-mono text-black ring-1 hover:ring-2 ring-vonCount-900 rounded-xl" placeholder="'System' Message" onChange={(e) => handleSysMsgChange(e)} value={sysMsg} />
                        </td>
                      </tr>
                    { advancedSetting && 
                      <>
                        <tr>
                          <td>Chat Source</td>
                          <td className="pb-4 tracking-wide text-center font-bold text-nosferatu-900">
                            <select name="responseType" id="responseType" className="hover:bg-nosferatu-400 cursor-pointer mb-2 p-4 min-w-full bg-nosferatu-100 font-mono rounded-xl text-black ring-1 hover:ring-2 ring-vonCount-900" onChange = {(e) => handleRespChange(e)} value={responseType}>
                                <option value="OpenAI Chat">OpenAI Chat</option>
                                <option value="Ollama Chat">Ollama Chat</option>
                            </select>
                          </td>
                        </tr>
                        { responseType === "OpenAI Chat" ? 
                          <tr>
                            <td>API Key</td>
                            <td className="pb-4 tracking-wide text-center font-bold text-nosferatu-900"><input className="w-full font-bold hover:bg-nosferatu-400 p-6 bg-nosferatu-100 text-sm font-mono text-black ring-1 hover:ring-2 ring-vonCount-900 rounded-xl" onChange = {(e) => handleApiKeyChange(e)} type="password" value={apiKey}></input></td>
                          </tr>
                          : <></>
                        }
                        <tr>
                          <td>Model</td>
                          <td className="pb-4 tracking-wide text-center font-bold text-nosferatu-900">
                            <select name="model" id="model" className="hover:bg-nosferatu-400 cursor-pointer mb-2 p-4 min-w-full bg-nosferatu-100 font-mono rounded-xl text-black ring-1 hover:ring-2 ring-vonCount-900" onChange = {(e) => handleModelChange(e)} value={model}>
                              {modelOptions[responseType].map((option) => (
                                <option key={option.name} value={option.name}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td>Sampling Type</td>
                          <td className="pb-4 tracking-wide text-center font-bold text-nosferatu-900">
                            <select name="samplingType" id="samplingType" className="hover:bg-nosferatu-400 cursor-pointer mb-2 p-4 min-w-full bg-nosferatu-100 font-mono rounded-xl text-black ring-1 hover:ring-2 ring-vonCount-900" onChange = {(e) => handleTypeChange(e)} value={samplingType}>
                                <option value="temperature">temperature</option>
                                <option value="topp">top_p</option>
                            </select>
                          </td>
                        </tr>
                        { samplingType === "temperature" ? 
                          <tr>
                            <td>temperature</td>
                            <td className="tracking-wide text-center font-bold text-nosferatu-900">
                              <select name="temperature" id="temperature" className="hover:bg-nosferatu-400 cursor-pointer mb-2 p-4 min-w-full bg-nosferatu-100 font-mono rounded-xl text-black ring-1 hover:ring-2 ring-vonCount-900" onChange = {(e) => handleTempChange(e)} value={temperature}>
                                  <option value="0.0">0.0</option>
                                  <option value="0.1">0.1</option>
                                  <option value="0.2">0.2</option>
                                  <option value="0.3">0.3</option>
                                  <option value="0.4">0.4</option>
                                  <option value="0.5">0.5</option>
                                  <option value="0.6">0.6</option>
                                  <option value="0.7">0.7</option>
                                  <option value="0.8">0.8</option>
                                  <option value="0.9">0.9</option>
                                  <option value="1.0">1.0</option>
                                  <option value="1.1">1.1</option>
                                  <option value="1.2">1.2</option>
                                  <option value="1.3">1.3</option>
                                  <option value="1.4">1.4</option>
                                  <option value="1.5">1.5</option>
                                  <option value="1.6">1.6</option>
                                  <option value="1.7">1.7</option>
                                  <option value="1.8">1.8</option>
                                  <option value="1.9">1.9</option>
                                  <option value="2.0">2.0</option>
                              </select>
                            </td>
                          </tr>
                        :
                          <tr>
                            <td>top_p</td>
                            <td className="tracking-wide text-center font-bold text-nosferatu-900">
                              <select name="topp" id="topp" className="hover:bg-nosferatu-400 cursor-pointer mb-2 p-4 min-w-full bg-nosferatu-100 font-mono rounded-xl text-black ring-1 hover:ring-2 ring-vonCount-900" onChange = {(e) => handleToppChange(e)} value={topp}>
                                <option value="0.01">0.01</option>
                                <option value="0.02">0.02</option>
                                <option value="0.03">0.03</option>
                                <option value="0.04">0.04</option>
                                <option value="0.05">0.05</option>
                                <option value="0.06">0.06</option>
                                <option value="0.07">0.07</option>
                                <option value="0.08">0.08</option>
                                <option value="0.09">0.09</option>
                                <option value="0.1">0.1</option>
                                <option value="0.2">0.2</option>
                                <option value="0.3">0.3</option>
                                <option value="0.4">0.4</option>
                                <option value="0.5">0.5</option>
                                <option value="0.6">0.6</option>
                                <option value="0.7">0.7</option>
                                <option value="0.8">0.8</option>
                                <option value="0.9">0.9</option>
                                <option value="1.0">1.0</option>
                              </select>
                            </td>
                          </tr>
                        }
                      </>
                    }
                  </tbody>
                </table>
              </div>
            </animated.div>
          )}
        </Spring> 
      
        {componentList.slice().reverse().map((container) => (
          <Chat 
            key={container.id} 
            systemMessage={container.systemMessage} 
            responseType={container.responseType} 
            model={container.model} 
            samplingType={container.samplingType} 
            adv={container.adv} 
            temperature={container.temperature} 
            topp={container.topp} 
            userID={container.theID} 
            onClose={() => handleClose(container.id)} numba={container.numba}
            apiKey={container.apiKey}
          />
        ))}
    </div>
  );
};

export default App;