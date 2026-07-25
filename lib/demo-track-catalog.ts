import type { LyricFocus } from "@/lib/lyric-focus";
import type { VocalTimbre } from "@/lib/vocal-timbre";

export type DemoArtist =
  | "Taylor Swift"
  | "Ariana Grande"
  | "Lana Del Rey"
  | "Olivia Rodrigo"
  | "Sabrina Carpenter"
  | "Charli XCX"
  | "Gracie Abrams";

export type SongPhaseFit = "verse" | "chorus" | "bridge" | "climax";

export interface DemoTrack {
  title: string;
  artist: DemoArtist;
  energy: number;
  valence: number;
  phaseFit: SongPhaseFit;
  lyricFocus: LyricFocus;
  lyricDirectness: number;
  vocalTimbre: VocalTimbre;
  note: string;
  tags: string[];
}

export const DEMO_TRACKS: DemoTrack[] = [
  { title: "All Too Well", artist: "Taylor Swift", energy: 0.45, valence: 0.25, phaseFit: "climax", lyricFocus: "grief", lyricDirectness: 0.9, vocalTimbre: "soft_warm", note: "中速层层递进，细节化失恋叙事与强烈心碎回忆", tags: ["heartbreak","romance","solace","bittersweet"] },
  { title: "cardigan", artist: "Taylor Swift", energy: 0.3, valence: 0.3, phaseFit: "verse", lyricFocus: "nostalgia", lyricDirectness: 0.55, vocalTimbre: "breathy_hushed", note: "慢速留白，柔和复古氛围包裹旧爱与青春回忆", tags: ["heartbreak","romance","solace","settle"] },
  { title: "champagne problems", artist: "Taylor Swift", energy: 0.2, valence: 0.25, phaseFit: "verse", lyricFocus: "grief", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "钢琴极简推进，破碎关系与遗憾感极强", tags: ["heartbreak","romance","solace","bittersweet","party_contrast"] },
  { title: "wildest dreams", artist: "Taylor Swift", energy: 0.45, valence: 0.5, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.6, vocalTimbre: "clear_bright", note: "电影感中速推进，浪漫回忆中带离别不安", tags: ["romance","settle","solace","bittersweet"] },
  { title: "Shake It Off", artist: "Taylor Swift", energy: 0.85, valence: 0.85, phaseFit: "chorus", lyricFocus: "defiance", lyricDirectness: 0.85, vocalTimbre: "playful_bounce", note: "高能流行律动，直接甩开批评与外界评价", tags: ["uptempo","diversion","party","liberation"] },
  { title: "Anti-Hero", artist: "Taylor Swift", energy: 0.65, valence: 0.45, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "clear_bright", note: "合成器律动明显，外放旋律下是自我怀疑", tags: ["bittersweet","revival","uptempo"] },
  { title: "Blank Space", artist: "Taylor Swift", energy: 0.7, valence: 0.65, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "theatrical_bold", note: "戏剧化流行节奏，危险暧昧与自嘲人设", tags: ["heartbreak","anger","romance","uptempo"] },
  { title: "Love Story", artist: "Taylor Swift", energy: 0.75, valence: 0.85, phaseFit: "chorus", lyricFocus: "hope", lyricDirectness: 0.75, vocalTimbre: "clear_bright", note: "明亮乡村流行，浪漫叙事与圆满希望感", tags: ["romance","celebrate","hope"] },
  { title: "Cruel Summer", artist: "Taylor Swift", energy: 0.88, valence: 0.55, phaseFit: "bridge", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "高能电音推进，狂热恋情包裹焦虑与渴望", tags: ["romance","bittersweet","uptempo","party"] },
  { title: "Style", artist: "Taylor Swift", energy: 0.8, valence: 0.75, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.65, vocalTimbre: "cool_sharp", note: "Funk吉他驱动，暗夜感暧昧与拉扯", tags: ["uptempo","confidence","party","romance"] },
  { title: "Look What You Made Me Do", artist: "Taylor Swift", energy: 0.75, valence: 0.3, phaseFit: "chorus", lyricFocus: "anger", lyricDirectness: 0.9, vocalTimbre: "cool_sharp", note: "暗黑压迫编曲，攻击性复仇宣言", tags: ["anger","uptempo","liberation"] },
  { title: "vigilante shit", artist: "Taylor Swift", energy: 0.5, valence: 0.35, phaseFit: "verse", lyricFocus: "anger", lyricDirectness: 0.85, vocalTimbre: "cool_sharp", note: "低音极简律动，冷酷复仇气质明显", tags: ["anger","uptempo","liberation"] },
  { title: "right where you left me", artist: "Taylor Swift", energy: 0.55, valence: 0.25, phaseFit: "chorus", lyricFocus: "grief", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "快速拨弦包裹停滞感，困在失恋瞬间", tags: ["heartbreak","romance","solace","loneliness"] },
  { title: "marjorie", artist: "Taylor Swift", energy: 0.15, valence: 0.35, phaseFit: "verse", lyricFocus: "grief", lyricDirectness: 0.5, vocalTimbre: "breathy_hushed", note: "极慢氛围，悼念亲人与温柔遗憾", tags: ["solace","settle","grief"] },
  { title: "the 1", artist: "Taylor Swift", energy: 0.4, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "轻盈钢琴，平静回望错过的关系", tags: ["heartbreak","romance","bittersweet"] },
  { title: "august", artist: "Taylor Swift", energy: 0.5, valence: 0.55, phaseFit: "bridge", lyricFocus: "nostalgia", lyricDirectness: 0.6, vocalTimbre: "ethereal_float", note: "漂浮感编曲，夏日恋情消逝后的怀旧", tags: ["heartbreak","romance","bittersweet","solace"] },
  { title: "Delicate", artist: "Taylor Swift", energy: 0.5, valence: 0.65, phaseFit: "verse", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "轻柔电子律动，小心翼翼的暧昧甜蜜", tags: ["romance","settle","bittersweet"] },
  { title: "Fortnight", artist: "Taylor Swift", energy: 0.45, valence: 0.3, phaseFit: "verse", lyricFocus: "numbness", lyricDirectness: 0.7, vocalTimbre: "breathy_hushed", note: "低速合成器氛围，疏离麻木的失落感", tags: ["romance","bittersweet","heartbreak"] },
  { title: "So Long, London", artist: "Taylor Swift", energy: 0.4, valence: 0.2, phaseFit: "bridge", lyricFocus: "grief", lyricDirectness: 0.8, vocalTimbre: "breathy_hushed", note: "低沉告别氛围，体面分开背后的悲伤", tags: ["heartbreak","romance","solace"] },
  { title: "Karma", artist: "Taylor Swift", energy: 0.8, valence: 0.85, phaseFit: "chorus", lyricFocus: "defiance", lyricDirectness: 0.75, vocalTimbre: "playful_bounce", note: "跳跃Synth-Pop，自信得意的反击快感", tags: ["revival","uptempo","liberation","party"] },
  { title: "New Romantics", artist: "Taylor Swift", energy: 0.9, valence: 0.8, phaseFit: "chorus", lyricFocus: "defiance", lyricDirectness: 0.65, vocalTimbre: "clear_bright", note: "高能80年代电子感，青春狂欢与自由", tags: ["revival","party","hope","uptempo"] },
  { title: "thank u, next", artist: "Ariana Grande", energy: 0.65, valence: 0.75, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "中速R&B，分手复盘后的成长释然", tags: ["heartbreak","romance","uptempo","party","diversion","liberation","party_contrast"] },
  { title: "positions", artist: "Ariana Grande", energy: 0.65, valence: 0.8, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "轻快R&B律动，恋爱中的甜蜜主动", tags: ["romance","uptempo","party","celebrate"] },
  { title: "7 rings", artist: "Ariana Grande", energy: 0.75, valence: 0.82, phaseFit: "chorus", lyricFocus: "celebration", lyricDirectness: 0.85, vocalTimbre: "clear_bright", note: "Trap低音强烈，自信奢华的享乐氛围", tags: ["uptempo","party","confidence","celebrate"] },
  { title: "Break Free", artist: "Ariana Grande", energy: 0.95, valence: 0.85, phaseFit: "chorus", lyricFocus: "defiance", lyricDirectness: 0.8, vocalTimbre: "power_belt", note: "EDM爆发感强，摆脱束缚后的释放", tags: ["uptempo","party","liberation","energy"] },
  { title: "Popular", artist: "Ariana Grande", energy: 0.6, valence: 0.85, phaseFit: "chorus", lyricFocus: "celebration", lyricDirectness: 0.85, vocalTimbre: "theatrical_bold", note: "戏剧化Pop，俏皮展现社交自信", tags: ["uptempo","party","celebrate","energy"] },
  { title: "we can't be friends", artist: "Ariana Grande", energy: 0.55, valence: 0.4, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.8, vocalTimbre: "breathy_hushed", note: "合成器舞曲感，温柔包装无法继续的遗憾", tags: ["heartbreak","romance","bittersweet","solace"] },
  { title: "Summertime Sadness", artist: "Lana Del Rey", energy: 0.55, valence: 0.25, phaseFit: "chorus", lyricFocus: "grief", lyricDirectness: 0.5, vocalTimbre: "breathy_hushed", note: "迷幻流行推进，盛夏外表下的失落悲伤", tags: ["heartbreak","bittersweet","party_contrast","solace","romance"] },
  { title: "Video Games", artist: "Lana Del Rey", energy: 0.25, valence: 0.35, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.45, vocalTimbre: "breathy_hushed", note: "慢速复古编曲，深沉依恋与脆弱奉献感", tags: ["romance","solace","settle","loneliness"] },
  { title: "Young and Beautiful", artist: "Lana Del Rey", energy: 0.35, valence: 0.4, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.6, vocalTimbre: "ethereal_float", note: "交响氛围缓慢推进，对永恒爱情的忧虑", tags: ["romance","settle","bittersweet"] },
  { title: "Chemtrails Over the Country Club", artist: "Lana Del Rey", energy: 0.3, valence: 0.5, phaseFit: "verse", lyricFocus: "nostalgia", lyricDirectness: 0.35, vocalTimbre: "breathy_hushed", note: "慢速民谣质感，日常意象中的怀旧与疏离", tags: ["settle","solace","bittersweet"] },
  { title: "drivers license", artist: "Olivia Rodrigo", energy: 0.25, valence: 0.2, phaseFit: "bridge", lyricFocus: "grief", lyricDirectness: 0.95, vocalTimbre: "breathy_hushed", note: "慢速钢琴，失恋痛感极强且情绪直白", tags: ["heartbreak","romance","solace","loneliness"] },
  { title: "traitor", artist: "Olivia Rodrigo", energy: 0.35, valence: 0.15, phaseFit: "chorus", lyricFocus: "anger", lyricDirectness: 0.9, vocalTimbre: "soft_warm", note: "吉他铺垫缓慢，背叛后的痛苦控诉", tags: ["heartbreak","romance","anger","solace"] },
  { title: "good 4 u", artist: "Olivia Rodrigo", energy: 0.92, valence: 0.28, phaseFit: "bridge", lyricFocus: "anger", lyricDirectness: 0.95, vocalTimbre: "power_belt", note: "极快高能，愤怒包裹心碎与讽刺", tags: ["anger","uptempo","diversion","party","heartbreak"] },
  { title: "vampire", artist: "Olivia Rodrigo", energy: 0.65, valence: 0.2, phaseFit: "climax", lyricFocus: "anger", lyricDirectness: 0.9, vocalTimbre: "power_belt", note: "由钢琴到摇滚爆发，控诉伤害与愤怒", tags: ["bittersweet","uptempo","heartbreak","party"] },
  { title: "bad idea right?", artist: "Olivia Rodrigo", energy: 0.8, valence: 0.65, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.9, vocalTimbre: "playful_bounce", note: "车库摇滚节奏，冲动纠缠中的幽默矛盾", tags: ["bittersweet","uptempo","romance","diversion"] },
  { title: "get him back!", artist: "Olivia Rodrigo", energy: 0.85, valence: 0.6, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "强烈喊唱律动，复合与报复同时存在", tags: ["anger","uptempo","diversion","party","romance"] },
  { title: "deja vu", artist: "Olivia Rodrigo", energy: 0.6, valence: 0.35, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.85, vocalTimbre: "cool_sharp", note: "迷幻中速编曲，讽刺前任的新关系", tags: ["heartbreak","romance","bittersweet"] },
  { title: "happier", artist: "Olivia Rodrigo", energy: 0.3, valence: 0.25, phaseFit: "verse", lyricFocus: "bittersweet", lyricDirectness: 0.9, vocalTimbre: "breathy_hushed", note: "慢速华尔兹，祝福背后隐藏嫉妒与痛苦", tags: ["heartbreak","romance","bittersweet","solace"] },
  { title: "1 step forward, 3 steps back", artist: "Olivia Rodrigo", energy: 0.2, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "极简钢琴，关系反复中的自我消耗", tags: ["heartbreak","romance","solace"] },
  { title: "enough for you", artist: "Olivia Rodrigo", energy: 0.25, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "breathy_hushed", note: "原声吉他慢唱，讨好与自我否定", tags: ["heartbreak","solace","loneliness"] },
  { title: "Espresso", artist: "Sabrina Carpenter", energy: 0.8, valence: 0.8, phaseFit: "chorus", lyricFocus: "celebration", lyricDirectness: 0.75, vocalTimbre: "clear_bright", note: "Funk Bass律动鲜明，自信甜酷的享乐感", tags: ["uptempo","party","celebrate","flirt","romance"] },
  { title: "Please Please Please", artist: "Sabrina Carpenter", energy: 0.7, valence: 0.6, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.85, vocalTimbre: "clear_bright", note: "复古Pop律动，恋爱期待与不安拉扯", tags: ["romance","uptempo","party","flirt","celebrate"] },
  { title: "Nonsense", artist: "Sabrina Carpenter", energy: 0.75, valence: 0.85, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "playful_bounce", note: "轻快R&B节奏，恋爱中的俏皮调情", tags: ["romance","uptempo","flirt","party"] },
  { title: "Feather", artist: "Sabrina Carpenter", energy: 0.8, valence: 0.85, phaseFit: "chorus", lyricFocus: "defiance", lyricDirectness: 0.8, vocalTimbre: "playful_bounce", note: "Disco律动轻盈，摆脱关系后的自由感", tags: ["uptempo","confidence","party"] },
  { title: "360", artist: "Charli XCX", energy: 0.95, valence: 0.75, phaseFit: "chorus", lyricFocus: "celebration", lyricDirectness: 0.7, vocalTimbre: "clear_bright", note: "高密度电子节拍，派对感与自信爆发", tags: ["uptempo","party","energy","celebrate"] },
  { title: "Von dutch", artist: "Charli XCX", energy: 0.98, valence: 0.7, phaseFit: "climax", lyricFocus: "defiance", lyricDirectness: 0.8, vocalTimbre: "power_belt", note: "Hyperpop高压爆发，嚣张反击与自我炫耀", tags: ["uptempo","party","energy"] },
  { title: "Speed Drive", artist: "Charli XCX", energy: 0.95, valence: 0.8, phaseFit: "chorus", lyricFocus: "celebration", lyricDirectness: 0.75, vocalTimbre: "clear_bright", note: "高速电子推进，纯粹速度感与快乐释放", tags: ["uptempo","party","energy"] },
  { title: "Apple", artist: "Charli XCX", energy: 0.75, valence: 0.6, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "playful_bounce", note: "电子律动明亮，隐藏家庭创伤反思", tags: ["uptempo","party","energy","celebrate"] },
  { title: "I miss you, I'm sorry", artist: "Gracie Abrams", energy: 0.2, valence: 0.2, phaseFit: "verse", lyricFocus: "grief", lyricDirectness: 0.9, vocalTimbre: "breathy_hushed", note: "极慢低语，思念与愧疚交织的心碎", tags: ["heartbreak","romance","solace","loneliness"] },
  { title: "close to you", artist: "Gracie Abrams", energy: 0.55, valence: 0.55, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.8, vocalTimbre: "ethereal_float", note: "流行律动推进，靠近某人的强烈渴望", tags: ["heartbreak","romance","solace"] },
  { title: "that's so true", artist: "Gracie Abrams", energy: 0.65, valence: 0.4, phaseFit: "chorus", lyricFocus: "bittersweet", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "中快节奏包裹嫉妒与酸涩情绪", tags: ["heartbreak","romance","bittersweet"] },
  { title: "I know it won't work", artist: "Gracie Abrams", energy: 0.6, valence: 0.3, phaseFit: "bridge", lyricFocus: "grief", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "逐渐增强编曲，清醒面对无法挽回", tags: ["heartbreak","romance","solace"] },
  { title: "older", artist: "Gracie Abrams", energy: 0.2, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "breathy_hushed", note: "慢速钢琴，成长迷茫与自我困惑", tags: ["solace","settle","bittersweet"] },
  { title: "I love you, I'm sorry", artist: "Gracie Abrams", energy: 0.45, valence: 0.25, phaseFit: "climax", lyricFocus: "grief", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "从低语到爆发，愧疚与遗憾达到顶点", tags: ["heartbreak","romance","revival","hope"] },
];

export function getTrackByTitle(title: string): DemoTrack | undefined {
  return DEMO_TRACKS.find((t) => t.title === title);
}
