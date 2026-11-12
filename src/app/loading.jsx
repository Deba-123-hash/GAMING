import LoadingScreen from '@/components/ui/LoadingScreen';
import PageContainer from '@/components/layout/PageContainer';

export default function Loading() {
  return (
    <PageContainer>
      <LoadingScreen fullScreen label="Loading Matchday Route..." />
    </PageContainer>
  );
}
