import '../styles/ChatBotToggle.css';

const ChatBotToggle = ({ onClick }) => {
  return (
    <button className="chatbot-toggle" onClick={onClick} title="Chat with BookAura Assistant">
      <span className="chat-icon">💬</span>
      <span className="tooltip">Ask about books & policies</span>
    </button>
  );
};

export default ChatBotToggle;
