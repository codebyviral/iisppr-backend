// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './App.css';
import ChatIcon from './components/ChatIcon';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessages = [...messages, { user: true, text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { user: false, text: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { user: false, text: 'Sorry, there was an error.' }]);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chatbot-header">
          <div className="header-info">
            <ChatIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        {/* Chat body */}
        <div className="chat-body">
          {messages.length === 0 ? (
            <div className="message bot-message">
              <ChatIcon />
              <p className="message-text">Hi there 👋, <br /> how can I help you today?</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.user ? 'user-message' : 'bot-message'}`}>
                {msg.user ? (
                  <p className="message-text">{msg.text}</p>
                ) : (
                  <>
                    <ChatIcon />
                    <p className="message-text">{msg.text}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Chat footer */}
        <div className="chat-footer">
          <form onSubmit={sendMessage} className="chat-form">
            <input
              type="text"
              className="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              required
            />
            <button type="submit" className="material-symbols-outlined">
              arrow_upward
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
