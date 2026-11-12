import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export default function SectionContainer({ children, id, className }) {
  return (
    <section id={id} className={cn('py-14 md:py-20', className)}>
      <Container>{children}</Container>
    </section>
  );
}
