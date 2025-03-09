import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import components with client-side rendering
const ThemeProvider = dynamic(() => import('@/components/theme/ThemeContext').then(mod => mod.ThemeProvider), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/loading/LoadingScreen'), { ssr: false });
const Chat = dynamic(() => import('@/components/chat/Chat'), { ssr: false });

export default function Home() {
  return (
    <ThemeProvider>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <LoadingScreen />
          <Chat />
        </Suspense>
      </main>
    </ThemeProvider>
  );
}
