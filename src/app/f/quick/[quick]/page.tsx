import { QuickFlashcards } from './QuickFlashcards';

interface PageProps {
  params: { quick: string };
}

export default function QuickFlashcardsPage({ params }: PageProps) {
  return <QuickFlashcards decodedUrl={decodeURIComponent(params.quick)} />;
}
