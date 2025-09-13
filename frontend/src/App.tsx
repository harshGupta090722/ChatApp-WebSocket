import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["Hi there 👋", "Hello!"]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    // cleanup on unmount
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
   //@ts-ignore
    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: input,
        },
      })
    );

    setInput(""); // clear input after sending
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="h-[95vh] w-full max-w-lg mx-auto flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-800">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 font-semibold text-lg shadow-md">
          💬 Chat Room: <span className="text-purple-400">Red</span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] p-3 rounded-xl text-sm ${
                i % 2 === 0
                  ? "bg-purple-600 text-white self-start"
                  : "bg-gray-700 text-gray-100 self-end ml-auto"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="w-full bg-gray-800 flex p-3 gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;