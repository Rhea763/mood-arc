# MoodArc 曲库打标 Prompt（55 首 · 含歌词维度）

将下方 **「用户消息」** 整段复制给 AI（ChatGPT / Claude / Gemini 等）。  
输出应为 **纯 JSON 数组**，可直接保存为 `mood-arc/data/track-scores.json`。

当前仓库已有一份半自动初标（含 `lyricFocus` / `lyricDirectness`），可用本 prompt **复核或覆盖**。

---

## 用户消息（复制起点）

你是音乐情绪标注员，为 MoodArc 歌单弧线引擎标注 **55 首 Western Pop 曲目**。

### 任务

对列表中每一首歌输出一条 JSON 记录。字段含义如下。

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `artist` | string | 艺人名（与列表一致） |
| `title` | string | 曲名（与列表一致） |
| `energy` | number 0–1 | **节奏/律动能量**（BPM、鼓点密度、推进感）。权重约 35% |
| `valence` | number 0–1 | **旋律/听感正负向**（明亮↔暗沉、甜↔苦）。权重约 35%。**不要**把歌词单独算进 valence——歌词用下面两个字段 |
| `phaseFit` | enum | 歌 **本身** 更像哪种段落气质：`verse`（慢/沉/留白）· `chorus`（外放/重复钩子）· `bridge`（转折/张力）· `climax`（爆发/顶点） |
| `lyricFocus` | enum | **歌词主焦点**（词在讲什么）。见下方枚举，**每首只选一个最主要** |
| `lyricDirectness` | number 0–1 | **歌词直给程度**：0 = 隐喻、留白、意象化；1 = 直白崩溃、点名情绪、强叙事 |
| `note` | string | 一句中文：节奏 + 歌词综合听感（≤40 字） |

#### `lyricFocus` 枚举（必选其一）

| 值 | 含义 | 示例倾向 |
|----|------|----------|
| `grief` | 心碎、失去、告别 | drivers license, champagne problems |
| `longing` | 渴望、思念、依恋 | Video Games, Cruel Summer |
| `anger` | 愤怒、背叛、复仇 | good 4 u, traitor |
| `bittersweet` | 酸涩交织、自嘲 | deja vu, that's so true |
| `reflection` | 清醒复盘、成长 | thank u next, the 1 |
| `hope` | 希望、释然、向前 | Love Story |
| `defiance` | 反击、叛逆、甩脱 | Shake It Off, Karma |
| `celebration` | 庆祝、享乐、派对 | Espresso, 360 |
| `flirt` | 暧昧、调情、甜蜜 | Nonsense, Delicate |
| `nostalgia` | 怀旧、回忆 | august, cardigan |
| `numbness` | 麻木、疏离 | Fortnight |
| `introspection` | 内耗、自我怀疑 | Anti-Hero, 1 step forward |

#### 打分原则

1. **节奏与歌词分开想**：`good 4 u` → energy 很高、lyricFocus=`anger`、lyricDirectness 接近 1；不要因为快就把 anger 标成 celebration。
2. **valence 听旋律/编曲**，不是听词义；词义用 `lyricFocus`。
3. `phaseFit` 描述 **单曲结构气质**，不是歌单第几段。
4. 若节奏快但词极痛（如 right where you left me），energy 可中高，lyricFocus 仍可为 `grief`。

### 输出格式

- **仅输出** JSON 数组，无 markdown 代码块、无解释。
- 数组长度必须 **55**，顺序与下方列表一致。
- 每条对象字段：`artist`, `title`, `energy`, `valence`, `phaseFit`, `lyricFocus`, `lyricDirectness`, `note`

### 待标注曲目（55 首）

#### Taylor Swift（21）

1. All Too Well
2. cardigan
3. champagne problems
4. wildest dreams
5. Shake It Off
6. Anti-Hero
7. Blank Space
8. Love Story
9. Cruel Summer
10. Style
11. Look What You Made Me Do
12. vigilante shit
13. right where you left me
14. marjorie
15. the 1
16. august
17. Delicate
18. Fortnight
19. So Long, London
20. Karma
21. New Romantics

#### Ariana Grande（6）

22. thank u, next
23. positions
24. 7 rings
25. Break Free
26. Popular
27. we can't be friends

#### Lana Del Rey（4）

28. Summertime Sadness
29. Video Games
30. Young and Beautiful
31. Chemtrails Over the Country Club

#### Olivia Rodrigo（11）

32. drivers license
33. traitor
34. good 4 u
35. vampire
36. bad idea right?
37. get him back!
38. deja vu
39. happier
40. 1 step forward, 3 steps back
41. enough for you

#### Sabrina Carpenter（4）

42. Espresso
43. Please Please Please
44. Nonsense
45. Feather

#### Charli XCX（4）

46. 360
47. Von dutch
48. Speed Drive
49. Apple

#### Gracie Abrams（6）

50. I miss you, I'm sorry
51. close to you
52. that's so true
53. I know it won't work
54. older
55. I love you, I'm sorry

### 示例（3 条，格式参考）

```json
[
  {
    "artist": "Olivia Rodrigo",
    "title": "drivers license",
    "energy": 0.25,
    "valence": 0.2,
    "phaseFit": "bridge",
    "lyricFocus": "grief",
    "lyricDirectness": 0.95,
    "note": "慢速钢琴，失恋痛感极强、词义直给"
  },
  {
    "artist": "Olivia Rodrigo",
    "title": "good 4 u",
    "energy": 0.92,
    "valence": 0.28,
    "phaseFit": "bridge",
    "lyricFocus": "anger",
    "lyricDirectness": 0.95,
    "note": "极快高能；愤怒包裹心碎，词极直给"
  },
  {
    "artist": "Ariana Grande",
    "title": "thank u, next",
    "energy": 0.65,
    "valence": 0.75,
    "phaseFit": "chorus",
    "lyricFocus": "reflection",
    "lyricDirectness": 0.8,
    "note": "中速 R&B，分手后复盘与释然"
  }
]
```

请标注全部 55 首，输出完整 JSON 数组。

---

## 复核清单（人工或第二轮 AI）

- [ ] 快歌 + 痛词：`good 4 u`, `right where you left me`, `get him back!` 的 `lyricFocus` 不是 celebration/hope
- [ ] 派对向：`360`, `Break Free` 的 `lyricFocus` 为 celebration 或 defiance
- [ ] `lyricDirectness` 与 `note` 一致（极痛直给 ≥ 0.85）
- [ ] 55 条、艺人/曲名与列表完全一致

## 入库

1. 将 AI 输出保存为 `mood-arc/data/track-scores.json`
2. 同步到 `mood-arc/lib/demo-track-catalog.ts`（需含 `tags` 时从旧 catalog 保留）
3. 运行 `npm run build` 验证

## 引擎如何使用这些字段

| 阶段 | 节奏（energy/valence） | 歌词（lyricFocus / lyricDirectness） |
|------|------------------------|--------------------------------------|
| 缓缓 hold | 低能量、低 valence | grief, longing, introspection；直给偏高 |
| 过渡 bridge | 能量抬升 | anger, bittersweet, defiance |
| 稍亮 lift | 能量略升、valence 略升 | reflection, hope, celebration（依调节目标） |

实现位置：`lib/lyric-focus.ts`（分段歌词目标）、`lib/playlist-sequencer.ts`（歌词打分权重约 40%）。
