// src/components/borrowers/detail/MessagesSection.jsx
import React from 'react';

function MessagesSection({ messages }) {
  return (
    <div className="message-container">
      {messages.map(msg => (
        <div key={msg.id} className="email-message">
          <div className="email-header">
            <div className="email-meta">
              <div className="email-date">{msg.date}</div>
              <div className="email-subject">{msg.subject}</div>
            </div>
            <div className="message-delivery-info">
              Sendt via: {msg.sentVia.join(' og ')}
            </div>
          </div>
          <div className="email-body">
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesSection;