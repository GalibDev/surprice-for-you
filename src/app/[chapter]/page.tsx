import Scrapbook from '@/components/Scrapbook';
import { chapters } from '@/data/content';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return chapters.filter(c => c.slug).map(c => ({chapter: c.slug})); }
export default async function Chapter({ params }: {params: Promise<{chapter:string}>}) { const {chapter} = await params; if (!chapters.some(c => c.slug === chapter)) notFound(); return <Scrapbook chapter={chapter}/>; }
