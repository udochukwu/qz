import { QuickChat } from './QuickChat';

interface PageProps {
  params: { quick: string };
}

export default function QuickChatPage({ params }: PageProps) {
  return <QuickChat decodedUrl={decodeURIComponent(params.quick)} />;
}
