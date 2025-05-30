import { useState, useEffect } from 'react';

export const TIMER_KEY = 'quiz_timer_start_';

export const useQuizTimer = (quizId: string, quizSessionId: string) => {
  const [elapsed, setElapsed] = useState(() => {
    const startTime = localStorage.getItem(`${TIMER_KEY}${quizId}_${quizSessionId}`);
    if (!startTime) {
      const now = Date.now();
      localStorage.setItem(`${TIMER_KEY}${quizId}_${quizSessionId}`, now.toString());
      return 0;
    }
    return Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
  });

  useEffect(() => {
    const timerKey = `${TIMER_KEY}${quizId}_${quizSessionId}`;
    const startTime = localStorage.getItem(timerKey);

    if (!startTime) {
      const now = Date.now();
      localStorage.setItem(timerKey, now.toString());
      setElapsed(0);
    }

    const interval = setInterval(() => {
      const storedStartTime = localStorage.getItem(timerKey);
      if (storedStartTime) {
        const currentElapsed = Math.floor((Date.now() - parseInt(storedStartTime, 10)) / 1000);
        setElapsed(currentElapsed);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [quizId, quizSessionId]);

  return { elapsed };
};
