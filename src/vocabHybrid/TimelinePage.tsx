import React from "react";
import { motion } from "framer-motion";
import { getTheme } from "@/themes";
import { shellPadding } from "./theme";

export const TimelinePage: React.FC<{
  frame: number;
  beats: readonly { startFrame: number; endFrame: number; text: string }[];
  kicker: string;
  title: string;
  themeName?: string;
  events: readonly { year: string; label: string; desc: string }[];
}> = ({ frame, beats, kicker, title, themeName, events }) => {
  const theme = getTheme(themeName);

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: `${theme.shellGradient}, ${theme.bg}`,
        color: theme.text,
        fontFamily: "var(--font-body)",
        padding: `${shellPadding.top}px ${shellPadding.x}px ${shellPadding.bottom}px`,
      }}
    >
      <div className="shrink-0">
        <div className="text-[28px] tracking-[0.2em] text-slate-400 font-bold">{kicker}</div>
        <div className="mt-2 text-[84px] font-extrabold leading-[1.15] text-white">{title}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative mt-4">
        <div className="absolute left-[140px] top-6 bottom-6 w-1 rounded-full" style={{ background: theme.border }} />

        <div className="flex flex-col gap-5">
          {events.map((ev, i) => {
            const s = beats[i]?.startFrame ?? 15 + i * 35;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: frame >= s ? 1 : 0, x: frame >= s ? 0 : -30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-8"
              >
                <div
                  className="relative z-10 w-[140px] text-right text-[40px] font-black shrink-0"
                  style={{ color: theme.gold }}
                >
                  {ev.year}
                </div>
                <div
                  className="w-5 h-5 rounded-full border-4 z-10 shrink-0"
                  style={{ background: theme.bg, borderColor: theme.gold }}
                />
                <div
                  className="flex-1 rounded-2xl border px-7 py-4"
                  style={{ background: theme.panel, borderColor: theme.border }}
                >
                  <div className="text-[44px] font-bold text-white leading-tight">{ev.label}</div>
                  <div className="mt-2 text-[36px] leading-[1.3]" style={{ color: theme.muted }}>
                    {ev.desc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
