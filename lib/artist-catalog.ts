export type ArtistLanguage = "zh" | "en" | "ko";

export interface LanguageOption {
  id: ArtistLanguage;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
  { id: "ko", label: "한국어" },
];

/** Primary language for playlist / channel filtering */
const ARTIST_LANGUAGE: Record<string, ArtistLanguage> = {
  周杰伦: "zh",
  刘若英: "zh",
  毛不易: "zh",
  Beyond: "zh",
  Jimin: "ko",
  "Jung Kook": "ko",
  NewJeans: "ko",
};

const DEFAULT_LANGUAGE: ArtistLanguage = "en";

export function getArtistLanguage(artistName: string): ArtistLanguage {
  return ARTIST_LANGUAGE[artistName] ?? DEFAULT_LANGUAGE;
}

export function artistMatchesLanguages(
  artistName: string,
  selected: Set<ArtistLanguage>
): boolean {
  if (selected.size === 0) return false;
  return selected.has(getArtistLanguage(artistName));
}
