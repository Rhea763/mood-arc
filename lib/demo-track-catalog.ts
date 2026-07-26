import type { LyricFocus } from "@/lib/lyric-focus";
import type { VocalTimbre } from "@/lib/vocal-timbre";
import {
  getTrackProfile,
  recommendationNoteFromProfile,
  scoringTagsFromProfile,
} from "@/lib/track-profiles";

export type DemoArtist =
  | "Taylor Swift"
  | "Ariana Grande"
  | "Lana Del Rey"
  | "Olivia Rodrigo"
  | "Sabrina Carpenter"
  | "Charli XCX"
  | "Gracie Abrams"
  | "SZA"
  | "Adele"
  | "周杰伦"
  | "刘若英"
  | "毛不易"
  | "Beyond"
  | "Clairo"
  | "Billie Eilish"
  | "Lorde"
  | "Chappell Roan"
  | "Conan Gray"
  | "Phoebe Bridgers"
  | "Frank Ocean";

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

const RAW_DEMO_TRACKS: DemoTrack[] = [
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
  { title: "Lavender Haze", artist: "Taylor Swift", energy: 0.6, valence: 0.65, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.7, vocalTimbre: "ethereal_float", note: "恋爱泡泡里隔绝外界，保护式亲密", tags: ["romance","intimacy","settle"] },
  { title: "Midnight Rain", artist: "Taylor Swift", energy: 0.52, valence: 0.35, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "野心与爱情岔路口的安静遗憾", tags: ["regret","bittersweet","solace"] },
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
  { title: "Cinnamon Girl", artist: "Lana Del Rey", energy: 0.48, valence: 0.3, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.45, vocalTimbre: "breathy_hushed", note: "脆弱依恋，害怕受伤的温柔", tags: ["romance","melancholy","solace"] },
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
  { title: "Risk", artist: "Gracie Abrams", energy: 0.68, valence: 0.55, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "ethereal_float", note: "冲动暗恋，明知危险仍想靠近", tags: ["romance","crush","uptempo"] },
  { title: "I love you, I'm sorry", artist: "Gracie Abrams", energy: 0.45, valence: 0.25, phaseFit: "climax", lyricFocus: "grief", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "从低语到爆发，愧疚与遗憾达到顶点", tags: ["heartbreak","romance","revival","hope"] },
  { title: "Kill Bill", artist: "SZA", energy: 0.55, valence: 0.35, phaseFit: "chorus", lyricFocus: "anger", lyricDirectness: 0.85, vocalTimbre: "cool_sharp", note: "冷静 R&B groove 包裹愤怒与依恋", tags: ["post_breakup","resentment","diversion","anger"] },
  { title: "Snooze", artist: "SZA", energy: 0.55, valence: 0.68, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.78, vocalTimbre: "soft_warm", note: "温柔 R&B，亲密依恋与安全感", tags: ["love","intimacy","solace","romance"] },
  { title: "Lover", artist: "Taylor Swift", energy: 0.38, valence: 0.82, phaseFit: "chorus", lyricFocus: "hope", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "温暖浪漫，安全感与亲密承诺", tags: ["romance","commitment","celebrate","settle"] },
  { title: "Someone Like You", artist: "Adele", energy: 0.32, valence: 0.18, phaseFit: "climax", lyricFocus: "grief", lyricDirectness: 0.9, vocalTimbre: "power_belt", note: "钢琴 ballad，体面告别中的深层心碎", tags: ["heartbreak","grief","solace"] },
  { title: "晴天", artist: "周杰伦", energy: 0.58, valence: 0.45, phaseFit: "bridge", lyricFocus: "nostalgia", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "校园青春怀旧，bittersweet 回忆", tags: ["nostalgia","youth","bittersweet","solace"] },
  { title: "后来", artist: "刘若英", energy: 0.45, valence: 0.25, phaseFit: "climax", lyricFocus: "grief", lyricDirectness: 0.88, vocalTimbre: "soft_warm", note: "成熟遗憾与失去后的痛哭释放", tags: ["heartbreak","regret","solace"] },
  { title: "消愁", artist: "毛不易", energy: 0.38, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "成年孤独与疲惫，诗意安慰", tags: ["loneliness","solace","settle"] },
  { title: "稻香", artist: "周杰伦", energy: 0.62, valence: 0.88, phaseFit: "chorus", lyricFocus: "hope", lyricDirectness: 0.82, vocalTimbre: "soft_warm", note: "童年怀旧与治愈感", tags: ["healing","comfort","revival","settle"] },
  { title: "海阔天空", artist: "Beyond", energy: 0.82, valence: 0.75, phaseFit: "climax", lyricFocus: "defiance", lyricDirectness: 0.88, vocalTimbre: "power_belt", note: "自由与不屈，集体共鸣式力量", tags: ["freedom","revival","energy","liberation"] },
  { title: "Bags", artist: "Clairo", energy: 0.45, valence: 0.4, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.6, vocalTimbre: "breathy_hushed", note: "卧室流行，暗恋里的焦虑与犹豫", tags: ["crush","insecurity","solace"] },
  { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", energy: 0.65, valence: 0.6, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Devoted Attachment / Fear of Loss", tags: ["bittersweet","solace"] },
  { title: "WILDFLOWER", artist: "Billie Eilish", energy: 0.42, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Guilt / Lingering Comparison", tags: ["heartbreak","solace"] },
  { title: "LUNCH", artist: "Billie Eilish", energy: 0.72, valence: 0.75, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Flirtatious Infatuation", tags: ["romance","uptempo"] },
  { title: "CHIHIRO", artist: "Billie Eilish", energy: 0.58, valence: 0.35, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.4, vocalTimbre: "soft_warm", note: "Identity Loss / Ethereal Longing", tags: ["bittersweet","solace"] },
  { title: "happier than ever", artist: "Billie Eilish", energy: 0.7, valence: 0.3, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Cathartic Indignation / Freedom", tags: ["heartbreak","solace"] },
  { title: "us.", artist: "Gracie Abrams", energy: 0.55, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Bittersweet Wondering / Lingering Connec", tags: ["bittersweet","solace"] },
  { title: "21", artist: "Gracie Abrams", energy: 0.52, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Restless Longing / Nostalgic Guilt", tags: ["heartbreak","solace"] },
  { title: "Feelslike", artist: "Gracie Abrams", energy: 0.5, valence: 0.65, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Comforting Intimacy", tags: ["bittersweet","solace"] },
  { title: "gold rush", artist: "Taylor Swift", energy: 0.68, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Daydreaming Jealousy / Self-Protection", tags: ["bittersweet","solace"] },
  { title: "my tears ricochet", artist: "Taylor Swift", energy: 0.52, valence: 0.15, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.55, vocalTimbre: "soft_warm", note: "Betrayal Haunting / Mourning", tags: ["heartbreak","solace"] },
  { title: "mirrorball", artist: "Taylor Swift", energy: 0.42, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.5, vocalTimbre: "soft_warm", note: "People-Pleasing Fragility", tags: ["bittersweet","solace"] },
  { title: "seven", artist: "Taylor Swift", energy: 0.38, valence: 0.5, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.45, vocalTimbre: "breathy_hushed", note: "Childhood Nostalgia / Pure Empathy", tags: ["bittersweet","solace"] },
  { title: "this is me trying", artist: "Taylor Swift", energy: 0.35, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "breathy_hushed", note: "Vulnerable Effort / Regret", tags: ["heartbreak","solace"] },
  { title: "Say Yes to Heaven", artist: "Lana Del Rey", energy: 0.38, valence: 0.55, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.5, vocalTimbre: "breathy_hushed", note: "Serene Surrender / Devotion", tags: ["bittersweet","solace"] },
  { title: "Norman fucking Rockwell", artist: "Lana Del Rey", energy: 0.4, valence: 0.4, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Affectionate Frustration / Cynicism", tags: ["bittersweet","solace"] },
  { title: "West Coast", artist: "Lana Del Rey", energy: 0.58, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.45, vocalTimbre: "soft_warm", note: "Hypnotic Passion / Sensual Shift", tags: ["bittersweet","solace"] },
  { title: "Brooklyn Baby", artist: "Lana Del Rey", energy: 0.5, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Satirical Hipster Pride", tags: ["bittersweet","solace"] },
  { title: "Green Light", artist: "Lorde", energy: 0.82, valence: 0.55, phaseFit: "climax", lyricFocus: "reflection", lyricDirectness: 0.75, vocalTimbre: "power_belt", note: "Anticipatory Release / Heartbreak Breakt", tags: ["bittersweet","solace"] },
  { title: "Supercut", artist: "Lorde", energy: 0.78, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.65, vocalTimbre: "power_belt", note: "Idealized Memory / Desperate Reliving", tags: ["bittersweet","solace"] },
  { title: "Ribs", artist: "Lorde", energy: 0.65, valence: 0.35, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Fear of Growing Up / Nostalgic Panic", tags: ["bittersweet","solace"] },
  { title: "Liability", artist: "Lorde", energy: 0.28, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "Self-Soothing Isolation", tags: ["heartbreak","solace"] },
  { title: "Solar Power", artist: "Lorde", energy: 0.58, valence: 0.8, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Carefree Warmth / Relief", tags: ["bittersweet","solace"] },
  { title: "Royals", artist: "Lorde", energy: 0.55, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Detached Youth Pride / Anti-Materialism", tags: ["bittersweet","solace"] },
  { title: "Good Luck, Babe!", artist: "Chappell Roan", energy: 0.82, valence: 0.45, phaseFit: "climax", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Compulsory Heterosexuality / Bitter Prop", tags: ["bittersweet","solace"] },
  { title: "HOT TO GO!", artist: "Chappell Roan", energy: 0.9, valence: 0.9, phaseFit: "climax", lyricFocus: "flirt", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Playful Desire / High-Energy Cheer", tags: ["romance","uptempo"] },
  { title: "Pink Pony Club", artist: "Chappell Roan", energy: 0.8, valence: 0.75, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "power_belt", note: "Queer Liberation / Self-Actualization", tags: ["romance","uptempo"] },
  { title: "Casual", artist: "Chappell Roan", energy: 0.58, valence: 0.25, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "soft_warm", note: "Situationship Frustration / Indignation", tags: ["heartbreak","solace"] },
  { title: "Girl, so confusing", artist: "Charli XCX", energy: 0.72, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Female Rivalry / Vulnerable Ambivalence", tags: ["bittersweet","solace"] },
  { title: "The Tortured Poets Department", artist: "Taylor Swift", energy: 0.55, valence: 0.4, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Self-Aware Melodrama / Chaotic Intimacy", tags: ["bittersweet","solace"] },
  { title: "Down Bad", artist: "Taylor Swift", energy: 0.62, valence: 0.3, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Alienation / Post-Breakup Lethargy", tags: ["heartbreak","solace"] },
  { title: "I Can Do It With a Broken Heart", artist: "Taylor Swift", energy: 0.85, valence: 0.35, phaseFit: "climax", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "power_belt", note: "Forced Professionalism / Dissociative Re", tags: ["bittersweet","solace"] },
  { title: "Guilty as Sin?", artist: "Taylor Swift", energy: 0.6, valence: 0.5, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Unchaste Daydreaming / Emotional Infidel", tags: ["bittersweet","solace"] },
  { title: "The Smallest Man Who Ever Lived", artist: "Taylor Swift", energy: 0.65, valence: 0.15, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Cathartic Scorn / Betrayal Reckoning", tags: ["heartbreak","solace"] },
  { title: "what was I made for?", artist: "Billie Eilish", energy: 0.25, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.7, vocalTimbre: "breathy_hushed", note: "Existential Purpose / Emotional Numbness", tags: ["heartbreak","solace"] },
  { title: "TV", artist: "Billie Eilish", energy: 0.35, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "Depressive Isolation / Media Distraction", tags: ["heartbreak","solace"] },
  { title: "ocean eyes", artist: "Billie Eilish", energy: 0.3, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.55, vocalTimbre: "breathy_hushed", note: "Hypnotic Vulnerability / Infatuation", tags: ["bittersweet","solace"] },
  { title: "everything i wanted", artist: "Billie Eilish", energy: 0.4, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Nightmarish Fame / Sibling Protection", tags: ["heartbreak","solace"] },
  { title: "Heather", artist: "Conan Gray", energy: 0.42, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Insecure Envy / Unrequited Love", tags: ["heartbreak","solace"] },
  { title: "Maniac", artist: "Conan Gray", energy: 0.78, valence: 0.5, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Exposing Ex's Hypocrisy / Upbeat Scorn", tags: ["bittersweet","solace"] },
  { title: "Memories", artist: "Conan Gray", energy: 0.55, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Desperate Boundaries / Lingering Trauma", tags: ["heartbreak","solace"] },
  { title: "People Watching", artist: "Conan Gray", energy: 0.6, valence: 0.35, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Vicarious Romance / Fear of Intimacy", tags: ["bittersweet","solace"] },
  { title: "Glitch", artist: "Taylor Swift", energy: 0.52, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Accidental Romance / Playful Confusion", tags: ["bittersweet","solace"] },
  { title: "Maroon", artist: "Taylor Swift", energy: 0.55, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Mature Heartbreak / Visceral Memories", tags: ["heartbreak","solace"] },
  { title: "You're On Your Own, Kid", artist: "Taylor Swift", energy: 0.65, valence: 0.5, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Bittersweet Growth / Self-Reliance", tags: ["bittersweet","solace"] },
  { title: "Motion Sickness", artist: "Phoebe Bridgers", energy: 0.62, valence: 0.35, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Resentful Clarity / Emotional Manipulati", tags: ["bittersweet","solace"] },
  { title: "Kyoto", artist: "Phoebe Bridgers", energy: 0.75, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Complex Paternal Resentment / Imposter S", tags: ["bittersweet","solace"] },
  { title: "I Know the End", artist: "Phoebe Bridgers", energy: 0.7, valence: 0.2, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Apocalyptic Catharsis / Exhaustion", tags: ["heartbreak","solace"] },
  { title: "Savior Complex", artist: "Phoebe Bridgers", energy: 0.3, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.6, vocalTimbre: "breathy_hushed", note: "Co-dependency / Exhausting Empathy", tags: ["heartbreak","solace"] },
  { title: "Lost", artist: "Frank Ocean", energy: 0.68, valence: 0.65, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Naïve Complicity / Tragic Romance", tags: ["bittersweet","solace"] },
  { title: "Thinkin Bout You", artist: "Frank Ocean", energy: 0.42, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Vulnerable Denial / Unrequited Longing", tags: ["bittersweet","solace"] },
  { title: "Nights", artist: "Frank Ocean", energy: 0.65, valence: 0.5, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Dual Life / Nostalgic Transition", tags: ["bittersweet","solace"] },
  { title: "Chanel", artist: "Frank Ocean", energy: 0.55, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Duality Confidence / Fluid Identity", tags: ["bittersweet","solace"] },
  { title: "Ivy", artist: "Frank Ocean", energy: 0.48, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Youthful Innocence / Nostalgic Heartbrea", tags: ["bittersweet","solace"] },
  { title: "Self Control", artist: "Frank Ocean", energy: 0.35, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "breathy_hushed", note: "Bittersweet Acceptance / Lingering Devot", tags: ["heartbreak","solace"] },
  { title: "Exile", artist: "Taylor Swift", energy: 0.45, valence: 0.15, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Miscommunication / Post-Breakup Alienati", tags: ["heartbreak","solace"] },
  { title: "Getaway Car", artist: "Taylor Swift", energy: 0.82, valence: 0.4, phaseFit: "climax", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "power_belt", note: "Inevitable Betrayal / Rebound Guilt", tags: ["bittersweet","solace"] },
  { title: "A&W", artist: "Lana Del Rey", energy: 0.52, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Societal Judgment / Internalized Trauma", tags: ["heartbreak","solace"] },
  { title: "Did you know that there's a tunnel under Ocean Blvd", artist: "Lana Del Rey", energy: 0.35, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.55, vocalTimbre: "breathy_hushed", note: "Fear of Being Forgotten / Vulnerable Lon", tags: ["heartbreak","solace"] },
  { title: "Venice Bitch", artist: "Lana Del Rey", energy: 0.4, valence: 0.6, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.4, vocalTimbre: "soft_warm", note: "Psychedelic Domesticity / Driftless Roma", tags: ["bittersweet","solace"] },
  { title: "Mariners Apartment Complex", artist: "Lana Del Rey", energy: 0.48, valence: 0.55, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Reassuring Guidance / Protective Strengt", tags: ["bittersweet","solace"] },
  { title: "Good Days", artist: "SZA", energy: 0.55, valence: 0.7, phaseFit: "verse", lyricFocus: "flirt", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Inner Peace Pursuit / Optimistic Healing", tags: ["bittersweet","solace"] },
  { title: "I Hate U", artist: "SZA", energy: 0.58, valence: 0.25, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Conflicted Resentment / Toxic Attachment", tags: ["heartbreak","solace"] },
  { title: "Saturn", artist: "SZA", energy: 0.6, valence: 0.35, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Existential Weariness / Escape Fantasy", tags: ["bittersweet","solace"] },
  { title: "Special", artist: "SZA", energy: 0.38, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "Insecurity / Loss of Self-Worth", tags: ["heartbreak","solace"] },
  { title: "Supermodel", artist: "SZA", energy: 0.45, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "soft_warm", note: "Raw Insecurity / Revenge Seeking", tags: ["heartbreak","solace"] },
  { title: "Normal Girl", artist: "SZA", energy: 0.5, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Desire for Conformity / Self-Doubt", tags: ["bittersweet","solace"] },
  { title: "Red", artist: "Taylor Swift", energy: 0.82, valence: 0.65, phaseFit: "climax", lyricFocus: "reflection", lyricDirectness: 0.7, vocalTimbre: "power_belt", note: "Intense Passion / Vivid Reminiscing", tags: ["bittersweet","solace"] },
  { title: "Begin Again", artist: "Taylor Swift", energy: 0.45, valence: 0.75, phaseFit: "verse", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Cautious Hope / Gentle Rebirth", tags: ["bittersweet","solace"] },
  { title: "State of Grace", artist: "Taylor Swift", energy: 0.78, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.6, vocalTimbre: "power_belt", note: "Ethereal Optimism / Vulnerable Commitmen", tags: ["bittersweet","solace"] },
  { title: "I Almost Do", artist: "Taylor Swift", energy: 0.4, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Restrained Impulse / Lingering Yearning", tags: ["heartbreak","solace"] },
  { title: "Holy Ground", artist: "Taylor Swift", energy: 0.85, valence: 0.8, phaseFit: "climax", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "power_belt", note: "Grateful Nostalgia / Upbeat Closure", tags: ["romance","uptempo"] },
  { title: "Astronomy", artist: "Conan Gray", energy: 0.38, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "breathy_hushed", note: "Slow Drift / Inevitable Estrangement", tags: ["heartbreak","solace"] },
  { title: "The Story", artist: "Conan Gray", energy: 0.4, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Youth Survival / Quiet Resilience", tags: ["bittersweet","solace"] },
  { title: "Wish You Were Sober", artist: "Conan Gray", energy: 0.75, valence: 0.4, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Party Chaos / Desired Authenticity", tags: ["bittersweet","solace"] },
  { title: "Overdrive", artist: "Conan Gray", energy: 0.8, valence: 0.78, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "power_belt", note: "Escapist Romance / Impulsive Joy", tags: ["romance","uptempo"] },
  { title: "Garden Song", artist: "Phoebe Bridgers", energy: 0.3, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.45, vocalTimbre: "breathy_hushed", note: "Surreal Growth / Quiet Acceptance", tags: ["bittersweet","solace"] },
  { title: "Chinese Satellite", artist: "Phoebe Bridgers", energy: 0.55, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Faithlessness / Search for Meaning", tags: ["heartbreak","solace"] },
  { title: "Punisher", artist: "Phoebe Bridgers", energy: 0.25, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.55, vocalTimbre: "breathy_hushed", note: "Quiet Idolization / Fear of Intrusion", tags: ["heartbreak","solace"] },
  { title: "Red Wine Supernova", artist: "Chappell Roan", energy: 0.85, valence: 0.85, phaseFit: "climax", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "power_belt", note: "Playful Queer Lust / Exuberant Fantasy", tags: ["romance","uptempo"] },
  { title: "My Kink Is Karma", artist: "Chappell Roan", energy: 0.82, valence: 0.65, phaseFit: "climax", lyricFocus: "reflection", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Vindictive Satisfaction / High-Energy Sc", tags: ["bittersweet","solace"] },
  { title: "Femininomenon", artist: "Chappell Roan", energy: 0.88, valence: 0.75, phaseFit: "climax", lyricFocus: "flirt", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Female Empowerment / Sarcastic Disillusi", tags: ["romance","uptempo"] },
  { title: "all-american bitch", artist: "Olivia Rodrigo", energy: 0.82, valence: 0.4, phaseFit: "climax", lyricFocus: "longing", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Repressed Rage / Perfection Expectations", tags: ["bittersweet","solace"] },
  { title: "lacy", artist: "Olivia Rodrigo", energy: 0.35, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "breathy_hushed", note: "Obsessive Envy / Complex Idealization", tags: ["heartbreak","solace"] },
  { title: "logical", artist: "Olivia Rodrigo", energy: 0.5, valence: 0.18, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Manipulation Disillusion / Regretful Rea", tags: ["heartbreak","solace"] },
  { title: "making the bed", artist: "Olivia Rodrigo", energy: 0.42, valence: 0.22, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Self-Induced Isolation / Fame Dissatisfa", tags: ["heartbreak","solace"] },
  { title: "scared of my guitar", artist: "Olivia Rodrigo", energy: 0.3, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "breathy_hushed", note: "Fear of Vulnerability / Self-Deception", tags: ["heartbreak","solace"] },
  { title: "so american", artist: "Olivia Rodrigo", energy: 0.8, valence: 0.85, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "power_belt", note: "Helpless Infatuation / Unabashed Joy", tags: ["romance","uptempo"] },
  { title: "obsessed", artist: "Olivia Rodrigo", energy: 0.82, valence: 0.35, phaseFit: "climax", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Ex-Partner Jealousy / Paranoia", tags: ["bittersweet","solace"] },
  { title: "stranger", artist: "Olivia Rodrigo", energy: 0.48, valence: 0.7, phaseFit: "verse", lyricFocus: "flirt", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Peaceful Closure / Healing Recovery", tags: ["bittersweet","solace"] },
  { title: "Who's Afraid of Little Old Me?", artist: "Taylor Swift", energy: 0.78, valence: 0.25, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Defiant Rage / Villain Origin", tags: ["heartbreak","solace"] },
  { title: "Florida!!!", artist: "Taylor Swift", energy: 0.82, valence: 0.5, phaseFit: "climax", lyricFocus: "longing", lyricDirectness: 0.7, vocalTimbre: "power_belt", note: "Wild Escapism / Cathartic Release", tags: ["bittersweet","solace"] },
  { title: "Clara Bow", artist: "Taylor Swift", energy: 0.48, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Cyclical Fame / Generational Replacement", tags: ["bittersweet","solace"] },
  { title: "The Black Dog", artist: "Taylor Swift", energy: 0.62, valence: 0.18, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Post-Breakup Obsession / Visceral Betray", tags: ["heartbreak","solace"] },
  { title: "Taste", artist: "Sabrina Carpenter", energy: 0.8, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.85, vocalTimbre: "power_belt", note: "Petty Triumph / Lingering Presence", tags: ["bittersweet","solace"] },
  { title: "Because I Liked a Boy", artist: "Sabrina Carpenter", energy: 0.58, valence: 0.3, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.9, vocalTimbre: "soft_warm", note: "Public Scrutiny / Unfair Condemnation", tags: ["heartbreak","solace"] },
  { title: "Skinny Dipping", artist: "Sabrina Carpenter", energy: 0.55, valence: 0.55, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Awkward Encounter / Conversational Closu", tags: ["bittersweet","solace"] },
  { title: "Fast Times", artist: "Sabrina Carpenter", energy: 0.7, valence: 0.75, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Impulsive Attraction / Cool Confidence", tags: ["romance","uptempo"] },
  { title: "Ride", artist: "Lana Del Rey", energy: 0.52, valence: 0.4, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.55, vocalTimbre: "soft_warm", note: "Existential Drift / Restless Freedom", tags: ["bittersweet","solace"] },
  { title: "Ultraviolence", artist: "Lana Del Rey", energy: 0.45, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.5, vocalTimbre: "soft_warm", note: "Toxic Devotion / Dark Dependence", tags: ["heartbreak","solace"] },
  { title: "Shades of Cool", artist: "Lana Del Rey", energy: 0.58, valence: 0.3, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.45, vocalTimbre: "soft_warm", note: "Unattainable Partner / Melancholic Dista", tags: ["heartbreak","solace"] },
  { title: "High by the Beach", artist: "Lana Del Rey", energy: 0.55, valence: 0.45, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Apathetic Dismissal / Need for Solitude", tags: ["bittersweet","solace"] },
  { title: "Lust for Life", artist: "Lana Del Rey", energy: 0.65, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Romantic Glamour / Youthful Vitality", tags: ["bittersweet","solace"] },
  { title: "The Greatest", artist: "Lana Del Rey", energy: 0.42, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Cultural Weariness / Nostalgic Mourning", tags: ["heartbreak","solace"] },
  { title: "White Dress", artist: "Lana Del Rey", energy: 0.35, valence: 0.4, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.7, vocalTimbre: "breathy_hushed", note: "Pre-Fame Nostalgia / Innocent Passion", tags: ["bittersweet","solace"] },
  { title: "Nobody Gets Me", artist: "SZA", energy: 0.4, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Desperate Regret / Unique Bond Loss", tags: ["heartbreak","solace"] },
  { title: "Shirt", artist: "SZA", energy: 0.65, valence: 0.4, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Chaotic Uncertainty / Emotional Confusio", tags: ["bittersweet","solace"] },
  { title: "Low", artist: "SZA", energy: 0.7, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Guarded Emotions / Discreet Revenge", tags: ["bittersweet","solace"] },
  { title: "Ghost in the Machine", artist: "SZA", energy: 0.52, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Modern Disconnection / Craving Humanity", tags: ["heartbreak","solace"] },
  { title: "BLUE", artist: "Billie Eilish", energy: 0.45, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Cyclical Sadness / Farewell Reflection", tags: ["heartbreak","solace"] },
  { title: "THE GREATEST", artist: "Billie Eilish", energy: 0.65, valence: 0.2, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Unappreciated Sacrifice / Explosive Frus", tags: ["heartbreak","solace"] },
  { title: "L'AMOUR DE MA VIE", artist: "Billie Eilish", energy: 0.75, valence: 0.55, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Post-Breakup Clarity / Sudden Indifferen", tags: ["bittersweet","solace"] },
  { title: "Bejeweled", artist: "Taylor Swift", energy: 0.7, valence: 0.8, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Reclaiming Sparkle / Self-Worth Pride", tags: ["romance","uptempo"] },
  { title: "Mastermind", artist: "Taylor Swift", energy: 0.65, valence: 0.65, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Calculated Romance / Vulnerable Admissio", tags: ["bittersweet","solace"] },
  { title: "The Alchemy", artist: "Taylor Swift", energy: 0.72, valence: 0.75, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Triumphant Reunion / Chemical Attraction", tags: ["romance","uptempo"] },
  { title: "I Can See You", artist: "Taylor Swift", energy: 0.75, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Secret Desire / Stealthy Attraction", tags: ["bittersweet","solace"] },
  { title: "Super Rich Kids", artist: "Frank Ocean", energy: 0.5, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Apathetic Privilege / Wealthy Emptiness", tags: ["bittersweet","solace"] },
  { title: "Pyramids", artist: "Frank Ocean", energy: 0.72, valence: 0.45, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.5, vocalTimbre: "soft_warm", note: "Mythic Tragedy / Modern Struggle", tags: ["bittersweet","solace"] },
  { title: "Bad Religion", artist: "Frank Ocean", energy: 0.4, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Unrequited Devotion / Taxi Confession", tags: ["heartbreak","solace"] },
  { title: "Pink + White", artist: "Frank Ocean", energy: 0.55, valence: 0.65, phaseFit: "verse", lyricFocus: "reflection", lyricDirectness: 0.6, vocalTimbre: "soft_warm", note: "Nostalgic Acceptance / Bittersweet Grati", tags: ["bittersweet","solace"] },
  { title: "Seigfried", artist: "Frank Ocean", energy: 0.28, valence: 0.2, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.45, vocalTimbre: "breathy_hushed", note: "Existential Doubt / Non-Conformity Anxie", tags: ["heartbreak","solace"] },
  { title: "Blowing Smoke", artist: "Gracie Abrams", energy: 0.58, valence: 0.3, phaseFit: "chorus", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Lingering Jealousy / Bitter Comparison", tags: ["heartbreak","solace"] },
  { title: "Tough Love", artist: "Gracie Abrams", energy: 0.62, valence: 0.6, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Independence Pursuit / Friendship Priori", tags: ["bittersweet","solace"] },
  { title: "Normal Thing", artist: "Gracie Abrams", energy: 0.4, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Unrealistic Projection / Idolized Crush", tags: ["bittersweet","solace"] },
  { title: "Gave You I Gave You I", artist: "Gracie Abrams", energy: 0.52, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Asymmetric Effort / Exhausted Heartbreak", tags: ["heartbreak","solace"] },
  { title: "Full Machine", artist: "Gracie Abrams", energy: 0.45, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Co-dependent Dependence / Fragile Stabil", tags: ["heartbreak","solace"] },
  { title: "Sober II (Melodrama)", artist: "Lorde", energy: 0.48, valence: 0.25, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Post-Party Reckoning / Clean-up Melancho", tags: ["heartbreak","solace"] },
  { title: "The Louvreness", artist: "Lorde", energy: 0.6, valence: 0.65, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "Obsessive Infatuation / Grandiose Love", tags: ["bittersweet","solace"] },
  { title: "Homemade Dynamite", artist: "Lorde", energy: 0.75, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.75, vocalTimbre: "soft_warm", note: "Reckless Euphoria / Party Connection", tags: ["bittersweet","solace"] },
  { title: "Writer in the Dark", artist: "Lorde", energy: 0.42, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.8, vocalTimbre: "soft_warm", note: "Unapologetic Survival / Cathartic Creati", tags: ["heartbreak","solace"] },
  { title: "Stoned at the Nail Salon", artist: "Lorde", energy: 0.28, valence: 0.35, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "breathy_hushed", note: "Aging Disillusion / Quiet Contemplation", tags: ["bittersweet","solace"] },
  { title: "Sexy To Someone", artist: "Clairo", energy: 0.62, valence: 0.65, phaseFit: "chorus", lyricFocus: "reflection", lyricDirectness: 0.85, vocalTimbre: "soft_warm", note: "Desire for Validation / Casual Yearning", tags: ["bittersweet","solace"] },
  { title: "Nomad", artist: "Clairo", energy: 0.38, valence: 0.3, phaseFit: "verse", lyricFocus: "introspection", lyricDirectness: 0.75, vocalTimbre: "breathy_hushed", note: "Self-Protective Isolation / Fear of Reje", tags: ["heartbreak","solace"] },
  { title: "Juna", artist: "Clairo", energy: 0.45, valence: 0.75, phaseFit: "verse", lyricFocus: "flirt", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Effortless Attraction / Soft Surrender", tags: ["bittersweet","solace"] },
  { title: "4EVER", artist: "Clairo", energy: 0.65, valence: 0.7, phaseFit: "chorus", lyricFocus: "flirt", lyricDirectness: 0.7, vocalTimbre: "soft_warm", note: "Youthful Uncertainty / Casual Romance", tags: ["bittersweet","solace"] },
  { title: "Flaming Hot Cheetos", artist: "Clairo", energy: 0.35, valence: 0.4, phaseFit: "verse", lyricFocus: "longing", lyricDirectness: 0.75, vocalTimbre: "breathy_hushed", note: "Insecure Hesitation / Awkward Crush", tags: ["bittersweet","solace"] },
  { title: "Sofia", artist: "Clairo", energy: 0.62, valence: 0.7, phaseFit: "chorus", lyricFocus: "longing", lyricDirectness: 0.65, vocalTimbre: "soft_warm", note: "温柔 longing，轻柔 indie 浪漫", tags: ["romance","nostalgia","settle"] },
];

function withProfile(track: DemoTrack): DemoTrack {
  const profile = getTrackProfile(track.title, track.artist);
  if (!profile) return track;
  return {
    ...track,
    energy: profile.energy,
    valence: profile.valence,
    lyricDirectness: profile.lyricDirectness,
    tags: scoringTagsFromProfile(profile),
    note: recommendationNoteFromProfile(profile),
  };
}

export const DEMO_TRACKS: DemoTrack[] = RAW_DEMO_TRACKS.map(withProfile);

export function getTrackByTitle(title: string): DemoTrack | undefined {
  return DEMO_TRACKS.find((t) => t.title === title);
}
