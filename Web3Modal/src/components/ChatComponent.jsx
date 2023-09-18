import React, { useState, useEffect } from 'react';
import socket from './socket';

function ChatComponent() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Outro', message: msg }]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Eu', message }]);
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'scroll' }}>
        {chatLog.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '80%', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatComponent;