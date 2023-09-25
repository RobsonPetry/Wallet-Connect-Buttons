import React, { useState, useEffect } from 'react';

const WebSocketCp= () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
  
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:8081/');      
      ws.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
        setConnected(true);
      };  
      ws.onmessage = (msg) => {
        console.log('msg received');
        setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Outro', message: msg.data }]);
      };  
      ws.onclose = () => {
        console.log('Desconectado do servidor WebSocket');
        setConnected(false);
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
   <></>
  );
}

export default WebSocketCp;