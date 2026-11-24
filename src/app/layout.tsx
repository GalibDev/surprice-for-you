import type { Metadata } from 'next';
import './globals.css';
import MusicProvider from '@/components/MusicProvider';
export const metadata: Metadata = { title: 'Five Years of Us · Galib & Nabila', description: 'A little scrapbook of our love. Five years of memories, and a lifetime still to come.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><MusicProvider>{children}</MusicProvider></body></html>; }
