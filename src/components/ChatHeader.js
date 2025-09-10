import React from 'react';
import { BsTrashFill, BsDownload } from 'react-icons/bs';
import chatgptIcon from '../assets/icons/chatgpt.svg';

const ChatHeader = ({ onClearChat, onSaveChat }) => {
  return (
    <header className="chat-header">
      <div className="title">
        <img src={chatgptIcon} alt="Chat Icon" className="header-icon" />
        <h1>Personal Assistant</h1>
      </div>
      <div className="header-actions">
        <button className="btn secondary" onClick={onClearChat}>
          <BsTrashFill /> Clear
        </button>
        <button className="btn secondary" onClick={onSaveChat}>
          <BsDownload /> Save JSON
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;