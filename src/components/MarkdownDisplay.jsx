import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownDisplay = ({ markdown }) => {
    if (!markdown) {
        return null;
    }

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
        </ReactMarkdown>
    );
};

export default MarkdownDisplay;
