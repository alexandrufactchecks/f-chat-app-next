'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';

// Dynamically import components with client-side rendering
const ThemeProvider = dynamic(() => import('./theme/ThemeContext').then(mod => mod.ThemeProvider), { 
  ssr: false,
  loading: () => <div>Loading Theme Provider...</div>
});

const LoadingScreen = dynamic(() => import('./loading/LoadingScreen'), { 
  ssr: false,
  loading: () => <div>Loading Loading Screen...</div>
});

const Chat = dynamic(() => import('./chat/Chat'), { 
  ssr: false,
  loading: () => <div>Loading Chat Component...</div>
});

export default function ClientApp() {
  useEffect(() => {
    console.log('ClientApp mounted');
  }, []);

  return (
    <ThemeProvider>
      <main style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <Suspense fallback={<div>Loading components...</div>}>
          <LoadingScreen />
          <Chat />
        </Suspense>
      </main>
    </ThemeProvider>
  );
} 