import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { QuotePage } from "./vocabHybrid/QuotePage";
import { TimelinePage } from "./vocabHybrid/TimelinePage";

const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <QuotePage
      frame={frame}
      beats={[
        { startFrame: 10, endFrame: 60, text: "\"Beautiful things don't ask for attention.\"" },
        { startFrame: 70, endFrame: 110, text: "— James Thurber" },
        { startFrame: 120, endFrame: 170, text: "这正是 beautiful 的深意：不张扬，却能打动人心。" },
      ]}
      kicker="Quote"
      title="一句关于 beautiful 的话"
      themeName="midnight"
      quote="Beautiful things don't ask for attention."
      author="James Thurber"
      context="这正是 beautiful 的深意：不张扬，却能打动人心。"
    />
  );
};

const TimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <TimelinePage
      frame={frame}
      beats={[
        { startFrame: 10, endFrame: 50, text: "13 世纪：古法语诞生" },
        { startFrame: 60, endFrame: 100, text: "18 世纪：进入英语" },
        { startFrame: 110, endFrame: 160, text: "现代：从外表到内心" },
      ]}
      kicker="Timeline"
      title="beautiful 的时间线"
      themeName="galaxy"
      events={[
        { year: "1200s", label: "古法语词根", desc: "从 bel 'fine' 和动词 beauter '使美丽' 演变而来" },
        { year: "1500s", label: "早期英语", desc: "最早记载于 15 世纪，专指外表的美丽" },
        { year: "1800s", label: "意义扩展", desc: "开始用于形容道德、智慧、情感等内在之美" },
      ]}
    />
  );
};

export const NewTemplatesDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={200}>
        <QuoteScene />
      </Sequence>
      <Sequence from={200} durationInFrames={200}>
        <TimelineScene />
      </Sequence>
    </AbsoluteFill>
  );
};
