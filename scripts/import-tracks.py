#!/usr/bin/env python3
"""Idempotent import of track emotion batches into profiles + demo catalog."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILES_PATH = ROOT / "data" / "track-emotion-profiles.json"
CATALOG_PATH = ROOT / "lib" / "demo-track-catalog.ts"
MOCK_DATA_PATH = ROOT / "lib" / "mock-data.ts"

_LEGACY_BATCH = [
  {"title": "Red", "artist": "Taylor Swift", "lyricFocus": "Intense Passion / Vivid Reminiscing", "energy": 0.82, "valence": 0.65, "lyricDirectness": 0.70},
  {"title": "Begin Again", "artist": "Taylor Swift", "lyricFocus": "Cautious Hope / Gentle Rebirth", "energy": 0.45, "valence": 0.75, "lyricDirectness": 0.80},
  {"title": "State of Grace", "artist": "Taylor Swift", "lyricFocus": "Ethereal Optimism / Vulnerable Commitment", "energy": 0.78, "valence": 0.70, "lyricDirectness": 0.60},
  {"title": "I Almost Do", "artist": "Taylor Swift", "lyricFocus": "Restrained Impulse / Lingering Yearning", "energy": 0.40, "valence": 0.25, "lyricDirectness": 0.85},
  {"title": "Holy Ground", "artist": "Taylor Swift", "lyricFocus": "Grateful Nostalgia / Upbeat Closure", "energy": 0.85, "valence": 0.80, "lyricDirectness": 0.75},
  {"title": "Astronomy", "artist": "Conan Gray", "lyricFocus": "Slow Drift / Inevitable Estrangement", "energy": 0.38, "valence": 0.20, "lyricDirectness": 0.65},
  {"title": "The Story", "artist": "Conan Gray", "lyricFocus": "Youth Survival / Quiet Resilience", "energy": 0.40, "valence": 0.45, "lyricDirectness": 0.80},
  {"title": "Wish You Were Sober", "artist": "Conan Gray", "lyricFocus": "Party Chaos / Desired Authenticity", "energy": 0.75, "valence": 0.40, "lyricDirectness": 0.85},
  {"title": "Overdrive", "artist": "Conan Gray", "lyricFocus": "Escapist Romance / Impulsive Joy", "energy": 0.80, "valence": 0.78, "lyricDirectness": 0.75},
  {"title": "Garden Song", "artist": "Phoebe Bridgers", "lyricFocus": "Surreal Growth / Quiet Acceptance", "energy": 0.30, "valence": 0.45, "lyricDirectness": 0.45},
  {"title": "Chinese Satellite", "artist": "Phoebe Bridgers", "lyricFocus": "Faithlessness / Search for Meaning", "energy": 0.55, "valence": 0.25, "lyricDirectness": 0.70},
  {"title": "Punisher", "artist": "Phoebe Bridgers", "lyricFocus": "Quiet Idolization / Fear of Intrusion", "energy": 0.25, "valence": 0.30, "lyricDirectness": 0.55},
  {"title": "Red Wine Supernova", "artist": "Chappell Roan", "lyricFocus": "Playful Queer Lust / Exuberant Fantasy", "energy": 0.85, "valence": 0.85, "lyricDirectness": 0.80},
  {"title": "My Kink Is Karma", "artist": "Chappell Roan", "lyricFocus": "Vindictive Satisfaction / High-Energy Scorn", "energy": 0.82, "valence": 0.65, "lyricDirectness": 0.85},
  {"title": "Femininomenon", "artist": "Chappell Roan", "lyricFocus": "Female Empowerment / Sarcastic Disillusionment", "energy": 0.88, "valence": 0.75, "lyricDirectness": 0.85},
  {"title": "bad idea right?", "artist": "Olivia Rodrigo", "lyricFocus": "Self-Aware Relapse / Playful Guilt", "energy": 0.85, "valence": 0.65, "lyricDirectness": 0.90},
  {"title": "get him back!", "artist": "Olivia Rodrigo", "lyricFocus": "Dual Intentions / Chaotic Revenge", "energy": 0.88, "valence": 0.70, "lyricDirectness": 0.85},
  {"title": "all-american bitch", "artist": "Olivia Rodrigo", "lyricFocus": "Repressed Rage / Perfection Expectations", "energy": 0.82, "valence": 0.40, "lyricDirectness": 0.85},
  {"title": "lacy", "artist": "Olivia Rodrigo", "lyricFocus": "Obsessive Envy / Complex Idealization", "energy": 0.35, "valence": 0.25, "lyricDirectness": 0.75},
  {"title": "logical", "artist": "Olivia Rodrigo", "lyricFocus": "Manipulation Disillusion / Regretful Realization", "energy": 0.50, "valence": 0.18, "lyricDirectness": 0.80},
  {"title": "making the bed", "artist": "Olivia Rodrigo", "lyricFocus": "Self-Induced Isolation / Fame Dissatisfaction", "energy": 0.42, "valence": 0.22, "lyricDirectness": 0.80},
  {"title": "scared of my guitar", "artist": "Olivia Rodrigo", "lyricFocus": "Fear of Vulnerability / Self-Deception", "energy": 0.30, "valence": 0.20, "lyricDirectness": 0.85},
  {"title": "so american", "artist": "Olivia Rodrigo", "lyricFocus": "Helpless Infatuation / Unabashed Joy", "energy": 0.80, "valence": 0.85, "lyricDirectness": 0.80},
  {"title": "obsessed", "artist": "Olivia Rodrigo", "lyricFocus": "Ex-Partner Jealousy / Paranoia", "energy": 0.82, "valence": 0.35, "lyricDirectness": 0.85},
  {"title": "stranger", "artist": "Olivia Rodrigo", "lyricFocus": "Peaceful Closure / Healing Recovery", "energy": 0.48, "valence": 0.70, "lyricDirectness": 0.80},
  {"title": "Who's Afraid of Little Old Me?", "artist": "Taylor Swift", "lyricFocus": "Defiant Rage / Villain Origin", "energy": 0.78, "valence": 0.25, "lyricDirectness": 0.85},
  {"title": "So Long, London", "artist": "Taylor Swift", "lyricFocus": "Exhausted Grief / Farewell Resignation", "energy": 0.45, "valence": 0.20, "lyricDirectness": 0.80},
  {"title": "Florida!!!", "artist": "Taylor Swift", "lyricFocus": "Wild Escapism / Cathartic Release", "energy": 0.82, "valence": 0.50, "lyricDirectness": 0.70},
  {"title": "Clara Bow", "artist": "Taylor Swift", "lyricFocus": "Cyclical Fame / Generational Replacement", "energy": 0.48, "valence": 0.35, "lyricDirectness": 0.75},
  {"title": "The Black Dog", "artist": "Taylor Swift", "lyricFocus": "Post-Breakup Obsession / Visceral Betrayal", "energy": 0.62, "valence": 0.18, "lyricDirectness": 0.85},
  {"title": "Taste", "artist": "Sabrina Carpenter", "lyricFocus": "Petty Triumph / Lingering Presence", "energy": 0.80, "valence": 0.70, "lyricDirectness": 0.85},
  {"title": "Nonsense", "artist": "Sabrina Carpenter", "lyricFocus": "Flirty Confusion / Brain-Melt Infatuation", "energy": 0.72, "valence": 0.80, "lyricDirectness": 0.85},
  {"title": "Because I Liked a Boy", "artist": "Sabrina Carpenter", "lyricFocus": "Public Scrutiny / Unfair Condemnation", "energy": 0.58, "valence": 0.30, "lyricDirectness": 0.90},
  {"title": "Skinny Dipping", "artist": "Sabrina Carpenter", "lyricFocus": "Awkward Encounter / Conversational Closure", "energy": 0.55, "valence": 0.55, "lyricDirectness": 0.85},
  {"title": "Fast Times", "artist": "Sabrina Carpenter", "lyricFocus": "Impulsive Attraction / Cool Confidence", "energy": 0.70, "valence": 0.75, "lyricDirectness": 0.75},
  {"title": "Ride", "artist": "Lana Del Rey", "lyricFocus": "Existential Drift / Restless Freedom", "energy": 0.52, "valence": 0.40, "lyricDirectness": 0.55},
  {"title": "Ultraviolence", "artist": "Lana Del Rey", "lyricFocus": "Toxic Devotion / Dark Dependence", "energy": 0.45, "valence": 0.20, "lyricDirectness": 0.50},
  {"title": "Shades of Cool", "artist": "Lana Del Rey", "lyricFocus": "Unattainable Partner / Melancholic Distance", "energy": 0.58, "valence": 0.30, "lyricDirectness": 0.45},
  {"title": "High by the Beach", "artist": "Lana Del Rey", "lyricFocus": "Apathetic Dismissal / Need for Solitude", "energy": 0.55, "valence": 0.45, "lyricDirectness": 0.80},
  {"title": "Lust for Life", "artist": "Lana Del Rey", "lyricFocus": "Romantic Glamour / Youthful Vitality", "energy": 0.65, "valence": 0.70, "lyricDirectness": 0.60},
  {"title": "The Greatest", "artist": "Lana Del Rey", "lyricFocus": "Cultural Weariness / Nostalgic Mourning", "energy": 0.42, "valence": 0.30, "lyricDirectness": 0.65},
  {"title": "Chemtrails Over the Country Club", "artist": "Lana Del Rey", "lyricFocus": "Suburban Escape / Serene Isolation", "energy": 0.38, "valence": 0.50, "lyricDirectness": 0.50},
  {"title": "White Dress", "artist": "Lana Del Rey", "lyricFocus": "Pre-Fame Nostalgia / Innocent Passion", "energy": 0.35, "valence": 0.40, "lyricDirectness": 0.70},
  {"title": "Nobody Gets Me", "artist": "SZA", "lyricFocus": "Desperate Regret / Unique Bond Loss", "energy": 0.40, "valence": 0.20, "lyricDirectness": 0.85},
  {"title": "Shirt", "artist": "SZA", "lyricFocus": "Chaotic Uncertainty / Emotional Confusion", "energy": 0.65, "valence": 0.40, "lyricDirectness": 0.70},
  {"title": "Low", "artist": "SZA", "lyricFocus": "Guarded Emotions / Discreet Revenge", "energy": 0.70, "valence": 0.45, "lyricDirectness": 0.75},
  {"title": "Ghost in the Machine", "artist": "SZA", "lyricFocus": "Modern Disconnection / Craving Humanity", "energy": 0.52, "valence": 0.25, "lyricDirectness": 0.75},
  {"title": "BLUE", "artist": "Billie Eilish", "lyricFocus": "Cyclical Sadness / Farewell Reflection", "energy": 0.45, "valence": 0.25, "lyricDirectness": 0.65},
  {"title": "THE GREATEST", "artist": "Billie Eilish", "lyricFocus": "Unappreciated Sacrifice / Explosive Frustration", "energy": 0.65, "valence": 0.20, "lyricDirectness": 0.80},
  {"title": "L'AMOUR DE MA VIE", "artist": "Billie Eilish", "lyricFocus": "Post-Breakup Clarity / Sudden Indifference", "energy": 0.75, "valence": 0.55, "lyricDirectness": 0.85},
  {"title": "Karma", "artist": "Taylor Swift", "lyricFocus": "Playful Vindication / Cosmic Reward", "energy": 0.78, "valence": 0.85, "lyricDirectness": 0.80},
  {"title": "Bejeweled", "artist": "Taylor Swift", "lyricFocus": "Reclaiming Sparkle / Self-Worth Pride", "energy": 0.70, "valence": 0.80, "lyricDirectness": 0.75},
  {"title": "Mastermind", "artist": "Taylor Swift", "lyricFocus": "Calculated Romance / Vulnerable Admission", "energy": 0.65, "valence": 0.65, "lyricDirectness": 0.85},
  {"title": "The Alchemy", "artist": "Taylor Swift", "lyricFocus": "Triumphant Reunion / Chemical Attraction", "energy": 0.72, "valence": 0.75, "lyricDirectness": 0.70},
  {"title": "I Can See You", "artist": "Taylor Swift", "lyricFocus": "Secret Desire / Stealthy Attraction", "energy": 0.75, "valence": 0.70, "lyricDirectness": 0.75},
  {"title": "Super Rich Kids", "artist": "Frank Ocean", "lyricFocus": "Apathetic Privilege / Wealthy Emptiness", "energy": 0.50, "valence": 0.35, "lyricDirectness": 0.70},
  {"title": "Pyramids", "artist": "Frank Ocean", "lyricFocus": "Mythic Tragedy / Modern Struggle", "energy": 0.72, "valence": 0.45, "lyricDirectness": 0.50},
  {"title": "Bad Religion", "artist": "Frank Ocean", "lyricFocus": "Unrequited Devotion / Taxi Confession", "energy": 0.40, "valence": 0.20, "lyricDirectness": 0.80},
  {"title": "Pink + White", "artist": "Frank Ocean", "lyricFocus": "Nostalgic Acceptance / Bittersweet Gratitude", "energy": 0.55, "valence": 0.65, "lyricDirectness": 0.60},
  {"title": "Seigfried", "artist": "Frank Ocean", "lyricFocus": "Existential Doubt / Non-Conformity Anxiety", "energy": 0.28, "valence": 0.20, "lyricDirectness": 0.45},
  {"title": "Blowing Smoke", "artist": "Gracie Abrams", "lyricFocus": "Lingering Jealousy / Bitter Comparison", "energy": 0.58, "valence": 0.30, "lyricDirectness": 0.85},
  {"title": "Tough Love", "artist": "Gracie Abrams", "lyricFocus": "Independence Pursuit / Friendship Priority", "energy": 0.62, "valence": 0.60, "lyricDirectness": 0.80},
  {"title": "Normal Thing", "artist": "Gracie Abrams", "lyricFocus": "Unrealistic Projection / Idolized Crush", "energy": 0.40, "valence": 0.35, "lyricDirectness": 0.75},
  {"title": "Gave You I Gave You I", "artist": "Gracie Abrams", "lyricFocus": "Asymmetric Effort / Exhausted Heartbreak", "energy": 0.52, "valence": 0.25, "lyricDirectness": 0.85},
  {"title": "Full Machine", "artist": "Gracie Abrams", "lyricFocus": "Co-dependent Dependence / Fragile Stability", "energy": 0.45, "valence": 0.30, "lyricDirectness": 0.80},
  {"title": "Sober II (Melodrama)", "artist": "Lorde", "lyricFocus": "Post-Party Reckoning / Clean-up Melancholy", "energy": 0.48, "valence": 0.25, "lyricDirectness": 0.70},
  {"title": "The Louvreness", "artist": "Lorde", "lyricFocus": "Obsessive Infatuation / Grandiose Love", "energy": 0.60, "valence": 0.65, "lyricDirectness": 0.65},
  {"title": "Homemade Dynamite", "artist": "Lorde", "lyricFocus": "Reckless Euphoria / Party Connection", "energy": 0.75, "valence": 0.70, "lyricDirectness": 0.75},
  {"title": "Writer in the Dark", "artist": "Lorde", "lyricFocus": "Unapologetic Survival / Cathartic Creation", "energy": 0.42, "valence": 0.30, "lyricDirectness": 0.80},
  {"title": "Stoned at the Nail Salon", "artist": "Lorde", "lyricFocus": "Aging Disillusion / Quiet Contemplation", "energy": 0.28, "valence": 0.35, "lyricDirectness": 0.75},
  {"title": "Sexy To Someone", "artist": "Clairo", "lyricFocus": "Desire for Validation / Casual Yearning", "energy": 0.62, "valence": 0.65, "lyricDirectness": 0.85},
  {"title": "Nomad", "artist": "Clairo", "lyricFocus": "Self-Protective Isolation / Fear of Rejection", "energy": 0.38, "valence": 0.30, "lyricDirectness": 0.75},
  {"title": "Juna", "artist": "Clairo", "lyricFocus": "Effortless Attraction / Soft Surrender", "energy": 0.45, "valence": 0.75, "lyricDirectness": 0.70},
  {"title": "4EVER", "artist": "Clairo", "lyricFocus": "Youthful Uncertainty / Casual Romance", "energy": 0.65, "valence": 0.70, "lyricDirectness": 0.70},
  {"title": "Flaming Hot Cheetos", "artist": "Clairo", "lyricFocus": "Insecure Hesitation / Awkward Crush", "energy": 0.35, "valence": 0.40, "lyricDirectness": 0.75},
]

ARTIST_MAP = {
  "charli xcx": "Charli XCX",
  "billie eilish": "Billie Eilish",
  "taylor swift": "Taylor Swift",
  "gracie abrams": "Gracie Abrams",
  "lana del rey": "Lana Del Rey",
  "lorde": "Lorde",
  "chappell roan": "Chappell Roan",
  "conan gray": "Conan Gray",
  "phoebe bridgers": "Phoebe Bridgers",
  "frank ocean": "Frank Ocean",
  "sza": "SZA",
  "olivia rodrigo": "Olivia Rodrigo",
  "sabrina carpenter": "Sabrina Carpenter",
  "clairo": "Clairo",
  "post malone": "Post Malone",
  "post malone & swae lee": "Post Malone",
  "jvke": "JVKE",
  "stephen sanchez": "Stephen Sanchez",
  "joji": "Joji",
  "jimin": "Jimin",
  "jung kook": "Jung Kook",
  "newjeans": "NewJeans",
}


def load_batch() -> list:
  if len(sys.argv) > 1:
    path = Path(sys.argv[1])
    if not path.is_absolute():
      path = ROOT / path
    return json.loads(path.read_text())
  default = ROOT / "scripts" / "batch-import.json"
  if default.exists():
    return json.loads(default.read_text())
  return _LEGACY_BATCH


def ensure_demo_artists(catalog_text: str, artists: set[str]) -> str:
  header = catalog_text.split("RAW_DEMO_TRACKS")[0]
  for artist in sorted(artists):
    if f'"{artist}"' in header:
      continue
    catalog_text = catalog_text.replace(
      '| "Frank Ocean";',
      f'| "Frank Ocean"\n  | "{artist}";',
    )
  return catalog_text


def ensure_mock_channels(artists: set[str]) -> None:
  if not MOCK_DATA_PATH.exists() or not artists:
    return
  text = MOCK_DATA_PATH.read_text()
  existing = set(re.findall(r'name:\s*"([^"]+)"', text))
  ch_num = max(int(m) for m in re.findall(r'id:\s*"ch(\d+)"', text) or ["0"])
  additions = []
  for artist in sorted(artists):
    if artist in existing:
      continue
    ch_num += 1
    additions.append(
      f'  {{ id: "ch{ch_num}", name: "{artist}", url: "#", source: "liked" as const }},'
    )
  if additions:
    text = text.replace("\n];", "\n" + "\n".join(additions) + "\n];")
    MOCK_DATA_PATH.write_text(text)


def norm_key(title: str, artist: str) -> tuple[str, str]:
  a = ARTIST_MAP.get(artist.lower().strip(), artist.strip())
  if "feat." in a.lower():
    a = a.split("feat.")[0].strip()
  return title.strip().lower(), a.lower()


def parse_catalog_keys(text: str) -> set[tuple[str, str]]:
  pairs = re.findall(r'title:\s*"([^"]+)"\s*,\s*artist:\s*"([^"]+)"', text)
  return {norm_key(t, a) for t, a in pairs}


def infer_emotion(focus: str, valence: float, energy: float) -> tuple[str, str]:
  f = focus.lower()
  if any(x in f for x in ["anger", "scorn", "indignation", "resentment", "revenge", "betrayal", "rage"]):
    return "anger", "resentment"
  if any(x in f for x in ["grief", "heartbreak", "mourning", "loss", "alienation"]):
    return "grief", "longing"
  if any(x in f for x in ["love", "devotion", "intimacy", "romance", "infatuation", "flirt", "lust"]):
    return "love", "longing"
  if any(x in f for x in ["anxiety", "fear", "panic", "insecurity", "self-doubt", "imposter"]):
    return "anxiety", "vulnerability"
  if any(x in f for x in ["joy", "cheer", "liberation", "confidence", "pride", "celebration", "empowerment"]):
    return "joy", "confidence"
  if any(x in f for x in ["nostalgia", "memory", "childhood", "growing up"]):
    return "nostalgia", "bittersweet"
  if any(x in f for x in ["healing", "peace", "relief", "warmth", "closure"]):
    return "healing", "acceptance"
  if any(x in f for x in ["existential", "purpose", "numbness", "depressive", "weariness"]):
    return "existential", "numbness"
  if valence < 0.35:
    return "sadness", "melancholy"
  if energy > 0.75:
    return "excitement", "energy"
  return "reflection", "introspection"


def infer_regulation(focus: str, valence: float, energy: float) -> tuple[str, str]:
  f = focus.lower()
  if any(x in f for x in ["catharsis", "scorn", "release", "breakthrough"]):
    return "catharsis", "emotional_release"
  if any(x in f for x in ["comfort", "intimacy", "soothing", "reassuring", "healing", "peace"]):
    return "comfort", "solace"
  if valence > 0.7 and energy > 0.6:
    return "celebration", "joyful_expression"
  if energy > 0.75:
    return "energy", "activation"
  if valence < 0.35:
    return "reflection", "processing"
  return "reflection", "emotional_awareness"


def tags_from(focus: str, primary: str) -> list[str]:
  parts = re.split(r"[/,]", focus.lower())
  tags = [re.sub(r"[^a-z0-9]+", "_", p.strip())[:24] for p in parts if p.strip()]
  tags.append(primary.replace(" ", "_"))
  return list(dict.fromkeys(tags))[:6]


def matching_signals(valence: float, energy: float, directness: float) -> dict:
  low_v = valence < 0.4
  high_e = energy > 0.7
  return {
    "comfortSeeking": round(0.85 if low_v and not high_e else 0.45 if low_v else 0.25, 2),
    "reflectionSeeking": round(0.88 if low_v else 0.55, 2),
    "energySeeking": round(0.9 if high_e else 0.35, 2),
    "distractionSeeking": round(0.75 if high_e else 0.4 if not low_v else 0.25, 2),
  }


def emotion_arc(energy: float, valence: float) -> dict:
  return {
    "hold": round(min(0.9, 0.35 + (1 - energy) * 0.4), 2),
    "bridge": round(min(0.95, 0.4 + energy * 0.45), 2),
    "lift": round(min(0.9, valence * 0.85 + energy * 0.15), 2),
  }


def to_profile(t: dict) -> dict:
  artist = ARTIST_MAP.get(t["artist"].lower(), t["artist"])
  if "feat." in artist.lower():
    artist = artist.split("feat.")[0].strip()
  primary, secondary = infer_emotion(t["lyricFocus"], t["valence"], t["energy"])
  fn, target = infer_regulation(t["lyricFocus"], t["valence"], t["energy"])
  intensity = round(min(0.95, 0.5 + abs(t["valence"] - 0.5) + t["energy"] * 0.2), 2)
  return {
    "title": t["title"],
    "artist": artist,
    "language": "English",
    "primaryEmotion": primary,
    "secondaryEmotion": secondary,
    "energy": t["energy"],
    "valence": t["valence"],
    "emotionalIntensity": intensity,
    "lyricDirectness": t["lyricDirectness"],
    "tags": tags_from(t["lyricFocus"], primary),
    "regulation": {"function": fn, "targetState": target},
    "matchingSignals": matching_signals(t["valence"], t["energy"], t["lyricDirectness"]),
    "emotionArc": emotion_arc(t["energy"], t["valence"]),
    "listenerContext": {
      "bestFor": [f"exploring {t['lyricFocus'].split('/')[0].strip().lower()} feelings", "emotion-aware listening"],
      "avoidWhen": ["seeking pure upbeat escape"] if t["valence"] < 0.35 else ["deep grief immersion"] if t["valence"] > 0.75 else ["high-focus work"],
    },
    "emotionalMeaning": {
      "coreFeeling": t["lyricFocus"].replace("/", " mixed with "),
      "underlyingNeed": "feel understood in complex emotional territory",
      "emotionalFunction": fn,
    },
  }


def catalog_stub(t: dict) -> str:
  artist = ARTIST_MAP.get(t["artist"].lower(), t["artist"]).split("feat.")[0].strip()
  title = t["title"].replace('"', '\\"')
  e, v = t["energy"], t["valence"]
  ld = t["lyricDirectness"]
  focus = "introspection" if v < 0.4 else "longing" if v < 0.55 else "flirt" if v > 0.65 else "reflection"
  phase = "climax" if e > 0.8 else "chorus" if e > 0.55 else "verse"
  timbre = "power_belt" if e > 0.75 else "breathy_hushed" if e < 0.4 else "soft_warm"
  note = t["lyricFocus"][:40]
  tags = '["heartbreak","solace"]' if v < 0.35 else '["romance","uptempo"]' if v > 0.7 and e > 0.6 else '["bittersweet","solace"]'
  return f'  {{ title: "{title}", artist: "{artist}", energy: {e}, valence: {v}, phaseFit: "{phase}", lyricFocus: "{focus}", lyricDirectness: {ld}, vocalTimbre: "{timbre}", note: "{note}", tags: {tags} }},'


def dedupe_profiles(profiles: list) -> list:
  seen: set[tuple[str, str]] = set()
  out = []
  for p in profiles:
    k = norm_key(p["title"], p["artist"])
    if k in seen:
      continue
    seen.add(k)
    out.append(p)
  return out


def main():
  existing = dedupe_profiles(json.loads(PROFILES_PATH.read_text()))
  profile_keys = {norm_key(p["title"], p["artist"]) for p in existing}

  catalog_text = CATALOG_PATH.read_text()
  catalog_keys = parse_catalog_keys(catalog_text)

  seen: set[tuple[str, str]] = set()
  new_profiles = []
  new_catalog_lines = []
  skipped_profile = []
  skipped_catalog = []

  batch = load_batch()
  new_artists: set[str] = set()

  for t in batch:
    key = norm_key(t["title"], t["artist"])
    if key in seen:
      continue
    seen.add(key)

    if key in profile_keys:
      skipped_profile.append(f"{t['title']} / {key[1]}")
    else:
      new_profiles.append(to_profile(t))
      profile_keys.add(key)

    if key in catalog_keys:
      skipped_catalog.append(f"{t['title']} / {key[1]}")
    else:
      artist = ARTIST_MAP.get(t["artist"].lower(), t["artist"]).split("feat.")[0].strip()
      new_artists.add(artist)
      new_catalog_lines.append(catalog_stub(t))
      catalog_keys.add(key)

  merged = existing + new_profiles
  PROFILES_PATH.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n")

  if new_catalog_lines:
    insert_marker = '  { title: "Sofia", artist: "Clairo"'
    block = "\n".join(new_catalog_lines) + "\n"
    if insert_marker in catalog_text:
      catalog_text = catalog_text.replace(insert_marker, block + insert_marker)
    else:
      catalog_text = catalog_text.replace("];", block + "];")
    catalog_text = ensure_demo_artists(catalog_text, new_artists)
    CATALOG_PATH.write_text(catalog_text)
    ensure_mock_channels(new_artists)

  print(f"Profiles: +{len(new_profiles)} (total {len(merged)}), skipped {len(skipped_profile)}")
  print(f"Catalog: +{len(new_catalog_lines)}, skipped {len(skipped_catalog)}")
  if skipped_catalog:
    print("Catalog skips:", ", ".join(skipped_catalog[:12]), "..." if len(skipped_catalog) > 12 else "")


if __name__ == "__main__":
  main()
