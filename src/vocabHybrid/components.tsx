import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shellPadding } from "./theme";
import { getTheme } from "@/themes";

export type Beat = { startFrame: number; endFrame: number; text: string };

export const FadeUp: React.FC<{ from?: number; children: React.ReactNode }> = ({ from = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [24, 0]);
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
};

export const reveal = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const rise = (frame: number, start: number, duration = 12, from = 20) =>
  interpolate(frame, [start, start + duration], [from, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const scaleIn = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const Bullet: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div className="flex gap-3 items-start">
    <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-2" style={{ background: color }} />
    <div className="text-2xl leading-relaxed text-slate-50">{children}</div>
  </div>
);

const SyncReveal: React.FC<{
  frame: number;
  startFrame: number;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ frame, startFrame, children, delay = 0, className = "", style }) => {
  const s = startFrame + delay;
  const opacity = reveal(frame, s, 10);
  const y = rise(frame, s, 10, 16);
  return (
    <div className={className} style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};

// Safe beat index resolver: never out-of-bounds, graceful fallback
const getBeatStart = (beats: readonly Beat[], index: number, fallback: number) => {
  if (beats.length === 0) return fallback;
  return beats[Math.min(index, beats.length - 1)]?.startFrame ?? fallback;
};

export const SceneShell: React.FC<{ kicker: string; title: string; themeName?: string; children: React.ReactNode }> = ({
  kicker,
  title,
  themeName,
  children,
}) => {
  const theme = getTheme(themeName);
  return (
    <AbsoluteFill
      className="flex flex-col"
      style={{
        background: `${theme.shellGradient}, ${theme.bg}`,
        color: theme.text,
        fontFamily: "var(--font-body)",
        padding: `${shellPadding.top}px ${shellPadding.x}px ${shellPadding.bottom}px`,
      }}
    >
      <div className="shrink-0">
        <div className="text-lg tracking-[0.2em] text-slate-400 font-bold">{kicker}</div>
        <div className="mt-3 text-5xl font-extrabold leading-tight text-white">{title}</div>
      </div>
      <div className="flex-1 min-h-0 mt-8 relative">{children}</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------
// Scene 1: HeroWord — beats-adaptive
// ------------------------------------------------------------------
export const HeroWordPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  word: string;
  subtitle: string;
  tags: readonly string[];
}> = ({ frame, beats, kicker, title, themeName, word, subtitle, tags }) => {
  const theme = getTheme(themeName);
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);
  const bWord = b(0, 15);
  const bSub = b(1, bWord + 30);
  const tagStarts = tags.map((_, i) => b(2 + i, bSub + 30 + i * 20));

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full flex flex-col items-center justify-center gap-8">
        <SyncReveal frame={frame} startFrame={bWord}>
          <div className="text-[120px] font-black tracking-tight" style={{ color: theme.pink }}>
            {word}
          </div>
        </SyncReveal>
        <SyncReveal frame={frame} startFrame={bSub}>
          <div className="text-[44px] font-bold text-white">{subtitle}</div>
        </SyncReveal>
        <div className="flex gap-4 mt-4">
          {tags.map((tag, i) => {
            const s = tagStarts[i];
            return (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border px-6 py-3 text-xl font-bold"
                style={{
                  background: theme.panel,
                  color: i === 0 ? theme.blue : i === 1 ? theme.green : theme.gold,
                  borderColor: i === 0 ? theme.blue : i === 1 ? theme.green : theme.gold,
                  opacity: reveal(frame, s, 10),
                  transform: `translateY(${rise(frame, s, 10, 12)}px)`,
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// Scene 2: OriginChain — beats-adaptive
// ------------------------------------------------------------------
export const OriginChainPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  nodes: readonly { label: string; note: string; color: string }[];
  arrowLabel: string;
}> = ({ frame, beats, kicker, title, themeName, nodes, arrowLabel }) => {
  const theme = getTheme(themeName);
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full flex flex-col justify-center gap-12">
        <div className="flex items-stretch justify-between gap-4">
          {(nodes || []).map((node, i) => {
            const s = b(i, 15 + i * 40);
            return (
              <React.Fragment key={node.label}>
                <Card
                  className="flex-1 rounded-2xl border p-6 flex flex-col items-center justify-center min-h-[220px]"
                  style={{
                    background: theme.panel,
                    borderColor: node.color,
                    opacity: reveal(frame, s, 12),
                    transform: `translateY(${rise(frame, s, 12, 16)}px) scale(${scaleIn(frame, s, 12)})`,
                  }}
                >
                  <div className="text-3xl font-black text-center" style={{ color: node.color }}>
                    {node.label}
                  </div>
                  <div className="mt-3 text-lg text-slate-400 text-center leading-relaxed">
                    {node.note}
                  </div>
                </Card>
                {i < (nodes || []).length - 1 && (
                  <div className="flex items-center text-2xl font-bold text-slate-500 px-2" style={{ opacity: reveal(frame, s + 10, 10) }}>
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <SyncReveal frame={frame} startFrame={b((nodes || []).length, (b((nodes || []).length - 1, 15) + 30)) + 15} className="text-center">
          <Badge
            variant="outline"
            className="rounded-full border px-8 py-4 text-2xl font-bold"
            style={{ background: theme.panel, color: theme.gold, borderColor: theme.gold }}
          >
            {arrowLabel}
          </Badge>
        </SyncReveal>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// Scene 3: MeaningCompare — beats-adaptive
// ------------------------------------------------------------------
export const MeaningClusterPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  leftLabel: string;
  leftNote: string;
  rightLabel: string;
  rightNote: string;
  bottomText: string;
}> = ({ frame, beats, kicker, title, themeName, leftLabel, leftNote, rightLabel, rightNote, bottomText }) => {
  const theme = getTheme(themeName);
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);
  const bLeft = b(0, 10);
  const bNot = b(1, bLeft + 30);
  const bRight = b(2, bNot + 30);
  const bBottom = b(3, bRight + 30);

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full flex flex-col justify-center gap-10">
        <div className="grid grid-cols-[1fr_0.5fr_1.2fr] gap-6 items-stretch">
          <SyncReveal frame={frame} startFrame={bLeft} className="h-full">
            <Card className="h-full rounded-2xl border p-8 flex flex-col justify-center" style={{ background: theme.panelSoft, borderColor: theme.border }}>
              <div className="text-2xl text-slate-400 font-bold">{leftLabel}</div>
              <div className="mt-4 text-[32px] font-extrabold text-slate-200">{leftNote}</div>
            </Card>
          </SyncReveal>

          <div className="flex items-center justify-center">
            <div
              className="text-5xl font-bold"
              style={{ color: theme.muted, opacity: reveal(frame, bNot, 10), transform: `translateX(${rise(frame, bNot, 10, 20)}px)` }}
            >
              ≠
            </div>
          </div>

          <SyncReveal frame={frame} startFrame={bRight} className="h-full">
            <Card className="h-full rounded-2xl border p-8 flex flex-col justify-center" style={{ background: theme.panel, borderColor: theme.pink }}>
              <div className="text-2xl text-slate-400 font-bold">{rightLabel}</div>
              <div className="mt-4 text-[40px] font-black" style={{ color: theme.pink }}>
                {rightNote}
              </div>
            </Card>
          </SyncReveal>
        </div>

        <SyncReveal frame={frame} startFrame={bBottom} className="text-center">
          <div className="inline-block rounded-2xl border px-10 py-5 text-[36px] font-black" style={{ background: theme.panel, color: theme.gold, borderColor: theme.gold }}>
            {bottomText}
          </div>
        </SyncReveal>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// Scene 4: EmojiStoryboard — beats-adaptive
// ------------------------------------------------------------------
export const StoryIllustrationPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  storyItems: readonly { text: string; emoji: string; emojiLabel: string; emojiColor: string }[];
  highlight: string;
}> = ({ frame, beats, kicker, title, themeName, storyItems, highlight }) => {
  const theme = getTheme(themeName);
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);
  const bHighlight = b(storyItems.length, storyItems.length > 0 ? b(storyItems.length - 1, 15) + 30 : 15);

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full grid grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="flex flex-col gap-5">
          {storyItems.map((item, i) => {
            const s = b(i, 15 + i * 30);
            return (
              <SyncReveal key={i} frame={frame} startFrame={s}>
                <div className="text-[30px] font-bold leading-snug text-white">{item.text}</div>
              </SyncReveal>
            );
          })}
          <SyncReveal frame={frame} startFrame={bHighlight + 6}>
            <div className="mt-2 text-[36px] font-black" style={{ color: theme.green }}>
              {highlight}
            </div>
          </SyncReveal>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {storyItems.map((panel, i) => {
            const s = b(i, 15 + i * 30);
            return (
              <Card
                key={i}
                className="rounded-3xl border p-6 flex flex-col items-center justify-center min-h-[200px]"
                style={{
                  background: theme.panel,
                  borderColor: panel.emojiColor,
                  opacity: reveal(frame, s, 12),
                  transform: `translateY(${rise(frame, s, 12, 16)}px) scale(${scaleIn(frame, s, 12)})`,
                }}
              >
                <div className="text-[64px]">{panel.emoji}</div>
                <div className="mt-3 text-xl font-bold text-center" style={{ color: panel.emojiColor }}>
                  {panel.emojiLabel}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// Scene 5: EndingSummary — beats-adaptive
// ------------------------------------------------------------------
export const EndingSummaryPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  formula: string;
  formulaNote?: string;
  points: readonly { text: string; color: string }[];
  closing: string;
}> = ({ frame, beats, kicker, title, themeName, formula, formulaNote, points, closing }) => {
  const theme = getTheme(themeName);
  const safePoints = points ?? [];
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);
  const bFormula = b(0, 15);
  const pointStarts = safePoints.map((_, i) => b(1 + i, bFormula + 30 + i * 20));
  const bClosing = b(1 + safePoints.length, (pointStarts[safePoints.length - 1] ?? bFormula) + 30);

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full flex flex-col justify-center gap-10">
        <SyncReveal frame={frame} startFrame={bFormula} className="text-center">
          <div
            className="inline-block rounded-3xl border px-12 py-8 text-[52px] font-black"
            style={{ background: theme.panel, color: theme.pink, borderColor: theme.pink }}
          >
            {formula}
          </div>
          {formulaNote && (
            <div className="mt-4 text-[28px] font-bold" style={{ color: theme.muted }}>
              {formulaNote}
            </div>
          )}
        </SyncReveal>

        <div className="grid grid-cols-3 gap-6">
          {safePoints.map((pt, i) => {
            const s = pointStarts[i];
            return (
              <Card
                key={i}
                className="rounded-2xl border p-6 flex flex-col items-center justify-center min-h-[140px]"
                style={{
                  background: theme.panel,
                  borderColor: pt.color,
                  opacity: reveal(frame, s, 10),
                  transform: `translateY(${rise(frame, s, 10, 16)}px)`,
                }}
              >
                <div className="text-[32px] font-black text-center" style={{ color: pt.color }}>
                  {pt.text}
                </div>
              </Card>
            );
          })}
        </div>

        <SyncReveal frame={frame} startFrame={bClosing} className="text-center">
          <div className="text-[36px] font-bold text-white">{closing}</div>
        </SyncReveal>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// ProfileStoryPage — beats-adaptive
// ------------------------------------------------------------------
export const ProfileStoryPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  storyLines: readonly string[];
  highlight: string;
}> = ({ frame, beats, kicker, title, themeName, storyLines, highlight }) => {
  const theme = getTheme(themeName);
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);

  return (
    <SceneShell kicker={kicker} title={title} themeName={themeName}>
      <div className="h-full grid grid-cols-[0.9fr_1.1fr] gap-12 items-center">
        <SyncReveal frame={frame} startFrame={b(0, 15)} className="flex justify-center">
          <div
            className="relative w-[380px] h-[380px] rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(30,41,59,1), rgba(15,23,42,1))`,
              border: `3px solid ${theme.border}`,
              boxShadow: `0 40px 100px rgba(0,0,0,0.5)`,
            }}
          >
            <svg width="220" height="220" viewBox="0 0 200 200" fill="none">
              <path
                d="M140 60c0-30-25-55-55-55S30 30 30 60c0 20 12 38 30 46-25 12-42 38-42 68h124c0-30-17-56-42-68 18-8 30-26 30-46z"
                fill="#0b1220"
                stroke={theme.blue}
                strokeWidth="3"
              />
            </svg>
          </div>
        </SyncReveal>

        <div className="flex flex-col gap-5">
          {storyLines.map((line, i) => {
            const s = b(1 + i, 15 + i * 30);
            return (
              <SyncReveal key={i} frame={frame} startFrame={s}>
                <div className="text-[30px] font-bold leading-snug text-white">{line}</div>
              </SyncReveal>
            );
          })}
          <SyncReveal frame={frame} startFrame={b(1 + storyLines.length, (b(storyLines.length, 15) + 20))}>
            <div className="mt-3 text-[36px] font-black" style={{ color: theme.gold }}>
              {highlight}
            </div>
          </SyncReveal>
        </div>
      </div>
    </SceneShell>
  );
};

// ------------------------------------------------------------------
// FullScreenMoodPage — beats-adaptive
// ------------------------------------------------------------------
export const FullScreenMoodPage: React.FC<{
  frame: number;
  beats: readonly Beat[];
  kicker: string;
  title: string;
  themeName?: string;
  moodLines?: readonly string[];
  lines?: readonly { text: string; size?: string }[] | readonly string[];
  centerEmoji?: string;
  bottomQuote?: string;
  backgroundGradient?: string;
}> = ({ frame, beats, kicker, title, themeName, moodLines, lines, centerEmoji = "✨", bottomQuote = "", backgroundGradient }) => {
  const theme = getTheme(themeName);
  const resolvedLines: readonly string[] = React.useMemo(() => {
    if (moodLines && moodLines.length > 0) return moodLines;
    if (!lines) return [];
    if (lines.length > 0 && typeof lines[0] === "string") return lines as string[];
    return (lines as { text: string }[]).map((l) => l.text);
  }, [moodLines, lines]);
  const bg = backgroundGradient ?? theme.moodGradient;
  const b = (i: number, fallback: number) => getBeatStart(beats, i, fallback);
  const bCenter = b(resolvedLines.length, b(resolvedLines.length - 1, 15) + 30);
  const bQuote = b(resolvedLines.length + 1, bCenter + 30);

  return (
    <AbsoluteFill
      className="flex flex-col justify-between"
      style={{
        background: bg,
        padding: `${shellPadding.top}px ${shellPadding.x}px ${shellPadding.bottom}px`,
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="shrink-0">
        <div className="text-lg tracking-[0.2em] text-slate-300 font-bold">{kicker}</div>
        <div className="mt-3 text-5xl font-extrabold leading-tight text-white">{title}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
        <div className="flex flex-col gap-4 text-center max-w-[1100px]">
          {resolvedLines.map((line, i) => {
            const s = b(i, 15 + i * 30);
            return (
              <SyncReveal key={i} frame={frame} startFrame={s}>
                <div className="text-[36px] font-bold leading-snug text-white/95">{line}</div>
              </SyncReveal>
            );
          })}
        </div>

        <SyncReveal frame={frame} startFrame={bCenter} className="mt-4">
          <div
            className="text-[140px]"
            style={{
              filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))",
              opacity: reveal(frame, bCenter, 16),
              transform: `scale(${scaleIn(frame, bCenter, 16)})`,
            }}
          >
            {centerEmoji}
          </div>
        </SyncReveal>
      </div>

      {bottomQuote && (
        <SyncReveal frame={frame} startFrame={bQuote} className="text-center pb-4">
          <div
            className="inline-block rounded-2xl border px-10 py-5 text-[44px] font-black"
            style={{
              color: theme.gold,
              borderColor: theme.gold,
              background: "rgba(15,23,42,0.65)",
              backdropFilter: "blur(8px)",
            }}
          >
            {bottomQuote}
          </div>
        </SyncReveal>
      )}
    </AbsoluteFill>
  );
};
