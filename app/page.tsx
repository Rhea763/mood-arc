"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import type {
  GenerateResponse,
  RegulationGoalId,
  PlaylistLength,
  ScenarioId,
  TasteChannel,
  TasteResponse,
} from "@/types/music";
import {
  SCENARIOS,
  NEGATIVE_MOODS,
  POSITIVE_MOODS,
  CAUSES,
  getGoalsForMood,
  getRegulationGoalLabel,
  getScenarioLabel,
} from "@/lib/context-catalog";
import {
  PLAYLIST_LENGTH_OPTIONS,
  DEFAULT_PLAYLIST_LENGTH,
} from "@/lib/regulation-goals";
import { NeteasePlayer } from "@/components/netease-player";
import {
  DEMO_KEY,
  isBuildTimeMockDemo,
  isLocalDevHost,
} from "@/lib/demo-mode";
import {
  causesFromCalendarPayload,
  diarySnippetFromPayload,
  moodFromCalendarPayload,
} from "@/lib/calendar-bridge";
import { EMBED_FETCH_HEADERS } from "@/lib/embed-mode";
import { MOODS } from "@/lib/context-catalog";

const VALID_MOODS = new Set<string>(MOODS);

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-stone-500">加载中…</p>
        </main>
      }
    >
      <MoodArcHome />
    </Suspense>
  );
}

function MoodArcHome() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbed = pathname === "/embed" || searchParams.get("embed") === "1";
  const { status, data: session } = useSession();
  const buildTimeMock = isBuildTimeMockDemo();
  const [mockMode, setMockMode] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [isLocalDev, setIsLocalDev] = useState(false);
  const [taste, setTaste] = useState<TasteResponse | null>(null);
  const [tasteLoading, setTasteLoading] = useState(false);
  const [tasteError, setTasteError] = useState<string | null>(null);

  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(
    new Set()
  );
  const [mood, setMood] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [causes, setCauses] = useState<Set<string>>(new Set());
  const [regulationGoal, setRegulationGoal] = useState<RegulationGoalId | null>(
    null
  );
  const [playlistLength, setPlaylistLength] = useState<PlaylistLength>(
    DEFAULT_PLAYLIST_LENGTH
  );

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [calendarDiary, setCalendarDiary] = useState<string[]>([]);

  const availableGoals = mood ? getGoalsForMood(mood) : [];

  const selectMood = (m: string) => {
    setMood(m);
    setResult(null);
    setRegulationGoal((goal) => {
      if (!goal) return null;
      const goals = getGoalsForMood(m);
      return goals.some((g) => g.id === goal) ? goal : null;
    });
  };

  const embedLogin = () => {
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    signIn("google", { callbackUrl });
  };

  const embedLoginNewTab = () => {
    const callbackUrl = encodeURIComponent(
      `${window.location.origin}/embed${window.location.search}`
    );
    window.open(
      `${window.location.origin}/api/auth/signin/google?callbackUrl=${callbackUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const inApp = mockMode
    ? demoActive
    : isEmbed
      ? true
      : status === "authenticated";

  const loadTaste = useCallback(async () => {
    setTasteLoading(true);
    setTasteError(null);
    try {
      const res = await fetch("/api/taste", {
        headers: isEmbed ? EMBED_FETCH_HEADERS : undefined,
      });
      const data = await res.json();
      if (!res.ok) {
        setTasteError(data.error || "加载失败");
        return;
      }
      const tasteData = data as TasteResponse;
      setTaste(tasteData);

      const defaultIds = tasteData.channels
        .filter((c) => c.source === "subscribed" || c.source === "both")
        .slice(0, 3)
        .map((c) => c.id);
      if (defaultIds.length < 3) {
        for (const c of tasteData.channels) {
          if (!defaultIds.includes(c.id) && defaultIds.length < 3) {
            defaultIds.push(c.id);
          }
        }
      }
      setSelectedChannelIds(new Set(defaultIds));
    } catch {
      setTasteError("网络错误，请稍后重试");
    } finally {
      setTasteLoading(false);
    }
  }, [isEmbed]);

  useEffect(() => {
    queueMicrotask(() => setIsLocalDev(isLocalDevHost()));
  }, []);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then(
        (data: {
          mock?: boolean;
          googleConfigured?: boolean;
          hasAuthSecret?: boolean;
          authUrlOk?: boolean;
        }) => {
          setMockMode(Boolean(data.mock));
          setAuthReady(
            Boolean(data.googleConfigured) &&
              Boolean(data.hasAuthSecret) &&
              data.authUrlOk !== false
          );
        }
      )
      .catch(() => setMockMode(buildTimeMock));
  }, [buildTimeMock]);

  useEffect(() => {
    if (!mockMode) return;
    queueMicrotask(() => {
      const stored = localStorage.getItem(DEMO_KEY);
      const onPublicHost = !isLocalDevHost();
      if (isEmbed || stored === "1" || (onPublicHost && stored === null)) {
        setDemoActive(true);
        if (onPublicHost || isEmbed) {
          localStorage.setItem(DEMO_KEY, "1");
        }
      }
    });
  }, [mockMode, isEmbed]);

  useEffect(() => {
    if (!isEmbed) return;

    const applyCalendarPayload = (payload: {
      mood?: string | null;
      tags?: string[];
      happy?: string[];
      sad?: string[];
    }) => {
      const mappedMood = moodFromCalendarPayload(payload);
      if (mappedMood && VALID_MOODS.has(mappedMood)) {
        setMood(mappedMood);
      }
      const mappedCauses = causesFromCalendarPayload(payload);
      if (mappedCauses.length) {
        setCauses(new Set(mappedCauses));
      }
      const diary = diarySnippetFromPayload(payload);
      if (diary.length) setCalendarDiary(diary);
    };

    queueMicrotask(() => {
      const urlMood = searchParams.get("mood");
      if (urlMood && VALID_MOODS.has(urlMood)) {
        setMood(urlMood);
      }
      const urlCauses = searchParams.get("causes");
      if (urlCauses) {
        setCauses(
          new Set(
            urlCauses
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          )
        );
      } else {
        applyCalendarPayload({
          tags: searchParams.get("tags")?.split("|").filter(Boolean),
          happy: searchParams.get("happy")?.split("|").filter(Boolean),
          sad: searchParams.get("sad")?.split("|").filter(Boolean),
        });
      }
    });

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "xinshu-calendar-mood") return;
      applyCalendarPayload(event.data.payload ?? {});
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isEmbed, searchParams]);

  useEffect(() => {
    if (!inApp) return;
    queueMicrotask(() => loadTaste());
  }, [inApp, loadTaste]);

  const enterDemo = () => {
    localStorage.setItem(DEMO_KEY, "1");
    setDemoActive(true);
  };

  const exitDemo = () => {
    localStorage.removeItem(DEMO_KEY);
    setDemoActive(false);
    setTaste(null);
    setResult(null);
    setMood(null);
    setScenario(null);
    setCauses(new Set());
    setRegulationGoal(null);
    setPlaylistLength(DEFAULT_PLAYLIST_LENGTH);
  };

  const toggleChannel = (id: string) => {
    setSelectedChannelIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  };

  const toggleCause = (cause: string) => {
    setCauses((prev) => {
      const next = new Set(prev);
      if (next.has(cause)) next.delete(cause);
      else next.add(cause);
      return next;
    });
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!mood || !taste || !regulationGoal) return;

    const selected = taste.channels.filter((c) =>
      selectedChannelIds.has(c.id)
    );
    if (selected.length === 0) {
      setGenerateError("请至少选择一位艺人");
      return;
    }

    setGenerating(true);
    setGenerateError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isEmbed ? EMBED_FETCH_HEADERS : {}),
        },
        body: JSON.stringify({
          mood,
          scenario: scenario ?? undefined,
          causes: [...causes],
          regulationGoal,
          playlistLength,
          selectedChannelIds: selected.map((c) => c.id),
          selectedChannelNames: selected.map((c) => c.name),
          embed: isEmbed || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error || "生成失败");
        return;
      }
      setResult(data as GenerateResponse);
    } catch {
      setGenerateError("网络错误，请稍后重试");
    } finally {
      setGenerating(false);
    }
  };

  if (mockMode === null || (!mockMode && !isEmbed && status === "loading")) {
    return (
      <main className={`flex flex-1 items-center justify-center p-6 ${isEmbed ? "embed-calendar" : ""}`}>
        <p className={isEmbed ? "text-[#9C6B7A]" : "text-stone-500"}>加载中…</p>
      </main>
    );
  }

  if (!inApp) {
    return (
      <main className={`flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center ${isEmbed ? "embed-calendar" : ""}`}>
        <div className="max-w-md space-y-3">
          <h1 className={`text-4xl font-semibold tracking-tight ${isEmbed ? "text-[#4A2E3B]" : ""}`}>
            {isEmbed ? "心绪歌单" : "MoodArc"}
          </h1>
          <p className={isEmbed ? "text-[#9C6B7A]" : "text-stone-600"}>
            {isEmbed
              ? "根据今天的心情，生成一份带弧线打分的专属歌单。"
              : "说清楚心情和处境，按你的口味生成一份此刻真正需要的歌单。"}
          </p>
          {mockMode && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {isLocalDev ? (
                <>
                  演示模式：无需登录，数据为模拟。本地开发请用
                  <strong> localhost</strong> 打开（与终端端口一致）。
                </>
              ) : (
                <>演示模式：无需登录，数据为模拟，可直接体验。</>
              )}
            </p>
          )}
        </div>
        {mockMode ? (
          <button
            type="button"
            onClick={enterDemo}
            className={`rounded-full px-8 py-3 text-base font-medium text-white transition ${
              isEmbed
                ? "bg-[#B53C4A] hover:bg-[#9a3340]"
                : "bg-stone-900 hover:bg-stone-700"
            }`}
          >
            {isEmbed ? "开始生成歌单" : "进入演示"}
          </button>
        ) : (
          <div className="space-y-3">
            {!authReady && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-left">
                登录配置不完整。请打开{" "}
                <a className="underline" href="/api/config">
                  /api/config
                </a>{" "}
                检查：googleConfigured、hasAuthSecret 应为 true，authUrlOk 应为
                true。AUTH_URL / NEXTAUTH_URL 只能填{" "}
                <code className="text-xs">https://mood-arc.vercel.app</code>
                ，不要填 callback 地址。
              </p>
            )}
            <button
              type="button"
              onClick={() => signIn("google")}
              disabled={!authReady}
              className="rounded-full bg-[#FF0000] px-8 py-3 text-base font-medium text-white transition enabled:hover:bg-[#cc0000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              使用 Google 登录（YouTube）
            </button>
          </div>
        )}
      </main>
    );
  }

  const selectedChannels = taste
    ? taste.channels.filter((c) => selectedChannelIds.has(c.id))
    : [];

  return (
    <main
      className={`mx-auto w-full max-w-lg flex-1 p-5 pb-10 ${
        isEmbed ? "embed-calendar" : ""
      }`}
    >
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${isEmbed ? "text-[#4A2E3B]" : ""}`}>
            {isEmbed ? "心绪歌单" : "MoodArc"}
          </h1>
          {taste && (
            <p className="mt-1 text-sm text-stone-500">
              你好，{taste.user.name}
            </p>
          )}
          {(mockMode || isEmbed) && (
            <p className="mt-2 text-xs text-amber-700">
              {isEmbed && !mockMode
                ? status === "authenticated"
                  ? "心绪日历 · 优先生成 YouTube 歌单，失败自动网易云"
                  : "心绪日历 · 登录后走 YouTube，否则自动网易云试听"
                : !mockMode
                  ? "YouTube 优先 · 配额或失败时自动网易云备选"
                  : "演示模式 · 模拟数据"}
            </p>
          )}
        </div>
        {isEmbed && !mockMode && (
          <div className="flex shrink-0 flex-col items-end gap-1">
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-stone-500 underline-offset-2 hover:underline"
              >
                退出 Google
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={embedLoginNewTab}
                  disabled={!authReady}
                  className="text-sm text-[#B53C4A] underline-offset-2 hover:underline disabled:opacity-50"
                >
                  新窗口登录
                </button>
                <button
                  type="button"
                  onClick={embedLogin}
                  disabled={!authReady}
                  className="text-xs text-stone-400 underline-offset-2 hover:underline disabled:opacity-50"
                >
                  本页登录
                </button>
              </>
            )}
          </div>
        )}
        {!isEmbed && (
          <button
            type="button"
            onClick={() => (mockMode ? exitDemo() : signOut())}
            className="text-sm text-stone-500 underline-offset-2 hover:underline"
          >
            退出
          </button>
        )}
      </header>

      {calendarDiary.length > 0 && isEmbed && (
        <div className="mb-6 rounded-xl border border-[#E8C4C4] bg-[#FFF9F8] p-4">
          <p className="text-xs font-medium text-[#B53C4A] mb-2">
            来自今日心情日记
          </p>
          <ul className="space-y-1 text-sm text-[#4A2E3B]">
            {calendarDiary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {session?.error === "RefreshAccessTokenError" && !mockMode && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Google 登录已失效，请重新登录后再生成 YouTube 歌单。
          <button
            type="button"
            onClick={() => (isEmbed ? embedLoginNewTab() : signIn("google"))}
            className="ml-2 underline"
          >
            重新登录
          </button>
        </div>
      )}

      {tasteLoading && (
        <p className="text-sm text-stone-500">正在加载你的口味…</p>
      )}

      {tasteError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {tasteError}
          <button type="button" onClick={loadTaste} className="ml-2 underline">
            重试
          </button>
        </div>
      )}

      {taste && !tasteLoading && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-medium text-stone-700">
              选择艺人
              <span className="ml-2 font-normal text-stone-400">
                已选 {selectedChannelIds.size}
              </span>
            </h2>
            {taste.channels.length === 0 ? (
              <p className="text-sm text-stone-500">暂无口味数据</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {taste.channels.map((channel: TasteChannel) => {
                  const selected = selectedChannelIds.has(channel.id);
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => toggleChannel(channel.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        selected
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      {channel.name}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-stone-700">
              在什么情境
              <span className="ml-2 font-normal text-stone-400">可选</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setScenario(scenario === s.id ? null : s.id);
                    setResult(null);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    scenario === s.id
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                  title={s.hint}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {scenario && (
              <p className="mt-2 text-xs text-stone-500">
                {SCENARIOS.find((s) => s.id === scenario)?.hint}
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-stone-700">
              今天的心情
            </h2>
            <p className="mb-2 text-xs text-stone-500">偏低落</p>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {NEGATIVE_MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => selectMood(m)}
                  className={`rounded-lg border py-2.5 text-sm font-medium transition ${
                    mood === m
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="mb-2 text-xs text-stone-500">偏积极</p>
            <div className="grid grid-cols-3 gap-2">
              {POSITIVE_MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => selectMood(m)}
                  className={`rounded-lg border py-2.5 text-sm font-medium transition ${
                    mood === m
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-stone-700">
              情境与原因
            </h2>
            <p className="mb-2 text-xs text-stone-500">原因（可选）</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {CAUSES.map((c) => {
                const selected = causes.has(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCause(c)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selected
                        ? "border-stone-600 bg-stone-100 text-stone-900"
                        : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <p className="mb-2 text-xs text-stone-500">
              调节目标（必选）
              {mood && (
                <span className="ml-1 text-stone-400">
                  当前心情：{mood}
                </span>
              )}
            </p>
            {!mood ? (
              <p className="text-xs text-stone-400">请先选择心情</p>
            ) : (
              <div className="space-y-2">
                {availableGoals.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setRegulationGoal(g.id);
                      setResult(null);
                    }}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                      regulationGoal === g.id
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <span className="text-sm font-medium">{g.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        regulationGoal === g.id
                          ? "text-stone-300"
                          : "text-stone-500"
                      }`}
                    >
                      {g.hint}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-stone-700">
              歌单长度
            </h2>
            <div className="flex flex-wrap gap-2">
              {PLAYLIST_LENGTH_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setPlaylistLength(n);
                    setResult(null);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    playlistLength === n
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {n} 首
                </button>
              ))}
            </div>
          </section>

          <div>
            <button
              type="button"
              disabled={
                !mood ||
                !regulationGoal ||
                generating ||
                selectedChannelIds.size === 0
              }
              onClick={handleGenerate}
              className="w-full rounded-full bg-stone-900 py-3 text-base font-medium text-white transition enabled:hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating ? "正在生成…" : "生成歌单"}
            </button>
            {!generating &&
              (!mood || !regulationGoal || selectedChannelIds.size === 0) && (
                <p className="mt-2 text-center text-xs text-stone-500">
                  {!mood
                    ? "请先选择心情，再选调节目标后即可生成"
                    : !regulationGoal
                      ? "请选择调节目标后即可生成"
                      : "请至少选择一位艺人"}
                </p>
              )}
          </div>

          {generateError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {generateError}
            </div>
          )}

          {result && (
            <section className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
              <div>
                <h2 className="font-medium">{result.playlistName}</h2>
                <p className="mt-1 text-sm text-stone-500">
                  心情：{mood}
                  {scenario && ` · 情境：${getScenarioLabel(scenario)}`}
                  {regulationGoal && (
                    <> · 目标：{getRegulationGoalLabel(regulationGoal)}</>
                  )}
                  {` · ${playlistLength} 首`}
                  {causes.size > 0 && ` · 原因：${[...causes].join("、")}`}
                  {selectedChannels.length > 0 &&
                    ` · 艺人：${selectedChannels.map((c) => c.name).join("、")}`}
                </p>
                {result.interpretation && (
                  <p className="mt-2 text-sm text-stone-700 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2 leading-relaxed">
                    {result.interpretation}
                  </p>
                )}
                {result.summary && (
                  <p className="mt-1 text-xs text-amber-700">{result.summary}</p>
                )}
                {result.fallbackReason && (
                  <p className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {result.fallbackReason}
                  </p>
                )}
              </div>

              {result.mock ? (
                <a
                  href={result.playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-[#E60026] py-3 text-center text-base font-medium text-white transition hover:bg-[#c40020]"
                >
                  {result.fallbackReason
                    ? "YouTube 不可用 · 在网易云搜索歌单"
                    : "在网易云音乐中打开"}
                </a>
              ) : (
                <a
                  href={result.playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-[#FF0000] py-3 text-center text-base font-medium text-white transition hover:bg-[#cc0000]"
                >
                  在 YouTube 中打开
                </a>
              )}

              {result.videos.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-stone-700">
                    可播放曲目（{result.videos.length} 首 · 有弧线）
                  </h3>
                  {!result.mock && (
                    <p className="mb-2 text-xs text-stone-500">
                      曲目按弧线打分排序；点击曲名可在 YouTube 打开。
                    </p>
                  )}
                  {result.mock && (
                    <p className="mb-2 text-xs text-stone-500">
                      每首下方可点播放试听；若无法播放可点曲名在网易云打开。
                    </p>
                  )}
                  {result.arcSlots && result.arcSlots.length > 0 ? (
                    <div className="space-y-4">
                      {result.arcSlots.map((slot) => {
                        const phaseVideos = result.videos.filter(
                          (v) => v.phase === slot.id
                        );
                        if (phaseVideos.length === 0) return null;
                        return (
                          <div
                            key={slot.id}
                            className="rounded-lg border border-stone-200 bg-stone-50/80 p-3"
                          >
                            <p className="text-sm font-medium text-stone-800">
                              {slot.label}
                              <span className="ml-2 text-xs font-normal text-stone-500">
                                {slot.hint}
                              </span>
                            </p>
                            <ol className="mt-2 space-y-4 text-sm text-stone-600">
                              {phaseVideos.map((v) => {
                                const i = result.videos.indexOf(v);
                                return (
                                  <li key={v.url + i} className="list-none">
                                    <p>
                                      {i + 1}.{" "}
                                      <a
                                        href={v.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-stone-800 underline-offset-2 hover:underline"
                                        title={
                                          result.mock
                                            ? v.neteaseSongId
                                              ? "在网易云打开单曲页"
                                              : "在网易云搜索该曲"
                                            : "在 YouTube 打开"
                                        }
                                      >
                                        {v.name}
                                      </a>
                                      <span className="text-stone-400">
                                        {" "}
                                        — {v.channel}
                                      </span>
                                      {v.energy != null && v.valence != null && (
                                        <span className="ml-1 text-[10px] text-stone-400">
                                          E{v.energy.toFixed(2)} V
                                          {v.valence.toFixed(2)}
                                          {v.lyricFocusLabel && (
                                            <> · 词{v.lyricFocusLabel}</>
                                          )}
                                          {v.lyricDirectness != null && (
                                            <> D{v.lyricDirectness.toFixed(2)}</>
                                          )}
                                          {v.vocalTimbreLabel && (
                                            <> · 音{v.vocalTimbreLabel}</>
                                          )}
                                        </span>
                                      )}
                                    </p>
                                    {v.neteaseEmbedUrl && (
                                      <NeteasePlayer embedUrl={v.neteaseEmbedUrl} />
                                    )}
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ol className="space-y-4 text-sm text-stone-600">
                      {result.videos.map((v, i) => (
                        <li key={v.url + i} className="list-none">
                          <p>
                            {i + 1}.{" "}
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-800 underline-offset-2 hover:underline"
                            >
                              {v.name}
                            </a>
                            <span className="text-stone-400"> — {v.channel}</span>
                          </p>
                          {v.neteaseEmbedUrl && (
                            <NeteasePlayer embedUrl={v.neteaseEmbedUrl} />
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
