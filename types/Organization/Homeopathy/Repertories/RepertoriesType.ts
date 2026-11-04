export interface Repertory {
  uid: string;
  name: string;
  slug: string;
  source: string;
  version: string;
}

export type RepertoryTab = 'rubrics' | 'chapters';

/** Loose shape shared by rubric and chapter rows — adjust to the real API response */
export interface RepertoryEntry {
  uid?: string;
  name?: string;
  title?: string;
  text?: string;
  path?: string;
  full_path?: string;
  rubric?: string;
}

export interface RepertoryEntryListProps {
  repertoryUid: string;
}

export interface SelectedRubric {
  uid: string;
  label: string;
}

export interface RubricListProps extends RepertoryEntryListProps {
  selectedRubrics: SelectedRubric[];
  onToggleRubric: (rubric: SelectedRubric) => void;
}

export type ChapterListProps = RepertoryEntryListProps;

export interface ChapterRubricsProps extends RepertoryEntryListProps {
  chapterUid: string;
  chapterLabel: string;
}

export interface RepertoryAnalysisProps extends RepertoryEntryListProps {
  selectedRubrics: SelectedRubric[];
  onRemoveRubric: (uid: string) => void;
  onClearRubrics: () => void;
}

export interface AnalysisMatchedRubric {
  rubric_uid: string;
  rubric: string;
  full_path: string;
  translated_rubric: string | null;
  translated_full_path: string | null;
  grade: number;
}

export interface AnalysisRemedy {
  uid: string;
  abbreviation: string;
  name: string;
  alternative_name: string;
  total_selected: number;
  matched_count: number;
  match_percentage: number;
  total_grade: number;
  matched_rubrics: AnalysisMatchedRubric[];
}

export interface RepertoryAnalysisResponse {
  total_selected: number;
  remedies: AnalysisRemedy[];
}

export interface RepertoriesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Repertory[];
}
