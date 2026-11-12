import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import { getNewsBySlug } from '@/data/news';
import { formatEventDate } from '@/utils/formatters';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  return {
    title: article ? article.title : 'Article Not Found',
  };
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageContainer className="max-w-3xl space-y-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a3aeb8] hover:text-[#b8ff2c]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Dispatches
      </Link>

      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Badge tone="lime">{article.category}</Badge>
          <span className="font-mono text-xs text-[#6f7c87]">
            {formatEventDate(article.publishedAt)}
          </span>
        </div>
        <h1 className="font-display text-4xl font-extrabold uppercase text-[#f5f4ee] sm:text-5xl">
          {article.title}
        </h1>
        <p className="font-mono text-xs text-[#a3aeb8]">By {article.author}</p>
      </div>

      <div className="space-y-4 text-base leading-relaxed text-[#a3aeb8]">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </PageContainer>
  );
}
