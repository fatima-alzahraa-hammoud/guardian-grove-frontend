import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: string;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="text-sm text-left">
      {/* Use remark-gfm to support line breaks and GitHub-flavored Markdown */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
    </div>
  );
};

export default MessageComponent;
