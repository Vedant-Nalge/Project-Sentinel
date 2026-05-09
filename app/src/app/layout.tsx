import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Sentinel | Autonomous Incident Resolution',
  description: 'AI-powered monitoring and autonomous incident resolution engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sentinel-dark">
        {children}
      </body>
    </html>
  );
}