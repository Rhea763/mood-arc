export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  genres: string[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  popularity?: number;
  artists: { id: string; name: string }[];
}

export interface TasteArtist {
  id: string;
  name: string;
  uri: string;
  genres: string[];
  source: "top" | "followed" | "both";
}

export interface TasteResponse {
  user: { id: string; name: string };
  artists: TasteArtist[];
}

export interface GenerateRequest {
  mood: string;
  causes?: string[];
  selectedArtistIds: string[];
  selectedArtistNames: string[];
}

export interface GenerateTrack {
  name: string;
  artists: string;
  uri: string;
}

export interface GenerateResponse {
  playlistUrl: string;
  playlistId: string;
  playlistName: string;
  tracks: GenerateTrack[];
}
