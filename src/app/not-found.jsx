import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#ff6b1a]">404 · Offside</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold uppercase text-[#f5f4ee] sm:text-6xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#a3aeb8]">
        The requested pitch sector does not exist or has moved to a new tactical zone.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Return to Stadium Home</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
