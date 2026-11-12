import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ExperienceSection from '@/components/sections/ExperienceSection';
import GameModesSection from '@/components/sections/GameModesSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

describe('Phase 03 Core Homepage Sections', () => {
  it('renders ExperienceSection pillars', () => {
    render(<ExperienceSection />);
    expect(screen.getByText('FOOTBALL. WITHOUT LIMITS.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'GAME MODES' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BUILD YOUR SQUAD' })).toBeInTheDocument();
  });

  it('renders all 6 GameModesSection concepts', () => {
    render(<GameModesSection />);
    expect(screen.getByText('YOUR GAME. YOUR RULES.')).toBeInTheDocument();
    expect(screen.getByText('Quick Match')).toBeInTheDocument();
    expect(screen.getByText('Penalty Challenge')).toBeInTheDocument();
  });

  it('renders FinalCTASection', () => {
    render(<FinalCTASection />);
    expect(screen.getByText('YOUR FOOTBALL STORY STARTS HERE.')).toBeInTheDocument();
  });
});
