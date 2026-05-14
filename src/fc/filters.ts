import type { Activity, FC, Playstyle } from '../types';

export interface FCFilters {
  search: string;
  recruitingOnly: boolean;
  playstyles: ReadonlyArray<Playstyle>;
  activities: ReadonlyArray<Activity>;
  sortByFeatured: boolean;
}

export const EMPTY_FILTERS: FCFilters = {
  search: '',
  recruitingOnly: false,
  playstyles: [],
  activities: [],
  sortByFeatured: false,
};

export function applyFCFilters(fcs: readonly FC[], filters: FCFilters): FC[] {
  const search = filters.search.trim().toLowerCase();

  const filtered = fcs.filter((fc) => {
    if (filters.recruitingOnly && !fc.recruiting) return false;
    if (filters.playstyles.length > 0 && !filters.playstyles.includes(fc.playstyle)) return false;

    if (filters.activities.length > 0) {
      const fcActivities = new Set(fc.activities);
      for (const a of filters.activities) {
        if (!fcActivities.has(a)) return false;
      }
    }

    if (search) {
      const hay = `${fc.name} ${fc.tag} ${fc.blurb}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }

    return true;
  });

  if (filters.sortByFeatured) {
    // toSorted (react-best-practices: js-tosorted-immutable)
    return filtered.toSorted((a, b) => Number(b.featured) - Number(a.featured));
  }
  return filtered;
}

export function isFilterActive(filters: FCFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.recruitingOnly ||
    filters.playstyles.length > 0 ||
    filters.activities.length > 0
  );
}
