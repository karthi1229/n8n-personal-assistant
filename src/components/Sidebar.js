import React from 'react';
import { BsSun, BsMoon, BsTrash, BsPencilFill } from 'react-icons/bs';
import chatgptlogo from '../assets/icons/chatgptlogo.svg';
import addIcon from '../assets/icons/add-30.png';
import messageIcon from '../assets/icons/message.svg';
import toast from 'react-hot-toast';

const Sidebar = ({ theme, toggleTheme, onNewChat, onClearAllChats, chats, currentChatId, onSelectChat, onDeleteChat, onRenameChat }) => {
  const handleRenameClick = (e, chat) => {
    e.stopPropagation();
    toast.custom((t) => (
      <div className="toast-content" style={{ background: 'var(--card-color)' }}>
        <p>What new name would you like to give our chat?</p>
        <input type="text" id="rename-input" defaultValue={chat.name} className="rename-input" />
        <div className="toast-buttons">
          <button className="btn secondary" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
          <button className="btn primary" onClick={() => {
            const newName = document.getElementById('rename-input').value;
            if (newName) {
              onRenameChat(chat.id, newName);
              toast.success('Chat renamed!', {
                style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)' },
              });
            }
            toast.dismiss(t.id);
          }}>
            Rename
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src={chatgptlogo} alt="Logo" className="logo-icon" />
        <h1>ALA Assistant</h1>
      </div>
      <div className="sidebar-menu">
        <button className="sidebar-btn new-chat" onClick={() => onNewChat(true)}>
          <img src={addIcon} alt="New Chat" /> New Chat
        </button>
        <div className="chat-list">
          {chats.map(chat => (
            <div key={chat.id} className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
              <div className="chat-info">
                <img src={messageIcon} alt="Chat" />
                <span className="chat-name">{chat.name}</span>
              </div>
              <div className="chat-actions">
                <button className="rename-btn" onClick={(e) => handleRenameClick(e, chat)}>
                  <BsPencilFill />
                </button>
                <button className="delete-btn" onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}>
                  <BsTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <BsSun /> : <BsMoon />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="sidebar-btn" onClick={onClearAllChats}>
          <BsTrash /> Clear All
        </button>
      </div>
    </div>
  );
};

export default Sidebar;