import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export default function PageContainer({ children, className }) {
  return (
    <div className={cn('py-12 md:py-16 lg:py-20', className)}>
      <Container>{children}</Container>
    </div>
  );
}
