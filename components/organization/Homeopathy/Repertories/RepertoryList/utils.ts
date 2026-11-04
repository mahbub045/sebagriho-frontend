import { RepertoryEntry } from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';

// Rubrics/chapters may come back paginated ({ count, results }) or as a plain array
export const toEntries = (data: unknown): RepertoryEntry[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as { results: RepertoryEntry[] }).results ?? [];
  }
  return [];
};

export const toCount = (data: unknown): number => {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === 'object' && 'count' in data) {
    return Number((data as { count: number }).count) || 0;
  }
  return 0;
};

export const getEntryLabel = (entry: RepertoryEntry) =>
  entry.full_path ??
  entry.path ??
  entry.rubric ??
  entry.name ??
  entry.title ??
  entry.text ??
  entry.uid;
