import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput,TypingIndicator } from '@chatscope/chat-ui-kit-react'

function App() {

  const API_KEY = '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';
  const [typing,setTyping] = useState(false);
  const [messages, setMessages] = useState([{
    message:"Hi there ! I'm your Jaanu",
    sender:"ChatGPT"
  }]);
  const handleSend = async ( message) =>{
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }

    const newMessages = [...messages, newMessage];
    // update our message state
    setMessages(newMessages);
    // setting a typing indicator
    setTyping(true);
    // process message to gpt
    await processMessageToGPT(newMessages);
  }

  async function processMessageToGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) =>{
      let role = "";
      if(messageObject.sender === "chatGPT"){
        role= 'assistant'
      }else{
        role = 'user'
      }
      return {role:role, content: messageObject.message}
    });

    const systemMessage = {
      content:'this is a system message',
      role: 'system',
    }

    const apiRequestBody = {
      "model":"gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:'POST',
      headers:{
        "Authorization": "Bearer " + API_KEY,
        "Content-type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data)
      console.log(data.choices[0].message.content);

      setMessages([
        ...chatMessages,{
          message: data.choices[0].message.content,
          sender:"ChatGPT"
        }])
    });


    setTyping(false);
  }



  return (
    <div className='App'>
    <h1 className='bg-gradient-to-r from-purple-500 to-blue-500'>ChatGPT</h1>
      <div className='main' >
        <MainContainer className='container'>
          <ChatContainer>
            <MessageList
             typingIndicator={typing ? <TypingIndicator content="Finding answer" /> : null}
            >
              {messages.map((message, index) => {
                return(<Message key={index} model={message} />)
              })}
            </MessageList>
            <MessageInput placeholder='Type your message here...' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
