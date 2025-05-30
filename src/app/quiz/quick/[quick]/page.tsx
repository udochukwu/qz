import { QuickQuiz } from './QuickQuiz';

interface PageProps {
  params: { quick: string };
}

export default function QuickQuizPage({ params }: PageProps) {
  return <QuickQuiz decodedUrl={decodeURIComponent(params.quick)} />;
}
