'use client';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import { MathpixLoader, MathpixMarkdown } from 'mathpix-markdown-it';
import ChunkButton from '@/components/chunk-button';
import 'katex/dist/katex.min.css';
import { processLatexContent } from '@/features/chat/utils/latex-processor';

interface ContentRendererProps {
  content: string;
  className?: string;
}

const RenderMathpix = memo<{ text: string }>(({ text }) => (
  <MathpixLoader>
    <MathpixMarkdown text={text} />
  </MathpixLoader>
));

RenderMathpix.displayName = 'RenderMathpix';

// Separate the markdown rendering component to prevent re-renders during streaming
const MarkdownContent = memo<{
  content: string;
  className?: string;
  components: any;
  rehypePlugins: any[];
  remarkPlugins: any[];
}>(({ content, className, components, rehypePlugins, remarkPlugins }) => (
  <ReactMarkdown
    className={className}
    components={components}
    rehypePlugins={rehypePlugins}
    remarkPlugins={remarkPlugins}>
    {content}
  </ReactMarkdown>
));

MarkdownContent.displayName = 'MarkdownContent';

const ContentRenderer = memo<ContentRendererProps>(({ content, className }) => {
  // Memoize processed content
  const processedContent = useMemo(() => processLatexContent(content), [content]);

  // Memoize components to prevent re-renders of existing chunks
  const markdownComponents = useMemo(
    () => ({
      chunk: (props: any) => <ChunkButton key={props.children} chunk_id={props.children} />,
      mathpix: (props: any) => <RenderMathpix text={props.content} />,
    }),
    [],
  );

  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeKatex], []);
  const remarkPlugins = useMemo(() => [remarkMath], []);

  // Memoize the entire content render
  const renderContent = useMemo(() => {
    return (
      <MarkdownContent
        content={processedContent}
        className={className}
        components={markdownComponents}
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins}
      />
    );
  }, [processedContent, className, markdownComponents, rehypePlugins, remarkPlugins]);

  return <article className="message-renderer">{renderContent}</article>;
});

ContentRenderer.displayName = 'ContentRenderer';

export default ContentRenderer;
