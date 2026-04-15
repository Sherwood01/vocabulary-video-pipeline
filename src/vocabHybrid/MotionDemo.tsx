import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCurrentFrame } from "remotion";
import { getTheme } from "@/themes";
import { shellPadding } from "./theme";

// Demo: 用 Framer Motion + Lucide 替代手写 interpolate
export const MotionHeroDemo: React.FC<{
  word: string;
  subtitle: string;
  themeName?: string;
}> = ({ word, subtitle, themeName }) => {
  const frame = useCurrentFrame();
  const theme = getTheme(themeName);

  // Remotion 里面用 frame 驱动 Framer Motion 的 key，让每一帧都是确定性状态
  // 或者直接用 motion.div 的 initial/animate，靠 duration 和 delay
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center gap-8"
      style={{
        background: `${theme.shellGradient}, ${theme.bg}`,
        color: theme.text,
        fontFamily: "var(--font-body)",
        padding: `${shellPadding.top}px ${shellPadding.x}px ${shellPadding.bottom}px`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: frame >= 10 ? 1 : 0, y: frame >= 10 ? 0 : 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-[120px] font-black tracking-tight"
        style={{ color: theme.pink }}
      >
        {word}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: frame >= 45 ? 1 : 0, y: frame >= 45 ? 0 : 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-[44px] font-bold text-white"
      >
        {subtitle}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: frame >= 80 ? 1 : 0, scale: frame >= 80 ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
        className="mt-4 flex items-center gap-3 rounded-full border px-6 py-3 text-xl font-bold"
        style={{ borderColor: theme.gold, color: theme.gold, background: theme.panel }}
      >
        <Sparkles size={22} />
        <span>这是 Lucide 图标</span>
      </motion.div>
    </div>
  );
};
