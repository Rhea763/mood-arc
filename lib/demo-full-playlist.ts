import { parseLrc, type LyricLine } from "@/lib/parse-lrc";

export interface DemoAudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  lyrics: LyricLine[];
}

export const FULL_DEMO_PLAYLIST_NAME = "完整版示例 · 心绪弧线";

const MARINERS_LRC = parseLrc(`
[00:12.00]You lose your way, just take my hand
[00:28.00]You're lost at sea, but I'll take the wheel
[00:44.00]And yes, I'd say that I'm your friend
[01:00.00]Come take a walk with me
[01:16.00]There's a place where all the walls come down
[01:32.00]They'll tear each other up and call it a night
[01:48.00]Oh, how quiet it is on the other side
[02:04.00]We're just crazy enough to be okay
[02:20.00]Maybe we're not that crazy after all
`);

const TACO_TRUCK_LRC = parseLrc(`
[00:10.00]One last time, I think I'll take the stage
[00:26.00]One last time, I'll see you in the place
[00:42.00]Oh, but don't you know that it's all a game?
[00:58.00]All a game that I play
[01:14.00]I'm a princess cut from marble, smoother than a storm
[01:30.00]And the scars that mark my body, they're silver and gold
[01:46.00]My blood was a fountain that fell from the sky
[02:02.00]But it's alright, I fall in love every night
`);

function placeholderLyrics(label: string): LyricLine[] {
  return [
    { time: 0, text: label },
    { time: 8, text: "来自本机 Music 库的示例音频" },
    { time: 16, text: "点击播放器可暂停 / 切歌" },
    { time: 24, text: "在全站任意页面继续收听" },
  ];
}

export const FULL_DEMO_PLAYLIST: DemoAudioTrack[] = [
  {
    id: "demo-01",
    title: "Mariners Apartment Complex",
    artist: "Lana Del Rey",
    src: "/demo-audio/01-mariners-apartment-complex.mp3",
    cover: "/demo-audio/covers/01-lana.svg",
    lyrics: MARINERS_LRC,
  },
  {
    id: "demo-02",
    title: "Taco Truck x VB",
    artist: "Lana Del Rey",
    src: "/demo-audio/02-taco-truck-x-vb.mp3",
    cover: "/demo-audio/covers/02-lana.svg",
    lyrics: TACO_TRUCK_LRC,
  },
  {
    id: "demo-03",
    title: "本地示例 1",
    artist: "本机收藏",
    src: "/demo-audio/03-local-demo-1.mp3",
    cover: "/demo-audio/covers/03-local.svg",
    lyrics: placeholderLyrics("本地示例 1"),
  },
  {
    id: "demo-04",
    title: "本地示例 2",
    artist: "本机收藏",
    src: "/demo-audio/04-local-demo-2.mp3",
    cover: "/demo-audio/covers/04-local.svg",
    lyrics: placeholderLyrics("本地示例 2"),
  },
  {
    id: "demo-05",
    title: "本地示例 3",
    artist: "本机收藏",
    src: "/demo-audio/05-local-demo-3.mp3",
    cover: "/demo-audio/covers/05-local.svg",
    lyrics: placeholderLyrics("本地示例 3"),
  },
  {
    id: "demo-06",
    title: "本地示例 4",
    artist: "本机收藏",
    src: "/demo-audio/06-local-demo-4.mp3",
    cover: "/demo-audio/covers/06-local.svg",
    lyrics: placeholderLyrics("本地示例 4"),
  },
  {
    id: "demo-07",
    title: "本地示例 5",
    artist: "本机收藏",
    src: "/demo-audio/07-local-demo-5.mp3",
    cover: "/demo-audio/covers/07-local.svg",
    lyrics: placeholderLyrics("本地示例 5"),
  },
  {
    id: "demo-08",
    title: "本地示例 6",
    artist: "本机收藏",
    src: "/demo-audio/08-local-demo-6.mp3",
    cover: "/demo-audio/covers/08-local.svg",
    lyrics: placeholderLyrics("本地示例 6"),
  },
];
