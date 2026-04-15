import React from "react";
import { motion } from "framer-motion";
import { getTheme } from "@/themes";
import { shellPadding } from "./theme";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const AnswerCardsPage: React.FC<{
  frame: number;
  beats: readonly { startFrame: number; endFrame: number; text: string }[];
  kicker: string;
  title: string;
  themeName?: string;
  question: string;
  cards: readonly {
    number: string;
    icon: keyof typeof Icons;
    headline: string;
    body: string;
    color?: string;
  }[];
}> = ({ frame, beats, kicker, title, themeName, question, cards }) => {
  const theme = getTheme(themeName);

  const bQuestion = beats[0]?.startFrame ?? 10;
  const cardStarts = cards.map((_, i) => beats[1 + i]?.startFrame ?? 50 + i * 40);

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
        <div className="text-lg tracking-[0.2em] text-slate-400 font-bold">{kicker}</div>
        <div className="mt-3 text-5xl font-extrabold leading-tight text-white">{title}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: frame >= bQuestion ? 1 : 0, y: frame >= bQuestion ? 0 : 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div
            className="inline-block rounded-2xl border px-10 py-5 text-[32px] font-black"
            style={{ background: theme.panel, color: theme.gold, borderColor: theme.gold }}
          >
            {question}
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 items-stretch">
          {cards.map((card, i) => {
            const s = cardStarts[i];
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[card.icon] || Icons.Circle;
            const color = card.color || theme.blue;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{
                  opacity: frame >= s ? 1 : 0,
                  y: frame >= s ? 0 : 40,
                  scale: frame >= s ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0 }}
                className="rounded-3xl border p-6 flex flex-col"
                style={{ background: theme.panel, borderColor: color }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-black" style={{ color }}>
                    {card.number}
                  </div>
                  <div className="rounded-xl p-3" style={{ background: `${color}20` }}>
                    <Icon size={28} color={color} />
                  </div>
                </div>
                <div className="mt-5 text-2xl font-bold text-white leading-snug">{card.headline}</div>
                <div className="mt-3 text-lg leading-relaxed" style={{ color: theme.muted }}>
                  {card.body}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
