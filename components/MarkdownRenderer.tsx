import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

// Custom styles for rendered markdown to match the app's theme.
const styleSheet = `
.markdown-content h1, .markdown-content h2, .markdown-content h3 {
  color: #f87171; /* red-400 */
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #4b5563; /* gray-600 */
  padding-bottom: 0.25rem;
}
.markdown-content h1 { font-size: 1.25rem; font-weight: 600; }
.markdown-content h2 { font-size: 1.125rem; font-weight: 600; }
.markdown-content h3 { font-size: 1rem; font-weight: 600; }
.markdown-content p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
.markdown-content ul, .markdown-content ol {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  list-style-position: outside;
}
.markdown-content ul { list-style-type: disc; }
.markdown-content ol { list-style-type: decimal; }
.markdown-content li {
  margin-bottom: 0.25rem;
  padding-left: 0.25rem;
}
.markdown-content strong {
  color: #f3f4f6; /* gray-100 */
  font-weight: 600;
}
.markdown-content a {
  color: #f87171; /* red-400 */
  text-decoration: underline;
}
.markdown-content a:hover {
  color: #fb923c; /* approx red-300 */
}
.markdown-content code {
  background-color: #1f2937; /* gray-800 */
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
}
.markdown-content pre {
  background-color: #1f2937; /* gray-800 */
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
`;

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const sanitizedHtml = useMemo(() => {
    const rawHtml = marked.parse(content, { gfm: true, breaks: true }) as string;
    return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target'] });
  }, [content]);

  return (
    <>
      <style>{styleSheet}</style>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </>
  );
};

export default MarkdownRenderer;
