import PageContainer from '@/components/layout/PageContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import MediaGallery from '@/components/media/MediaGallery';

export const metadata = {
  title: 'Media',
  description: 'RIVALRY 90 concept renders, trailers, and stadium showcase gallery.',
};

export default function MediaPage() {
  return (
    <PageContainer className="space-y-8">
      <SectionHeading
        eyebrow="Visual Archive"
        title="Media Gallery"
        description="Filterable media frame slots ready for production renders and gameplay showcase reels."
      />
      <MediaGallery />
    </PageContainer>
  );
}
