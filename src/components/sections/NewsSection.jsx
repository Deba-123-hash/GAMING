import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import NewsGrid from '@/components/news/NewsGrid';
import Button from '@/components/ui/Button';
import { NEWS_ARTICLES } from '@/data/news';

export default function NewsSection({ showExploreCta = true }) {
  return (
    <section className="border-b border-[#29342d] py-16 md:py-24">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Demonstration Editorial"
            title="INSIDE THE WORLD OF RIVALRY 90."
            description="Architecture dispatches, club lore, and 3D pipeline updates."
          />
          {showExploreCta ? (
            <Button asChild variant="secondary">
              <Link href="/news">
                EXPLORE NEWS <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
        <NewsGrid articles={NEWS_ARTICLES} />
      </Container>
    </section>
  );
}
