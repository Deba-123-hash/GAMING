import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ThreeDResourcesHub from '@/components/resources/ThreeDResourcesHub';

describe('3D Development Hub (/resources/3d)', () => {
  it('renders hub heading and filters resources by search query', () => {
    render(<ThreeDResourcesHub />);
    expect(
      screen.getByRole('heading', { name: /RIVALRY 90 – 3D DEVELOPMENT HUB/i })
    ).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search 3D resources');
    fireEvent.change(searchInput, { target: { value: 'Blender' } });

    expect(screen.getByRole('heading', { name: 'Blender' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Mixamo' })).not.toBeInTheDocument();
  });

  it('filters resources by category pill, pricing, and priority', () => {
    render(<ThreeDResourcesHub />);
    fireEvent.click(screen.getByRole('button', { name: 'Future Game Engines' }));

    expect(screen.getByRole('heading', { name: 'Unreal Engine' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Unity Engine' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    fireEvent.change(screen.getByLabelText('Filter by pricing category'), {
      target: { value: 'Paid' },
    });
    expect(screen.getByRole('heading', { name: 'Autodesk Maya' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Blender' })).not.toBeInTheDocument();
  });

  it('expands resource details, copies command, and updates checklist status', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ThreeDResourcesHub />);
    const detailsButtons = screen.getAllByRole('button', { name: /Details/i });
    fireEvent.click(detailsButtons[0]);
    expect(screen.getByText(/Recommended For:/i)).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /^Copy command for Three\.js$/i });
    fireEvent.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith('npm install three');

    const blenderChecklist = screen.getByLabelText(
      'Status for Blender (Desktop 3D modelling & GLB export)'
    );
    fireEvent.change(blenderChecklist, { target: { value: 'Installed' } });
    expect(blenderChecklist).toHaveValue('Installed');
  });
});
