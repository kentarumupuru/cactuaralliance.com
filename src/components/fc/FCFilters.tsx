import { useCallback } from 'react';
import { ACTIVITY_LABELS, ALL_ACTIVITIES, ALL_PLAYSTYLES, PLAYSTYLE_LABELS } from '../../fc/labels';
import { EMPTY_FILTERS, isFilterActive, type FCFilters } from '../../fc/filters';
import type { Activity, Playstyle } from '../../types';
import styles from './FCFilters.module.css';

interface FCFiltersProps {
  filters: FCFilters;
  onChange: (next: FCFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export function FCFilters({ filters, onChange, totalCount, filteredCount }: FCFiltersProps) {
  // react-best-practices: rerender-functional-setstate — derive next state from current via callback
  const togglePlaystyle = useCallback(
    (p: Playstyle) => {
      const next = filters.playstyles.includes(p)
        ? filters.playstyles.filter((x) => x !== p)
        : [...filters.playstyles, p];
      onChange({ ...filters, playstyles: next });
    },
    [filters, onChange],
  );

  const toggleActivity = useCallback(
    (a: Activity) => {
      const next = filters.activities.includes(a)
        ? filters.activities.filter((x) => x !== a)
        : [...filters.activities, a];
      onChange({ ...filters, activities: next });
    },
    [filters, onChange],
  );

  const setSearch = (v: string) => onChange({ ...filters, search: v });
  const setRecruiting = (v: boolean) => onChange({ ...filters, recruitingOnly: v });
  const reset = () => onChange(EMPTY_FILTERS);

  const active = isFilterActive(filters);

  return (
    <section className={styles.wrap} aria-label="Filter free companies">
      <div className={styles.searchRow}>
        <label className={styles.searchLabel}>
          <span className="ca-sr-only">Search FCs</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag, or blurb…"
            className={styles.searchInput}
            spellCheck={false}
          />
        </label>

        <label className={styles.recruitingToggle}>
          <input
            type="checkbox"
            checked={filters.recruitingOnly}
            onChange={(e) => setRecruiting(e.target.checked)}
          />
          <span>Recruiting only</span>
        </label>

        <span className={styles.count} aria-live="polite">
          {active && filteredCount !== totalCount
            ? `${filteredCount} of ${totalCount} FCs`
            : `${totalCount} FC${totalCount === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className={styles.chipGroups}>
        <fieldset className={styles.chipGroup}>
          <legend>Playstyle</legend>
          <ul className={styles.chips}>
            {ALL_PLAYSTYLES.map((p) => {
              const isOn = filters.playstyles.includes(p);
              return (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => togglePlaystyle(p)}
                    aria-pressed={isOn}
                    className={`${styles.chip} ${isOn ? styles.chipOn : ''}`}
                  >
                    {PLAYSTYLE_LABELS[p]}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className={styles.chipGroup}>
          <legend>Activities</legend>
          <ul className={styles.chips}>
            {ALL_ACTIVITIES.map((a) => {
              const isOn = filters.activities.includes(a);
              return (
                <li key={a}>
                  <button
                    type="button"
                    onClick={() => toggleActivity(a)}
                    aria-pressed={isOn}
                    className={`${styles.chip} ${isOn ? styles.chipOn : ''}`}
                  >
                    {ACTIVITY_LABELS[a]}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      {active && (
        <button type="button" onClick={reset} className={styles.reset}>
          Clear filters
        </button>
      )}
    </section>
  );
}
