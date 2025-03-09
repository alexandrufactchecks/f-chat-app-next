'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import components with client-side rendering
const ThemeProvider = dynamic(() => import('./theme/ThemeContext').then(mod => mod.ThemeProvider), { ssr: false });
const LoadingScreen = dynamic(() => import('./loading/LoadingScreen'), { ssr: false });
const Chat = dynamic(() => import('./chat/Chat'), { ssr: false });

export default function ClientApp() {
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