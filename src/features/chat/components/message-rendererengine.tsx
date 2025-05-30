'use client';
import { memo, useMemo, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import { MathpixLoader, MathpixMarkdown } from 'mathpix-markdown-it';
import { Switch } from '@/components/elements/switch';
import ChunkButton from '@/components/chunk-button';
import MessageLoading from './message-loading';
import { MessageErrorCard } from './message-error-card';
import { useUserStore } from '@/stores/user-store';
import 'katex/dist/katex.min.css';
import { useTranslation } from 'react-i18next';
import { processLatexContent } from '../utils/latex-processor';
import * as Sentry from '@sentry/nextjs';

interface MessageRendererProps {
  message_id: string;
  message: string;
  isStreaming?: boolean;
  isErrored?: boolean;
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
}>(({ content, className, components, rehypePlugins, remarkPlugins }) => {
  useEffect(() => {
    // Check for KaTeX errors after rendering
    const errorElements = document.querySelectorAll('.katex-error');
    if (errorElements.length > 0) {
      errorElements.forEach(errorElement => {
        Sentry.captureException(new Error('Markdown rendering error'), {
          contexts: {
            markdown: {
              originalContent: content,
              errorElement: errorElement.innerHTML,
              errorLocation: errorElement.outerHTML,
              errorTitle: errorElement.getAttribute('title'),
            },
          },
        });
      });
    }
  }, [content]);

  return (
    <ReactMarkdown
      className={className}
      components={components}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}>
      {content}
    </ReactMarkdown>
  );
});

MarkdownContent.displayName = 'MarkdownContent';

const MessageRendererV2 = memo<MessageRendererProps>(
  ({ message_id, message, isStreaming = false, isErrored = false, className }) => {
    const { t } = useTranslation();
    const [showRaw, setShowRaw] = useState(false);
    const { impersonated } = useUserStore();

    // Memoize processed content
    const processedContent = useMemo(() => processLatexContent(message), [message]);

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
      if (showRaw) {
        const rawHtml = message.replace(/\n/g, '<br/>');
        return <span dangerouslySetInnerHTML={{ __html: rawHtml }} />;
      }

      return (
        <MarkdownContent
          content={processedContent}
          className={className}
          components={markdownComponents}
          rehypePlugins={rehypePlugins}
          remarkPlugins={remarkPlugins}
        />
      );
    }, [showRaw, processedContent, className, markdownComponents, rehypePlugins, remarkPlugins]);

    return (
      <article className="message-renderer">
        {impersonated && (
          <Switch checked={showRaw} onChange={() => setShowRaw(prev => !prev)}>
            {t('chat.message.raw')}
          </Switch>
        )}
        {renderContent}
        {isStreaming && <MessageLoading />}
        {isErrored && <MessageErrorCard />}
      </article>
    );
  },
);

MessageRendererV2.displayName = 'MessageRendererV2';

export default MessageRendererV2;
