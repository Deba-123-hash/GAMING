'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileText,
  Filter,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  THREE_D_RESOURCES,
  THREE_D_RESOURCE_CATEGORIES,
  validateThreeDResources,
} from '@/data/threeDResources';
import { ASSET_REGISTRY } from '@/data/assetRegistry';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const DEFAULT_CHECKLIST = [
  {
    id: 'chk-npm',
    label: 'Core npm 3D packages (three, R3F, drei, postprocessing, rapier)',
    status: 'Installed',
    locked: true,
  },
  {
    id: 'chk-blender',
    label: 'Blender (Desktop 3D modelling & GLB export)',
    status: 'Not verified',
    locked: false,
  },
  {
    id: 'chk-spline',
    label: 'Spline account (Browser 3D prototyping)',
    status: 'Available online',
    locked: false,
  },
  {
    id: 'chk-mixamo',
    label: 'Mixamo access (Character rigging & locomotion clips)',
    status: 'Available online',
    locked: false,
  },
  {
    id: 'chk-character',
    label: 'Original fictional player .glb asset',
    status: 'Not installed',
    locked: false,
  },
  {
    id: 'chk-anim',
    label: 'Player animation clips (idle, walk, run, dribble, shoot, celebration)',
    status: 'Not installed',
    locked: false,
  },
  { id: 'chk-stadium', label: 'Stadium .glb model', status: 'Not installed', locked: false },
  {
    id: 'chk-materials',
    label: 'PBR materials & kit textures (KTX2 / WebP)',
    status: 'Not installed',
    locked: false,
  },
  {
    id: 'chk-hdri',
    label: 'Night floodlight HDRI (.hdr / .exr)',
    status: 'Not installed',
    locked: false,
  },
  {
    id: 'chk-validate',
    label: 'GLB validation completed (gltf-validator)',
    status: 'Not verified',
    locked: false,
  },
  {
    id: 'chk-optimize',
    label: 'Asset optimization completed (Draco / Meshopt / KTX2)',
    status: 'Not verified',
    locked: false,
  },
  {
    id: 'chk-license',
    label: 'Asset licenses logged in docs/3D_ASSET_LICENSE_REGISTER.md',
    status: 'Not verified',
    locked: false,
  },
];

const CHECKLIST_STATES = [
  'Installed',
  'Not installed',
  'Available online',
  'Optional',
  'Not verified',
];
const STORAGE_KEY = 'rivalry90-3d-setup-checklist';
const CHECKLIST_EVENT = 'rivalry90-checklist-change';

let cachedChecklistRaw = null;
let cachedChecklistValue = DEFAULT_CHECKLIST;

function subscribeChecklist(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(CHECKLIST_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CHECKLIST_EVENT, handler);
  };
}

function getChecklistSnapshot() {
  if (typeof window === 'undefined') return DEFAULT_CHECKLIST;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHECKLIST;
    if (raw !== cachedChecklistRaw) {
      const parsed = JSON.parse(raw);
      cachedChecklistRaw = raw;
      cachedChecklistValue = Array.isArray(parsed) ? parsed : DEFAULT_CHECKLIST;
    }
    return cachedChecklistValue;
  } catch {
    return DEFAULT_CHECKLIST;
  }
}

function getChecklistServerSnapshot() {
  return DEFAULT_CHECKLIST;
}

function persistChecklist(next) {
  try {
    const serialized = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedChecklistRaw = serialized;
    cachedChecklistValue = next;
    window.dispatchEvent(new Event(CHECKLIST_EVENT));
  } catch {
    // Ignore storage restrictions
  }
}

export default function ThreeDResourcesHub() {
  const validResources = useMemo(() => validateThreeDResources(THREE_D_RESOURCES), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);
  const checklist = useSyncExternalStore(
    subscribeChecklist,
    getChecklistSnapshot,
    getChecklistServerSnapshot
  );

  const updateChecklistStatus = (id, nextStatus) => {
    const next = checklist.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
    persistChecklist(next);
  };

  const resourceTypes = useMemo(
    () => ['All', ...Array.from(new Set(validResources.map((r) => r.resourceType)))],
    [validResources]
  );

  const pricingGroups = ['All', 'Free', 'Freemium', 'Paid', 'License Varies'];
  const priorities = ['All', 'Essential', 'High', 'Recommended', 'Optional', 'Future Scope'];

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return validResources.filter((item) => {
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchType = selectedType === 'All' || item.resourceType === selectedType;
      const matchPriority = selectedPriority === 'All' || item.priority === selectedPriority;

      let matchPricing = true;
      if (selectedPricing === 'Free') {
        matchPricing = item.pricingCategory.toLowerCase().startsWith('free');
      } else if (selectedPricing === 'Freemium') {
        matchPricing = item.pricingCategory.toLowerCase().includes('freemium');
      } else if (selectedPricing === 'Paid') {
        matchPricing = item.pricingCategory === 'Paid';
      } else if (selectedPricing === 'License Varies') {
        matchPricing = item.pricingCategory.toLowerCase().includes('varies');
      }

      return matchQuery && matchCategory && matchType && matchPricing && matchPriority;
    });
  }, [
    validResources,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedPricing,
    selectedPriority,
  ]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyCommand = async (id, text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Overview */}
      <div className="rounded-2xl border border-white/10 bg-[#12171d] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="lime">Internal Dev Workspace</Badge>
          <Badge tone="orange">{validResources.length} Verified Resources</Badge>
          <Badge tone="neutral">JavaScript / R3F v9</Badge>
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase text-[#f5f4ee] sm:text-5xl">
          RIVALRY 90 – 3D DEVELOPMENT HUB
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#a3aeb8] sm:text-base">
          Your central workspace for 3D tools, modelling software, animations, asset libraries and
          development resources.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#0b0e11] p-4">
            <p className="font-mono text-xs uppercase text-[#6f7c87]">Installed Core Stack</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#b8ff2c]">
              {validResources.filter((r) => r.status.startsWith('Installed')).length} Packages
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0b0e11] p-4">
            <p className="font-mono text-xs uppercase text-[#6f7c87]">Desktop / Browser Tools</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#f5f4ee]">8 Suites</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0b0e11] p-4">
            <p className="font-mono text-xs uppercase text-[#6f7c87]">Asset & Validation Sites</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#f5f4ee]">10 Sources</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0b0e11] p-4">
            <p className="font-mono text-xs uppercase text-[#6f7c87]">Active 3D Asset Registry</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#ff6b1a]">
              {ASSET_REGISTRY.length} Procedural Stand-Ins
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#12171d] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6f7c87]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Blender, Mixamo, Poly Haven, Three.js, gltf-validator..."
              aria-label="Search 3D resources"
              className="w-full rounded-lg border border-white/15 bg-[#0b0e11] py-2.5 pr-4 pl-10 text-sm text-[#f5f4ee] placeholder:text-[#6f7c87]"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
            <select
              aria-label="Filter by application type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0b0e11] px-3 py-2 text-xs text-[#f5f4ee]"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  Type: {type}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by pricing category"
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0b0e11] px-3 py-2 text-xs text-[#f5f4ee]"
            >
              {pricingGroups.map((price) => (
                <option key={price} value={price}>
                  Pricing: {price}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0b0e11] px-3 py-2 text-xs text-[#f5f4ee]"
            >
              {priorities.map((prio) => (
                <option key={prio} value={prio}>
                  Priority: {prio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 font-mono text-xs text-[#6f7c87]">
            <Filter className="h-3.5 w-3.5" aria-hidden="true" /> Categories:
          </span>
          {THREE_D_RESOURCE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors',
                selectedCategory === category
                  ? 'border-[#b8ff2c] bg-[#b8ff2c] text-[#0b0e11] font-bold'
                  : 'border-white/10 bg-[#0b0e11] text-[#a3aeb8] hover:border-white/30 hover:text-[#f5f4ee]'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-[#a3aeb8]">
          Showing {filteredResources.length} of {validResources.length} resources
        </p>

        {filteredResources.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#12171d] p-8 text-center text-sm text-[#a3aeb8]">
            No matching 3D tools or libraries. Clear one of the active filters to view all
            resources.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              const isCopied = copiedId === item.id;
              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#12171d] p-5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone={item.priority === 'Essential' ? 'lime' : 'neutral'}>
                        {item.priority}
                      </Badge>
                      <Badge tone={item.status.startsWith('Installed') ? 'success' : 'orange'}>
                        {item.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#6f7c87]">
                        {item.category} · {item.resourceType}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-[#f5f4ee]">
                        {item.name}
                      </h2>
                      <p className="font-mono text-xs text-[#b8ff2c]">{item.purpose}</p>
                    </div>

                    <p className="text-xs leading-relaxed text-[#a3aeb8]">{item.description}</p>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#a3aeb8]">
                      <span className="rounded bg-[#0b0e11] px-2 py-0.5">
                        {item.pricingCategory}
                      </span>
                      <span className="rounded bg-[#0b0e11] px-2 py-0.5">{item.platform}</span>
                    </div>

                    {item.installCommand ? (
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0b0e11] px-3 py-2">
                        <code className="truncate font-mono text-[11px] text-[#f5f4ee]">
                          {item.installCommand}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(item.id, item.installCommand)}
                          aria-label={`Copy command for ${item.name}`}
                          className="inline-flex shrink-0 items-center gap-1 rounded bg-white/10 px-2 py-1 font-mono text-[10px] uppercase text-[#b8ff2c] hover:bg-white/20"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" aria-hidden="true" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" aria-hidden="true" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}

                    {isExpanded ? (
                      <div className="space-y-2 rounded-lg border border-white/10 bg-[#0b0e11] p-3 text-xs text-[#a3aeb8]">
                        <p>
                          <strong className="text-[#f5f4ee]">Recommended For:</strong>{' '}
                          {item.recommendedFor}
                        </p>
                        <p>
                          <strong className="text-[#f5f4ee]">License Notes:</strong>{' '}
                          {item.licenseNotes}
                        </p>
                        <p>
                          <strong className="text-[#f5f4ee]">Account Required:</strong>{' '}
                          {item.requiresAccount ? 'Yes' : 'No'} · Verified {item.lastVerified}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[#b8ff2c] hover:underline"
                      >
                        Site <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                      <a
                        href={item.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[#a3aeb8] hover:text-[#f5f4ee] hover:underline"
                      >
                        Docs <FileText className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase text-[#a3aeb8] hover:text-[#f5f4ee]"
                    >
                      {isExpanded ? (
                        <>
                          Less <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Details <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Installation & Asset Setup Checklist + Registry */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#12171d] p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f4ee]">
                Installation & Asset Setup Checklist
              </h2>
              <p className="text-xs text-[#a3aeb8]">
                Desktop software cannot be auto-detected from the browser. Update local team
                progress manually.
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-[#b8ff2c]" aria-hidden="true" />
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-2 rounded-lg border border-white/10 bg-[#0b0e11] p-3 sm:flex-row sm:items-center"
              >
                <span className="text-xs text-[#f5f4ee]">{item.label}</span>
                <select
                  aria-label={`Status for ${item.label}`}
                  value={item.status}
                  disabled={item.locked}
                  onChange={(e) => updateChecklistStatus(item.id, e.target.value)}
                  className="rounded border border-white/15 bg-[#12171d] px-2.5 py-1 font-mono text-xs text-[#b8ff2c] disabled:opacity-80"
                >
                  {CHECKLIST_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#12171d] p-6 lg:col-span-5">
          <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f4ee]">
            Asset Registry & Licensing
          </h2>
          <p className="text-xs text-[#a3aeb8]">
            Active records from <code className="text-[#b8ff2c]">src/data/assetRegistry.js</code>.
            Log all downloaded models in{' '}
            <code className="text-[#b8ff2c]">docs/3D_ASSET_LICENSE_REGISTER.md</code>.
          </p>

          <div className="space-y-3">
            {ASSET_REGISTRY.map((asset) => (
              <div
                key={asset.id}
                className="rounded-lg border border-white/10 bg-[#0b0e11] p-3.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-[#f5f4ee]">{asset.name}</strong>
                  <Badge tone={asset.isPlaceholder ? 'warning' : 'success'}>
                    {asset.isPlaceholder ? 'Procedural Stand-In' : 'Production GLB'}
                  </Badge>
                </div>
                <p className="mt-1 font-mono text-[11px] text-[#a3aeb8]">{asset.filePath}</p>
                <p className="mt-1 text-[11px] text-[#6f7c87]">
                  Format: {asset.format} · License: {asset.license}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
