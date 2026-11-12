'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import Accordion from '@/components/ui/Accordion';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';

const COLOR_SWATCHES = [
  { name: 'Primary BG', hex: '#080B09' },
  { name: 'Secondary BG', hex: '#101713' },
  { name: 'Card Surface', hex: '#151D18' },
  { name: 'Electric Lime', hex: '#C6FF3D' },
  { name: 'Football Orange', hex: '#FF6B35' },
  { name: 'Primary Text', hex: '#F5F7F2' },
  { name: 'Secondary Text', hex: '#9BA69D' },
  { name: 'Border', hex: '#29342D' },
];

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('buttons');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageContainer className="space-y-12">
      <PageHeader
        eyebrow="Phase 06 Design System"
        title="RIVALRY 90 DESIGN SYSTEM"
        description="Internal showcase of original brand logos, color tokens, typography scale, buttons, cards, forms, and accessible UI states."
        breadcrumbs={[{ label: 'Design System', href: '/design-system' }]}
      />

      {/* Brand SVGs */}
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
          Brand Logos (public/branding/)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center justify-center bg-[#080b09] p-6">
            <Image
              src="/branding/logo-primary.svg"
              alt="RIVALRY 90 Primary Logo"
              width={240}
              height={48}
              className="h-12 w-auto"
            />
          </Card>
          <Card className="flex items-center justify-center bg-[#101713] p-6">
            <Image
              src="/branding/logo-compact.svg"
              alt="RIVALRY 90 Compact Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Card>
          <Card className="flex items-center justify-center bg-[#f5f7f2] p-6">
            <Image
              src="/branding/logo-dark.svg"
              alt="RIVALRY 90 Dark Monochrome Logo"
              width={240}
              height={48}
              className="h-12 w-auto"
            />
          </Card>
        </div>
      </section>

      {/* Color Tokens */}
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
          Color Tokens
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="rounded-xl border border-[#29342d] bg-[#151d18] p-3">
              <div
                className="h-14 w-full rounded-lg border border-white/10"
                style={{ backgroundColor: swatch.hex }}
              />
              <p className="mt-2 text-xs font-semibold text-[#f5f7f2]">{swatch.name}</p>
              <p className="font-mono text-[11px] text-[#9ba69d]">{swatch.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Tabs Showcase */}
      <section className="space-y-4">
        <h2 className="font-display text-3xl font-extrabold uppercase text-[#f5f7f2]">
          Components & States
        </h2>
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'buttons', label: 'Buttons & Badges' },
            { id: 'forms', label: 'Forms & Modal' },
            { id: 'feedback', label: 'Accordion & States' },
          ]}
        />

        {activeTab === 'buttons' ? (
          <Card className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="lime">Electric Lime</Badge>
              <Badge tone="orange">Football Orange</Badge>
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="success">Verified</Badge>
              <Badge tone="warning">Stand-In</Badge>
            </div>
          </Card>
        ) : null}

        {activeTab === 'forms' ? (
          <Card className="space-y-4">
            <Input placeholder="Standard RIVALRY 90 input..." aria-label="Sample input" />
            <Button type="button" variant="secondary" onClick={() => setModalOpen(true)}>
              Open Accessible Modal
            </Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Design System Modal"
            >
              <p className="text-sm text-[#9ba69d]">
                Keyboard Escape, backdrop dismiss, and body scroll lock verified.
              </p>
            </Modal>
          </Card>
        ) : null}

        {activeTab === 'feedback' ? (
          <div className="space-y-4">
            <Accordion
              items={[
                {
                  id: 'ds-1',
                  question: 'Accessible Accordion Component',
                  answer: 'Supports aria-expanded, aria-controls, and keyboard activation.',
                },
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <EmptyState
                title="Empty State Pattern"
                description="Clean fallback when filters match zero records."
              />
              <Card className="space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            </div>
          </div>
        ) : null}
      </section>
    </PageContainer>
  );
}
