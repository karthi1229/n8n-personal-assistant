import React, { useState } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import rocketIcon from '../assets/icons/rocket.svg';
import toast from 'react-hot-toast';

const Composer = ({ addMessage, webhookUrl, setWebhookUrl }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [status, setStatus] = useState('unknown');

  const handleSendMessage = async () => {
    const url = webhookUrl.trim();
    const msg = inputMessage.trim();
    if (!url || !msg) return;

    addMessage('user', msg);
    setInputMessage('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${await response.text()}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let text = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        text = data.output || data.message || data.text || JSON.stringify(data, null, 2);
      } else {
        text = await response.text();
      }

      addMessage('bot', text);
    } catch (err) {
      addMessage('bot', `❌ Request failed: ${err.message}`);
    }
  };

  const handlePing = async () => {
    setStatus('loading');
    try {
      const res = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'ping' }) });
      if (res.ok) {
        setStatus('ok');
        toast.success('Webhook is working, my love!', { style: { background: 'var(--toast-success-bg)', color: 'var(--text-primary)' }, icon: '🟢' });
      } else {
        setStatus('bad');
        toast.error('Hmm, the webhook returned an error.', { style: { background: 'var(--toast-error-bg)', color: 'var(--text-primary)' }, icon: '🔴' });
      }
    } catch (err) {
      setStatus('bad');
      toast.error('I couldn\'t reach the webhook. Did you check the URL?', { style: { background: 'var(--toast-error-bg)', color: 'var(--text-primary)' }, icon: '🔴' });
    }
  };

  return (
    <div className="composer-container">
      <div className="url-settings">
        <label>Webhook URL</label>
        <div className="url-input-group">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => {
              setWebhookUrl(e.target.value);
              localStorage.setItem('webhook_url', e.target.value);
            }}
            placeholder="Enter n8n webhook URL"
          />
          <button className="btn secondary ping-btn" onClick={handlePing}>
            <BsLink45Deg /> Ping
          </button>
          <span className={`status-dot ${status}`}></span>
        </div>
      </div>
      <div className="composer">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="I'm all ears..."
        />
        <button className="btn send-btn" onClick={handleSendMessage}>
          <img src={rocketIcon} alt="Send" /> Send
        </button>
      </div>
    </div>
  );
};

export default Composer;