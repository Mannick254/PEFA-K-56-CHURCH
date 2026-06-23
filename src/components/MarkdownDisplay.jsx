import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownDisplay = ({ markdown }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
  );
};

export default MarkdownDisplay;
