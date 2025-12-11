import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnifiedProvider } from '../src/context/UnifiedContext';
import NavigationBar from '../src/components/NavigationBar';
import '../src/styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [quizProgress, setQuizProgress] = useState(0);
  const [quizMode, setQuizMode] = useState('final'); // Default to 'final' mode
  const router = useRouter();

  // Single ping on app load to wake up backend (if deployed)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    fetch(`${apiUrl}/health`, { method: 'GET' })
      .then(() => console.log('Backend warming ping sent'))
      .catch(() => {}); // Silent fail
  }, []);

  // Hide navigation bar when in final mode on quiz page, landing, or roadmap pages
  const shouldShowNav = !(quizMode === 'final' && (router.pathname === '/quiz' || router.pathname === '/' || router.pathname === '/roadmap' || router.pathname === '/roadmap-new' || router.pathname === '/roadmap-new-2' || router.pathname === '/roadmap-experimental' || router.pathname === '/roadmap-experimental-v2'));

  return (
    <UnifiedProvider>
      <>
        {shouldShowNav && (
          <NavigationBar
            progress={quizProgress}
            quizMode={quizMode}
            onQuizModeChange={setQuizMode}
          />
        )}
        <Component
          {...pageProps}
          onProgressChange={setQuizProgress}
          quizMode={quizMode}
        />
      </>
    </UnifiedProvider>
  );
}

export default MyApp;
