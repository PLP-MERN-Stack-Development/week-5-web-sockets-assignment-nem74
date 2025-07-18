import { useEffect, useState } from "react";
import socket from "./socket";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const joinChat = () => {
    if (!username) return;
    socket.emit("user_join", username);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", { text: message });
    setMessage("");
  };

  return (
    <div className="p-4">
      {!joined ? (
        <div>
          <h2>Enter your name to join chat:</h2>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div>
          <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", marginBottom: 10 }}>
            {chat.map((msg, i) => (
              <div key={i}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
