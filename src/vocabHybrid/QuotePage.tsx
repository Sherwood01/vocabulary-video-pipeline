import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { getTheme } from "@/themes";
import { shellPadding } from "./theme";

export const QuotePage: React.FC<{
  frame: number;
  beats: readonly { startFrame: number; endFrame: number; text: string }[];
  kicker: string;
  title: string;
  themeName?: string;
  quote: string;
  author: string;
  context: string;
  translation?: string;
}> = ({ frame, beats, kicker, title, themeName, quote, author, context, translation }) => {
  const theme = getTheme(themeName);
  const bQuote = beats[0]?.startFrame ?? 15;
  const bTranslation = beats[1]?.startFrame ?? 60;
  const bAuthor = beats[2]?.startFrame ?? 110;
  const bContext = beats[3]?.startFrame ?? 160;

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

      <div className="flex-1 flex flex-col justify-center gap-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: frame >= bQuote ? 1 : 0, scale: frame >= bQuote ? 1 : 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="self-start rounded-2xl p-5"
          style={{ background: theme.panel, border: `1px solid ${theme.border}` }}
        >
          <Quote size={48} style={{ color: theme.gold }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: frame >= bQuote + 8 ? 1 : 0, y: frame >= bQuote + 8 ? 0 : 30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[48px] font-black leading-tight max-w-[1400px]"
          style={{ color: theme.gold }}
        >
          "{quote}"
        </motion.div>

        {translation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: frame >= bTranslation ? 1 : 0, y: frame >= bTranslation ? 0 : 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[36px] font-bold leading-relaxed max-w-[1200px]"
            style={{ color: theme.text }}
          >
            {translation}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: frame >= bAuthor ? 1 : 0, x: frame >= bAuthor ? 0 : -20 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold"
          style={{ color: theme.pink }}
        >
          — {author}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: frame >= bContext ? 1 : 0, y: frame >= bContext ? 0 : 16 }}
          transition={{ duration: 0.4 }}
          className="text-2xl leading-relaxed max-w-[1200px]"
          style={{ color: theme.muted }}
        >
          {context}
        </motion.div>
      </div>
    </div>
  );
};
