import React, { useState, useEffect } from 'react';

function ChatComponent() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:8080/');      
      ws.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
      };  
      ws.onmessage = (msg) => {
        setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Outro', message: msg.data }]);
      };  
      ws.onclose = () => {
        console.log('Desconectado do servidor WebSocket');
      };  
      setSocket(ws);  
      return () => {
        ws.close();
      };
    }, []);
  
    const sendMessage = () => {
      if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
        setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Eu', message }]);
        socket.send(message);
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