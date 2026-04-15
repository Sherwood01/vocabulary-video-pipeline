import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  EndingSummaryPage,
  HeroWordPage,
  MeaningClusterPage,
  OriginChainPage,
  StoryIllustrationPage,
} from "./vocabHybrid";
import { VH_COLORS } from "./vocabHybrid";
import {
  SERENDIPITY_AUDIO_PATHS,
  SERENDIPITY_SCENE_BEATS,
  SERENDIPITY_SCENE_FRAMES,
  SERENDIPITY_SCENE_OFFSETS,
  SERENDIPITY_TOTAL_FRAMES,
} from "./serendipityHybridData";

export { SERENDIPITY_TOTAL_FRAMES as SERENDIPITY_V1_TOTAL_FRAMES };

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <HeroWordPage
      frame={frame}
      beats={SERENDIPITY_SCENE_BEATS[0]}
      kicker="一个词，一种感觉"
      title="serendipity"
      word="serendipity"
      subtitle="意外的美好"
      tags={["没在找", "碰见了", "认得出"]}
    />
  );
};

const OriginScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <OriginChainPage
      frame={frame}
      beats={SERENDIPITY_SCENE_BEATS[1]}
      kicker="它的来历"
      title="从一个波斯童话说起"
      nodes={[
        { label: "Serendip", note: "古老的地名", color: VH_COLORS.blue },
        { label: "三个王子", note: "总在意外中发现线索", color: VH_COLORS.gold },
        { label: "意外发现", note: "人们把这种感觉记录下来", color: VH_COLORS.green },
        { label: "serendipity", note: "从这个故事里诞生的词", color: VH_COLORS.pink },
      ]}
      arrowLabel="地名 → 故事 → 词语"
    />
  );
};

const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <MeaningClusterPage
      frame={frame}
      beats={SERENDIPITY_SCENE_BEATS[2]}
      kicker="意义辨析"
      title="它和 lucky 有什么不同"
      leftLabel="lucky"
      leftNote="只是运气好"
      rightLabel="serendipity"
      rightNote="运气 + 会观察"
      bottomText="发现，比遇见更重要"
    />
  );
};

const StoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <StoryIllustrationPage
      frame={frame}
      beats={SERENDIPITY_SCENE_BEATS[3]}
      kicker="一个真实的故事"
      title="弗莱明与青霉素"
      storyItems={[
        { text: "历史上最著名的 serendipity，就是青霉素的发明。", emoji: "💡", emojiLabel: "点题", emojiColor: VH_COLORS.gold },
        { text: "一九二八年，科学家弗莱明忘了盖住一个培养皿，霉菌长了进去。", emoji: "🧪", emojiLabel: "实验室", emojiColor: VH_COLORS.blue },
        { text: "这本该是一次失败的实验。", emoji: "🧫", emojiLabel: "意外", emojiColor: VH_COLORS.pink },
        { text: "但他没有扔掉它，而是认真观察，看出了这种霉菌能杀死细菌。", emoji: "🔬", emojiLabel: "认真观察", emojiColor: VH_COLORS.gold },
        { text: "青霉素，就这样被发现了。", emoji: "🌍", emojiLabel: "改变世界", emojiColor: VH_COLORS.green },
      ]}
      highlight="一次意外 + 一双眼睛 = 改变世界"
    />
  );
};

const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <EndingSummaryPage
      frame={frame}
      beats={SERENDIPITY_SCENE_BEATS[4]}
      kicker="记住它"
      title="serendipity 的三件事"
      formula="serendipity = ?"
      points={[
        { text: "没在找", color: VH_COLORS.blue },
        { text: "碰见了", color: VH_COLORS.green },
        { text: "认得出", color: VH_COLORS.gold },
      ]}
      closing="愿你也能拥有这样一双眼睛"
    />
  );
};

export const SerendipityHybridV1: React.FC = () => {
  const scenes = [HeroScene, OriginScene, CompareScene, StoryScene, EndingScene];

  return (
    <AbsoluteFill>
      {scenes.map((SceneComponent, index) => (
        <Sequence key={index} from={SERENDIPITY_SCENE_OFFSETS[index]} durationInFrames={SERENDIPITY_SCENE_FRAMES[index]}>
          <SceneComponent />
          <Audio src={staticFile(SERENDIPITY_AUDIO_PATHS[index])} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
