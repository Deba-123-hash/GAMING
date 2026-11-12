import PageContainer from '@/components/layout/PageContainer';
import ThreeDResourcesHub from '@/components/resources/ThreeDResourcesHub';

export const metadata = {
  title: '3D Development Hub',
  description:
    'RIVALRY 90 – 3D Development Hub for 3D tools, modelling software, animations, asset libraries, and licensing.',
};

export default function ThreeDResourcesPage() {
  return (
    <PageContainer>
      <ThreeDResourcesHub />
    </PageContainer>
  );
}
