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
  SILHOUETTE_AUDIO_PATHS,
  SILHOUETTE_SCENE_BEATS,
  SILHOUETTE_SCENE_FRAMES,
  SILHOUETTE_SCENE_OFFSETS,
  SILHOUETTE_TOTAL_FRAMES,
} from "./silhouetteHybridData";

export { SILHOUETTE_TOTAL_FRAMES as SILHOUETTE_V1_TOTAL_FRAMES };

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <HeroWordPage
      frame={frame}
      beats={SILHOUETTE_SCENE_BEATS[0]}
      kicker="一种特别的画"
      title="silhouette"
      word="silhouette"
      subtitle="侧面轮廓画"
      tags={["黑色", "侧面", "只留轮廓"]}
    />
  );
};

const OriginScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <OriginChainPage
      frame={frame}
      beats={SILHOUETTE_SCENE_BEATS[1]}
      kicker="它的来历"
      title="一位法国财政部长的名字"
      nodes={[
        { label: "Silhouette", note: "法国财政部长", color: VH_COLORS.blue },
        { label: "紧缩政策", note: "人们讽刺他吝啬", color: VH_COLORS.pink },
        { label: "画家嘲笑", note: "剪黑纸贴侧面轮廓", color: VH_COLORS.gold },
        { label: "silhouette", note: "从大受欢迎到流传至今", color: VH_COLORS.green },
      ]}
      arrowLabel="人名 → 讽刺 → 艺术 → 词语"
    />
  );
};

const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <MeaningClusterPage
      frame={frame}
      beats={SILHOUETTE_SCENE_BEATS[2]}
      kicker="意义辨析"
      title="它和 shadow 有什么不同"
      leftLabel="shadow"
      leftNote="光被挡住的黑影"
      rightLabel="silhouette"
      rightNote="艺术家剪的轮廓"
      bottomText="简洁，也是一种美"
    />
  );
};

const StoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <StoryIllustrationPage
      frame={frame}
      beats={SILHOUETTE_SCENE_BEATS[3]}
      kicker="生活中的 silhouette"
      title="处处都能看见它"
      storyItems={[
        { text: "生活中处处都有 silhouette。", emoji: "💡", emojiLabel: "点题", emojiColor: VH_COLORS.gold },
        { text: "日落时，窗户前站着一个人的黑色轮廓；", emoji: "🪟", emojiLabel: "窗户剪影", emojiColor: VH_COLORS.blue },
        { text: "山顶上，太阳把远山剪成一条黑线。", emoji: "⛰️", emojiLabel: "远山黑线", emojiColor: VH_COLORS.pink },
        { text: "你看不清细节，却觉得特别好看。", emoji: "👁️", emojiLabel: "留白之美", emojiColor: VH_COLORS.gold },
        { text: "这就是 silhouette 的魅力：少即是多。", emoji: "✨", emojiLabel: "少即是多", emojiColor: VH_COLORS.green },
      ]}
      highlight="少即是多"
    />
  );
};

const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <EndingSummaryPage
      frame={frame}
      beats={SILHOUETTE_SCENE_BEATS[4]}
      kicker="记住它"
      title="silhouette 的三件事"
      formula="silhouette = ?"
      points={[
        { text: "黑色", color: VH_COLORS.blue },
        { text: "侧面", color: VH_COLORS.green },
        { text: "只留轮廓", color: VH_COLORS.gold },
      ]}
      closing="愿你在生活中，也能发现这种简洁的美"
    />
  );
};

export const SilhouetteHybridV1: React.FC = () => {
  const scenes = [HeroScene, OriginScene, CompareScene, StoryScene, EndingScene];

  return (
    <AbsoluteFill>
      {scenes.map((SceneComponent, index) => (
        <Sequence key={index} from={SILHOUETTE_SCENE_OFFSETS[index]} durationInFrames={SILHOUETTE_SCENE_FRAMES[index]}>
          <SceneComponent />
          <Audio src={staticFile(SILHOUETTE_AUDIO_PATHS[index])} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
