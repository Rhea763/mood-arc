#!/usr/bin/env python3
"""Import TRACK_026–100 batch into track-emotion-profiles.json + demo catalog stubs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILES_PATH = ROOT / "data" / "track-emotion-profiles.json"
CATALOG_PATH = ROOT / "lib" / "demo-track-catalog.ts"

RAW = [
  {"title": "BIRDS OF A FEATHER", "artist": "Billie Eilish", "lyricFocus": "Devoted Attachment / Fear of Loss", "energy": 0.65, "valence": 0.60, "lyricDirectness": 0.80},
  {"title": "WILDFLOWER", "artist": "Billie Eilish", "lyricFocus": "Guilt / Lingering Comparison", "energy": 0.42, "valence": 0.25, "lyricDirectness": 0.75},
  {"title": "LUNCH", "artist": "Billie Eilish", "lyricFocus": "Flirtatious Infatuation", "energy": 0.72, "valence": 0.75, "lyricDirectness": 0.85},
  {"title": "CHIHIRO", "artist": "Billie Eilish", "lyricFocus": "Identity Loss / Ethereal Longing", "energy": 0.58, "valence": 0.35, "lyricDirectness": 0.40},
  {"title": "happier than ever", "artist": "Billie Eilish", "lyricFocus": "Cathartic Indignation / Freedom", "energy": 0.70, "valence": 0.30, "lyricDirectness": 0.85},
  {"title": "us.", "artist": "Gracie Abrams", "lyricFocus": "Bittersweet Wondering / Lingering Connection", "energy": 0.55, "valence": 0.45, "lyricDirectness": 0.70},
  {"title": "I Love You, I'm Sorry", "artist": "Gracie Abrams", "lyricFocus": "Apologetic Self-Reflection", "energy": 0.48, "valence": 0.35, "lyricDirectness": 0.85},
  {"title": "21", "artist": "Gracie Abrams", "lyricFocus": "Restless Longing / Nostalgic Guilt", "energy": 0.52, "valence": 0.30, "lyricDirectness": 0.80},
  {"title": "Feelslike", "artist": "Gracie Abrams", "lyricFocus": "Comforting Intimacy", "energy": 0.50, "valence": 0.65, "lyricDirectness": 0.75},
  {"title": "gold rush", "artist": "Taylor Swift", "lyricFocus": "Daydreaming Jealousy / Self-Protection", "energy": 0.68, "valence": 0.45, "lyricDirectness": 0.65},
  {"title": "champagne problems", "artist": "Taylor Swift", "lyricFocus": "Regretful Rejection / Guilt", "energy": 0.45, "valence": 0.20, "lyricDirectness": 0.75},
  {"title": "my tears ricochet", "artist": "Taylor Swift", "lyricFocus": "Betrayal Haunting / Mourning", "energy": 0.52, "valence": 0.15, "lyricDirectness": 0.55},
  {"title": "mirrorball", "artist": "Taylor Swift", "lyricFocus": "People-Pleasing Fragility", "energy": 0.42, "valence": 0.35, "lyricDirectness": 0.50},
  {"title": "seven", "artist": "Taylor Swift", "lyricFocus": "Childhood Nostalgia / Pure Empathy", "energy": 0.38, "valence": 0.50, "lyricDirectness": 0.45},
  {"title": "this is me trying", "artist": "Taylor Swift", "lyricFocus": "Vulnerable Effort / Regret", "energy": 0.35, "valence": 0.25, "lyricDirectness": 0.80},
  {"title": "Say Yes to Heaven", "artist": "Lana Del Rey", "lyricFocus": "Serene Surrender / Devotion", "energy": 0.38, "valence": 0.55, "lyricDirectness": 0.50},
  {"title": "Norman fucking Rockwell", "artist": "Lana Del Rey", "lyricFocus": "Affectionate Frustration / Cynicism", "energy": 0.40, "valence": 0.40, "lyricDirectness": 0.75},
  {"title": "West Coast", "artist": "Lana Del Rey", "lyricFocus": "Hypnotic Passion / Sensual Shift", "energy": 0.58, "valence": 0.45, "lyricDirectness": 0.45},
  {"title": "Brooklyn Baby", "artist": "Lana Del Rey", "lyricFocus": "Satirical Hipster Pride", "energy": 0.50, "valence": 0.60, "lyricDirectness": 0.65},
  {"title": "Green Light", "artist": "Lorde", "lyricFocus": "Anticipatory Release / Heartbreak Breakthrough", "energy": 0.82, "valence": 0.55, "lyricDirectness": 0.75},
  {"title": "Supercut", "artist": "Lorde", "lyricFocus": "Idealized Memory / Desperate Reliving", "energy": 0.78, "valence": 0.45, "lyricDirectness": 0.65},
  {"title": "Ribs", "artist": "Lorde", "lyricFocus": "Fear of Growing Up / Nostalgic Panic", "energy": 0.65, "valence": 0.35, "lyricDirectness": 0.60},
  {"title": "Liability", "artist": "Lorde", "lyricFocus": "Self-Soothing Isolation", "energy": 0.28, "valence": 0.20, "lyricDirectness": 0.85},
  {"title": "Solar Power", "artist": "Lorde", "lyricFocus": "Carefree Warmth / Relief", "energy": 0.58, "valence": 0.80, "lyricDirectness": 0.70},
  {"title": "Royals", "artist": "Lorde", "lyricFocus": "Detached Youth Pride / Anti-Materialism", "energy": 0.55, "valence": 0.60, "lyricDirectness": 0.80},
  {"title": "Good Luck, Babe!", "artist": "Chappell Roan", "lyricFocus": "Compulsory Heterosexuality / Bitter Prophecy", "energy": 0.82, "valence": 0.45, "lyricDirectness": 0.85},
  {"title": "HOT TO GO!", "artist": "Chappell Roan", "lyricFocus": "Playful Desire / High-Energy Cheer", "energy": 0.90, "valence": 0.90, "lyricDirectness": 0.85},
  {"title": "Pink Pony Club", "artist": "Chappell Roan", "lyricFocus": "Queer Liberation / Self-Actualization", "energy": 0.80, "valence": 0.75, "lyricDirectness": 0.80},
  {"title": "Casual", "artist": "Chappell Roan", "lyricFocus": "Situationship Frustration / Indignation", "energy": 0.58, "valence": 0.25, "lyricDirectness": 0.90},
  {"title": "360", "artist": "Charli XCX", "lyricFocus": "It-Girl Confidence / Cool Detachment", "energy": 0.75, "valence": 0.70, "lyricDirectness": 0.75},
  {"title": "Von dutch", "artist": "Charli XCX", "lyricFocus": "Unapologetic Narcissism / Flexing", "energy": 0.88, "valence": 0.65, "lyricDirectness": 0.80},
  {"title": "Girl, so confusing", "artist": "Charli XCX", "lyricFocus": "Female Rivalry / Vulnerable Ambivalence", "energy": 0.72, "valence": 0.45, "lyricDirectness": 0.85},
  {"title": "Apple", "artist": "Charli XCX", "lyricFocus": "Generational Trauma / Restless Escape", "energy": 0.80, "valence": 0.55, "lyricDirectness": 0.65},
  {"title": "The Tortured Poets Department", "artist": "Taylor Swift", "lyricFocus": "Self-Aware Melodrama / Chaotic Intimacy", "energy": 0.55, "valence": 0.40, "lyricDirectness": 0.80},
  {"title": "Down Bad", "artist": "Taylor Swift", "lyricFocus": "Alienation / Post-Breakup Lethargy", "energy": 0.62, "valence": 0.30, "lyricDirectness": 0.85},
  {"title": "Fortnight", "artist": "Taylor Swift", "lyricFocus": "Fatalistic Numbness / Suburban Melancholy", "energy": 0.50, "valence": 0.35, "lyricDirectness": 0.70},
  {"title": "I Can Do It With a Broken Heart", "artist": "Taylor Swift", "lyricFocus": "Forced Professionalism / Dissociative Resilience", "energy": 0.85, "valence": 0.35, "lyricDirectness": 0.90},
  {"title": "Guilty as Sin?", "artist": "Taylor Swift", "lyricFocus": "Unchaste Daydreaming / Emotional Infidelity", "energy": 0.60, "valence": 0.50, "lyricDirectness": 0.75},
  {"title": "The Smallest Man Who Ever Lived", "artist": "Taylor Swift", "lyricFocus": "Cathartic Scorn / Betrayal Reckoning", "energy": 0.65, "valence": 0.15, "lyricDirectness": 0.85},
  {"title": "what was I made for?", "artist": "Billie Eilish", "lyricFocus": "Existential Purpose / Emotional Numbness", "energy": 0.25, "valence": 0.20, "lyricDirectness": 0.70},
  {"title": "TV", "artist": "Billie Eilish", "lyricFocus": "Depressive Isolation / Media Distraction", "energy": 0.35, "valence": 0.20, "lyricDirectness": 0.85},
  {"title": "ocean eyes", "artist": "Billie Eilish", "lyricFocus": "Hypnotic Vulnerability / Infatuation", "energy": 0.30, "valence": 0.45, "lyricDirectness": 0.55},
  {"title": "everything i wanted", "artist": "Billie Eilish", "lyricFocus": "Nightmarish Fame / Sibling Protection", "energy": 0.40, "valence": 0.30, "lyricDirectness": 0.75},
  {"title": "Heather", "artist": "Conan Gray", "lyricFocus": "Insecure Envy / Unrequited Love", "energy": 0.42, "valence": 0.20, "lyricDirectness": 0.80},
  {"title": "Maniac", "artist": "Conan Gray", "lyricFocus": "Exposing Ex's Hypocrisy / Upbeat Scorn", "energy": 0.78, "valence": 0.50, "lyricDirectness": 0.85},
  {"title": "Memories", "artist": "Conan Gray", "lyricFocus": "Desperate Boundaries / Lingering Trauma", "energy": 0.55, "valence": 0.25, "lyricDirectness": 0.85},
  {"title": "People Watching", "artist": "Conan Gray", "lyricFocus": "Vicarious Romance / Fear of Intimacy", "energy": 0.60, "valence": 0.35, "lyricDirectness": 0.75},
  {"title": "Glitch", "artist": "Taylor Swift", "lyricFocus": "Accidental Romance / Playful Confusion", "energy": 0.52, "valence": 0.60, "lyricDirectness": 0.70},
  {"title": "Maroon", "artist": "Taylor Swift", "lyricFocus": "Mature Heartbreak / Visceral Memories", "energy": 0.55, "valence": 0.30, "lyricDirectness": 0.65},
  {"title": "You're On Your Own, Kid", "artist": "Taylor Swift", "lyricFocus": "Bittersweet Growth / Self-Reliance", "energy": 0.65, "valence": 0.50, "lyricDirectness": 0.75},
  {"title": "Motion Sickness", "artist": "Phoebe Bridgers", "lyricFocus": "Resentful Clarity / Emotional Manipulation", "energy": 0.62, "valence": 0.35, "lyricDirectness": 0.85},
  {"title": "Kyoto", "artist": "Phoebe Bridgers", "lyricFocus": "Complex Paternal Resentment / Imposter Syndrome", "energy": 0.75, "valence": 0.45, "lyricDirectness": 0.80},
  {"title": "I Know the End", "artist": "Phoebe Bridgers", "lyricFocus": "Apocalyptic Catharsis / Exhaustion", "energy": 0.70, "valence": 0.20, "lyricDirectness": 0.65},
  {"title": "Savior Complex", "artist": "Phoebe Bridgers", "lyricFocus": "Co-dependency / Exhausting Empathy", "energy": 0.30, "valence": 0.25, "lyricDirectness": 0.60},
  {"title": "Lost", "artist": "Frank Ocean", "lyricFocus": "Naïve Complicity / Tragic Romance", "energy": 0.68, "valence": 0.65, "lyricDirectness": 0.75},
  {"title": "Thinkin Bout You", "artist": "Frank Ocean", "lyricFocus": "Vulnerable Denial / Unrequited Longing", "energy": 0.42, "valence": 0.45, "lyricDirectness": 0.70},
  {"title": "Nights", "artist": "Frank Ocean", "lyricFocus": "Dual Life / Nostalgic Transition", "energy": 0.65, "valence": 0.50, "lyricDirectness": 0.60},
  {"title": "Chanel", "artist": "Frank Ocean", "lyricFocus": "Duality Confidence / Fluid Identity", "energy": 0.55, "valence": 0.60, "lyricDirectness": 0.65},
  {"title": "Ivy", "artist": "Frank Ocean", "lyricFocus": "Youthful Innocence / Nostalgic Heartbreak", "energy": 0.48, "valence": 0.35, "lyricDirectness": 0.60},
  {"title": "Self Control", "artist": "Frank Ocean", "lyricFocus": "Bittersweet Acceptance / Lingering Devotion", "energy": 0.35, "valence": 0.30, "lyricDirectness": 0.65},
  {"title": "Exile", "artist": "Taylor Swift", "lyricFocus": "Miscommunication / Post-Breakup Alienation", "energy": 0.45, "valence": 0.15, "lyricDirectness": 0.75},
  {"title": "Lover", "artist": "Taylor Swift", "lyricFocus": "Domestic Devotion / Timeless Commitment", "energy": 0.50, "valence": 0.85, "lyricDirectness": 0.75},
  {"title": "Delicate", "artist": "Taylor Swift", "lyricFocus": "Fragile Beginning / Reputation Anxiety", "energy": 0.58, "valence": 0.60, "lyricDirectness": 0.80},
  {"title": "Getaway Car", "artist": "Taylor Swift", "lyricFocus": "Inevitable Betrayal / Rebound Guilt", "energy": 0.82, "valence": 0.40, "lyricDirectness": 0.75},
  {"title": "Style", "artist": "Taylor Swift", "lyricFocus": "Cyclical Attraction / Magnetic Nostalgia", "energy": 0.78, "valence": 0.70, "lyricDirectness": 0.70},
  {"title": "A&W", "artist": "Lana Del Rey", "lyricFocus": "Societal Judgment / Internalized Trauma", "energy": 0.52, "valence": 0.20, "lyricDirectness": 0.60},
  {"title": "Did you know that there's a tunnel under Ocean Blvd", "artist": "Lana Del Rey", "lyricFocus": "Fear of Being Forgotten / Vulnerable Longing", "energy": 0.35, "valence": 0.30, "lyricDirectness": 0.55},
  {"title": "Venice Bitch", "artist": "Lana Del Rey", "lyricFocus": "Psychedelic Domesticity / Driftless Romance", "energy": 0.40, "valence": 0.60, "lyricDirectness": 0.40},
  {"title": "Mariners Apartment Complex", "artist": "Lana Del Rey", "lyricFocus": "Reassuring Guidance / Protective Strength", "energy": 0.48, "valence": 0.55, "lyricDirectness": 0.65},
  {"title": "Good Days", "artist": "SZA", "lyricFocus": "Inner Peace Pursuit / Optimistic Healing", "energy": 0.55, "valence": 0.70, "lyricDirectness": 0.65},
  {"title": "I Hate U", "artist": "SZA", "lyricFocus": "Conflicted Resentment / Toxic Attachment", "energy": 0.58, "valence": 0.25, "lyricDirectness": 0.85},
  {"title": "Saturn", "artist": "SZA", "lyricFocus": "Existential Weariness / Escape Fantasy", "energy": 0.60, "valence": 0.35, "lyricDirectness": 0.70},
  {"title": "Special", "artist": "SZA", "lyricFocus": "Insecurity / Loss of Self-Worth", "energy": 0.38, "valence": 0.20, "lyricDirectness": 0.85},
  {"title": "Supermodel", "artist": "SZA", "lyricFocus": "Raw Insecurity / Revenge Seeking", "energy": 0.45, "valence": 0.25, "lyricDirectness": 0.90},
  {"title": "Normal Girl", "artist": "SZA", "lyricFocus": "Desire for Conformity / Self-Doubt", "energy": 0.50, "valence": 0.35, "lyricDirectness": 0.80},
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
}

SKIP_PROFILE_UPDATE = {
  # already have rich profile — skip re-add (catalog merges via withProfile)
  ("lover", "taylor swift"),
  ("bad guy", "billie eilish"),
}

SKIP_CATALOG_ADD = {
  ("champagne problems", "taylor swift"),
  ("fortnight", "taylor swift"),
  ("style", "taylor swift"),
  ("delicate", "taylor swift"),
  ("lover", "taylor swift"),
  ("apple", "charli xcx"),
  ("360", "charli xcx"),
  ("von dutch", "charli xcx"),
  ("i love you, i'm sorry", "gracie abrams"),
  ("i love you, i'm sorry", "gracie abrams"),  # dup
}


def norm_key(title: str, artist: str) -> tuple[str, str]:
  a = ARTIST_MAP.get(artist.lower().strip(), artist.strip())
  if "feat." in a.lower():
    a = a.split("feat.")[0].strip()
  t = title.strip()
  return t.lower(), a.lower()


def infer_emotion(focus: str, valence: float, energy: float) -> tuple[str, str]:
  f = focus.lower()
  if any(x in f for x in ["anger", "scorn", "indignation", "resentment", "revenge", "betrayal"]):
    return "anger", "resentment"
  if any(x in f for x in ["grief", "heartbreak", "mourning", "loss", "alienation"]):
    return "grief", "longing"
  if any(x in f for x in ["love", "devotion", "intimacy", "romance", "infatuation", "flirt"]):
    return "love", "longing"
  if any(x in f for x in ["anxiety", "fear", "panic", "insecurity", "self-doubt", "imposter"]):
    return "anxiety", "vulnerability"
  if any(x in f for x in ["joy", "cheer", "liberation", "confidence", "pride", "celebration"]):
    return "joy", "confidence"
  if any(x in f for x in ["nostalgia", "memory", "childhood", "growing up"]):
    return "nostalgia", "bittersweet"
  if any(x in f for x in ["healing", "peace", "relief", "warmth"]):
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


def main():
  existing = json.loads(PROFILES_PATH.read_text())
  existing_keys = {(p["title"].lower(), p["artist"].lower()) for p in existing}

  catalog_text = CATALOG_PATH.read_text()
  catalog_keys = set(re.findall(r'title:\s*"([^"]+)"', catalog_text))
  catalog_keys = {(t.lower(), "") for t in catalog_keys}  # artist check separately

  seen = set()
  new_profiles = []
  new_catalog_lines = []
  skipped = []

  for t in RAW:
    key = norm_key(t["title"], t["artist"])
    if key in seen:
      continue
    seen.add(key)

    artist_norm = ARTIST_MAP.get(t["artist"].lower(), t["artist"]).split("feat.")[0].strip()

    if key in SKIP_PROFILE_UPDATE or key in existing_keys:
      skipped.append(f"profile skip: {t['title']} / {artist_norm}")
    else:
      prof = to_profile(t)
      new_profiles.append(prof)
      existing_keys.add(key)

    cat_key = (key[0], key[1])
    if cat_key in SKIP_CATALOG_ADD:
      continue
    # check if title already in catalog for same artist
    if f'title: "{t["title"]}"' in catalog_text or f'title: "{t["title"].lower()}"' in catalog_text:
      # case insensitive title in catalog
      pat = re.compile(rf'title:\s*"{re.escape(t["title"])}"', re.I)
      if pat.search(catalog_text):
        continue
    if artist_norm in catalog_text and t["title"].lower() in catalog_text.lower():
      # rough dup check for known songs
      known_dups = ["champagne problems", "fortnight", "style", "delicate", "lover", "360", "von dutch", "apple"]
      if t["title"].lower() in known_dups:
        continue
    new_catalog_lines.append(catalog_stub(t))

  merged = existing + new_profiles
  PROFILES_PATH.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n")

  # insert catalog entries before closing ];
  insert_marker = "  { title: \"Sofia\", artist: \"Clairo\""
  if insert_marker in catalog_text:
    block = "\n".join(new_catalog_lines) + "\n"
    catalog_text = catalog_text.replace(insert_marker, block + insert_marker)
  else:
    catalog_text = catalog_text.replace("];", "\n".join(new_catalog_lines) + "\n];")

  # extend DemoArtist union
  new_artists = ["Billie Eilish", "Lorde", "Chappell Roan", "Conan Gray", "Phoebe Bridgers", "Frank Ocean"]
  for a in new_artists:
    if f'"{a}"' not in catalog_text.split("RAW_DEMO_TRACKS")[0]:
      catalog_text = catalog_text.replace('| "Clairo";', f'| "Clairo"\n  | "{a}";')

  CATALOG_PATH.write_text(catalog_text)

  print(f"Added {len(new_profiles)} profiles (total {len(merged)})")
  print(f"Added {len(new_catalog_lines)} catalog stubs")
  print("Skipped:", len(skipped))
  for s in skipped[:15]:
    print(" ", s)


if __name__ == "__main__":
  main()
