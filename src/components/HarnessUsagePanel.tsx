import { useMemo } from 'react';
import type { HarnessUsageResponse, HarnessUsageSummary } from '../domain';

function formatUsd(value: number | null, locale: string) {
  return value === null
    ? '—'
    : new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value);
}

function formatTokens(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

function status(summary: HarnessUsageSummary) {
  if (!summary.available) return 'No local usage source';
  if (summary.eventCount === 0) return 'Waiting for usage';
  return `${summary.pricedEventCount.toLocaleString()} priced events`;
}

export function HarnessUsagePanel({
  usage,
  locale,
  profileId,
  onProfileChange,
}: {
  usage: HarnessUsageResponse;
  locale: string;
  profileId: string;
  onProfileChange: (profileId: string) => void;
}) {
  const selected = useMemo(
    () =>
      profileId === 'all'
        ? usage.total
        : usage.summaries.find((summary) => summary.profileId === profileId) ?? usage.total,
    [profileId, usage],
  );
  return (
    <section className="panel harness-usage" aria-labelledby="harness-usage-title">
      <div className="panel-heading harness-usage-heading">
        <div>
          <h2 id="harness-usage-title">Harness usage</h2>
          <span>API-equivalent estimate and reported local cost stay separate.</span>
        </div>
        <label>
          <span>View</span>
          <select value={profileId} onChange={(event) => onProfileChange(event.target.value)}>
            <option value="all">All Harness</option>
            {usage.summaries.map((summary) => (
              <option key={summary.profileId} value={summary.profileId}>
                {summary.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="harness-summary-grid">
        <div>
          <span>API-equivalent</span>
          <strong>{formatUsd(selected.estimatedCostUsd, locale)}</strong>
        </div>
        <div>
          <span>Reported cost</span>
          <strong>{formatUsd(selected.reportedCostUsd, locale)}</strong>
        </div>
        <div>
          <span>Tokens</span>
          <strong>
            {formatTokens(
              selected.inputTokens +
                selected.cachedInputTokens +
                selected.cacheWriteTokens +
                selected.outputTokens,
              locale,
            )}
          </strong>
        </div>
        <div>
          <span>Events</span>
          <strong>{selected.eventCount.toLocaleString(locale)}</strong>
        </div>
      </div>
      {profileId === 'all' && (
        <div className="harness-rows" role="table" aria-label="Harness usage breakdown">
          {usage.summaries.map((summary) => (
            <div className="harness-row" role="row" key={summary.profileId}>
              <div>
                <strong>{summary.label}</strong>
                <span>{status(summary)}</span>
              </div>
              <span>{formatUsd(summary.estimatedCostUsd, locale)}</span>
              <span>{formatTokens(summary.inputTokens + summary.outputTokens, locale)} tokens</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
