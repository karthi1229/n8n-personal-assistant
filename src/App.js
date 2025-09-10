import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import Composer from './components/Composer';
import toast, { Toaster } from 'react-hot-toast';
import './styles/App.css';
import './styles/colors.css';
import './styles/fonts.css';

const AESTHETIC_FONT = 'ᴀᴇsᴛʜᴇᴛɪᴄ';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('https://karthi122229.app.n8n.cloud/webhook/jarvise');

  const currentConvo = chats.find(c => c.id === currentChatId)?.convo || [];

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('n8n_chats') || '[]');
    setChats(savedChats);
    if (savedChats.length > 0) {
      setCurrentChatId(savedChats[0].id);
    } else {
      handleNewChat(false);
    }
    
    const savedUrl = localStorage.getItem('webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const saveChats = (updatedChats) => {
    setChats(updatedChats);
    localStorage.setItem('n8n_chats', JSON.stringify(updatedChats));
  };

const addMessage = (role, text) => {
  if (!currentChatId) return;
  const when = new Date().toLocaleString();
  setChats(prevChats => {
    const updatedChats = prevChats.map(chat => {
      if (chat.id === currentChatId) {
        console.log("Appending new message to:", chat.convo);
        return { ...chat, convo: [...chat.convo, { role, text, when }] };
      }
      return chat;
    });
    localStorage.setItem('n8n_chats', JSON.stringify(updatedChats));
    return updatedChats;
  });
};




  const handleNewChat = (showToast = true) => {
    const newChatId = uuidv4();
    const newChat = {
      id: newChatId,
      name: `Chat ${chats.length + 1}`,
      convo: []
    };
    saveChats([newChat, ...chats]);
    setCurrentChatId(newChatId);

    if (showToast) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 500)),
        {
          loading: 'Starting a new conversation...',
          success: <b>A fresh start.</b>,
          error: <b>Hmm, something went wrong.</b>,
        },
        { style: { fontFamily: AESTHETIC_FONT, background: 'var(--toast-bg)', color: 'var(--text-primary)' } }
      );
    }
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };

  const handleDeleteChat = (id) => {
    toast((t) => (
      <div className="toast-content">
        <p>Are you sure you want to forget this conversation?</p>
        <div className="toast-buttons">
          <button className="btn secondary" onClick={() => toast.dismiss(t.id)}>
            Stay with me
          </button>
          <button className="btn danger" onClick={() => {
            const updatedChats = chats.filter(chat => chat.id !== id);
            saveChats(updatedChats);
            if (currentChatId === id) {
              setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
              if (updatedChats.length === 0) {
                handleNewChat(false);
              }
            }
            toast.success('Conversation forgotten!', {
              style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)', fontFamily: AESTHETIC_FONT },
              icon: '✅',
            });
          }}>
            Forget it
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };
  
  const handleClearAllChats = () => {
    toast((t) => (
      <div className="toast-content">
        <p>Are you sure you want to delete all conversations?</p>
        <div className="toast-buttons">
          <button className="btn secondary" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
          <button className="btn danger" onClick={() => {
            saveChats([]);
            setCurrentChatId(null);
            handleNewChat(false);
            toast.success('All conversations cleared!', {
              style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)', fontFamily: AESTHETIC_FONT },
              icon: '✅',
            });
          }}>
            Delete All
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleRenameChat = (id, newName) => {
    const updatedChats = chats.map(chat => chat.id === id ? { ...chat, name: newName } : chat);
    saveChats(updatedChats);
  };

  const handleClearCurrentChat = () => {
    const updatedChats = chats.map(chat => chat.id === currentChatId ? { ...chat, convo: [] } : chat);
    saveChats(updatedChats);
    toast.success('This conversation is now empty.', { style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)' }, icon: '✅' });
  };

  const handleSaveChat = () => {
    const chatToSave = chats.find(c => c.id === currentChatId);
    if (!chatToSave) return;
    const blob = new Blob([JSON.stringify(chatToSave.convo, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${chatToSave.name.toLowerCase().replace(/\s/g, '-')}-history.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('I saved our memories for you!', { style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)' }, icon: '💾' });
  };

  return (
    <div className="app-container">
      <Toaster />
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        onNewChat={handleNewChat}
        onClearAllChats={handleClearAllChats}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <div className="main-content">
        <ChatHeader onClearChat={handleClearCurrentChat} onSaveChat={handleSaveChat} />
        <ChatArea convo={currentConvo} />
        <Composer
          addMessage={addMessage}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
        />
      </div>
    </div>  
  );
};

export default App;