import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import ParticleBackground from '@/components/ParticleBackground';

export const metadata = {
  title: 'VibeBuild — AI Driven Solutions & Vibe Coding',
  description: 'A modern workshop platform for AI-driven solutions and vibe coding. Build, showcase, and collaborate.',
  keywords: 'AI, workshop, hackathon, vibe coding, machine learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ParticleBackground />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </main>
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
