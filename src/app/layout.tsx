import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Five Years of Us · Galib & Nabila', description: 'A little scrapbook of our love. Five years of memories, and a lifetime still to come.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
