import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { demoHarnessUsage } from '../lib/fixtures';
import { HarnessUsagePanel } from './HarnessUsagePanel';

describe('HarnessUsagePanel', () => {
  it('shows All Harness and filters to one profile', async () => {
    const user = userEvent.setup();
    const onProfileChange = vi.fn();
    render(
      <HarnessUsagePanel
        usage={demoHarnessUsage}
        locale="en-US"
        profileId="all"
        onProfileChange={onProfileChange}
      />,
    );

    expect(screen.getByText('All Harness')).toBeInTheDocument();
    expect(screen.getByText('Codex')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('View'), 'claude-work');

    expect(onProfileChange).toHaveBeenCalledWith('claude-work');
  });
});
