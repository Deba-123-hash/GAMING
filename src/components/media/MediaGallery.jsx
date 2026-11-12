'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { MEDIA_ITEMS } from '@/data/mediaData';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export default function MediaGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('ALL');
  const [previewIndex, setPreviewIndex] = useState(null);

  const publishedItems = useMemo(
    () =>
      MEDIA_ITEMS.filter(
        (item) => !item.publicationStatus || item.publicationStatus === 'published'
      ),
    []
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(publishedItems.map((i) => i.category).filter(Boolean)))],
    [publishedItems]
  );

  const visibleItems = useMemo(
    () =>
      publishedItems.filter((item) => {
        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchType = mediaTypeFilter === 'ALL' || item.mediaType === mediaTypeFilter;
        return matchCat && matchType;
      }),
    [publishedItems, selectedCategory, mediaTypeFilter]
  );

  const activeItem = previewIndex !== null ? visibleItems[previewIndex] || null : null;

  const stepPreview = (dir) => {
    if (previewIndex === null || visibleItems.length === 0) return;
    setPreviewIndex((previewIndex + dir + visibleItems.length) % visibleItems.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category);
                setPreviewIndex(null);
              }}
              className={cn(
                'rounded-md border px-3.5 py-1.5 font-mono text-xs uppercase transition-colors',
                selectedCategory === category
                  ? 'border-[#c6ff3d] bg-[#c6ff3d] font-bold text-[#080b09]'
                  : 'border-[#29342d] bg-[#151d18] text-[#9ba69d] hover:text-[#f5f7f2]'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter by media type"
          value={mediaTypeFilter}
          onChange={(e) => {
            setMediaTypeFilter(e.target.value);
            setPreviewIndex(null);
          }}
          className="rounded-md border border-[#29342d] bg-[#151d18] px-3 py-1.5 font-mono text-xs uppercase text-[#f5f7f2]"
        >
          <option value="ALL">All Formats</option>
          <option value="image">Images Only</option>
          <option value="video">Video Reels Only</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPreviewIndex(idx)}
            className="group overflow-hidden rounded-xl border border-[#29342d] bg-[#151d18] text-left transition-all hover:-translate-y-1 hover:border-[#c6ff3d]/60"
          >
            <div className="r90-pitch-grid relative flex aspect-video items-center justify-center border-b border-[#29342d] bg-[#080b09] p-4 text-center">
              <span
                className="h-12 w-12 rounded-full opacity-35 blur-lg"
                style={{ backgroundColor: item.accent }}
              />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded bg-[#080b09]/85 px-2 py-1 font-mono text-[10px] uppercase text-[#c6ff3d]">
                <Eye className="h-3 w-3" aria-hidden="true" /> Preview
              </span>
            </div>
            <div className="space-y-2 p-5">
              <Badge tone="lime">{item.category}</Badge>
              <h3 className="font-display text-xl font-bold uppercase text-[#f5f4ee] group-hover:text-[#c6ff3d]">
                {item.title}
              </h3>
              <p className="text-xs text-[#9ba69d]">{item.summary}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal
        isOpen={Boolean(activeItem)}
        onClose={() => setPreviewIndex(null)}
        title={activeItem?.title || 'Media Preview'}
      >
        {activeItem ? (
          <div className="space-y-4">
            <div className="r90-pitch-grid flex aspect-video flex-col items-center justify-center rounded-xl border border-[#29342d] bg-[#080b09] p-6 text-center">
              <Badge tone="lime">{activeItem.category}</Badge>
              <p className="mt-3 font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
                {activeItem.title}
              </p>
              <p className="mt-2 max-w-md text-xs text-[#9ba69d]">{activeItem.note}</p>
            </div>
            <p className="text-sm text-[#9ba69d]">{activeItem.summary}</p>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => stepPreview(-1)}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 py-2 font-mono text-xs uppercase text-[#f5f7f2] hover:border-[#c6ff3d]"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                onClick={() => stepPreview(1)}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#29342d] bg-[#151d18] px-3 py-2 font-mono text-xs uppercase text-[#f5f7f2] hover:border-[#c6ff3d]"
              >
                Next <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
