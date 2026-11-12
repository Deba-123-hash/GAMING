import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Phase 02 Layout & Navigation components', () => {
  it('renders Header brand, mega menu triggers, and opens SearchDialog', () => {
    render(<Header />);
    expect(screen.getByText(/RIVALRY/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/overview');
    expect(screen.getByRole('link', { name: 'Players' })).toHaveAttribute('href', '/players');
    expect(screen.getByRole('link', { name: '3D Hub' })).toHaveAttribute('href', '/resources/3d');

    fireEvent.click(screen.getByRole('button', { name: 'Open site search' }));
    expect(screen.getByRole('dialog', { name: 'Search RIVALRY 90' })).toBeInTheDocument();
  });

  it('renders 4-column Footer with legal links and back-to-top button', () => {
    render(<Footer />);
    expect(screen.getByText(/RIVALRY 90 Studio Showcase/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });
});
