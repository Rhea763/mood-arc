export interface LyricLine {
  time: number;
  text: string;
}

/** Parse simple LRC text into timed lines (seconds). */
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const raw of lrc.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const match = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/.exec(line);
    if (!match) continue;
    const mins = Number(match[1]);
    const secs = Number(match[2]);
    const ms = match[3] ? Number(match[3].padEnd(3, "0").slice(0, 3)) : 0;
    const text = match[4]?.trim() ?? "";
    if (!text) continue;
    lines.push({ time: mins * 60 + secs + ms / 1000, text });
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function lyricAtTime(lines: LyricLine[], currentTime: number): string {
  if (lines.length === 0) return "";
  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.time <= currentTime) idx = i;
    else break;
  }
  return lines[idx]?.text ?? "";
}
