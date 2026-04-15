import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeUp, Bullet, SceneShell, VH_COLORS } from "./vocabHybrid";
import { HYBRID_SCENES, HYBRID_TOTAL_FRAMES, MANIM_CLIPS } from "./serendipityHybridData";

const frameOffsets = {
  hero: 0,
  split: HYBRID_SCENES.hero,
  manim: HYBRID_SCENES.hero + HYBRID_SCENES.split,
  pipeline: HYBRID_SCENES.hero + HYBRID_SCENES.split + HYBRID_SCENES.manim,
};

const HeroScene: React.FC = () => {
  return (
    <SceneShell kicker="Vocabulary video · hybrid mode" title="Remotion 做主壳，Manim 做特种镜头">
      <FadeUp>
        <Card
          className="absolute inset-0 rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-11 flex flex-col justify-between"
          style={{ borderColor: VH_COLORS.border }}
        >
          <div className="flex justify-between items-start gap-8">
            <div className="max-w-[760px]">
              <div className="text-[34px] font-bold leading-tight">
                目标不再是“把所有东西都硬塞进一个引擎里”。
              </div>
              <div className="mt-6 text-[28px] leading-relaxed text-slate-400">
                页面约束、组件系统、字幕与节奏交给 Remotion。需要特殊变形、物体运动、精致示意时，再把 Manim 当成特种片段插进来。
              </div>
            </div>
            <div className="w-[360px] grid gap-4">
              <Card className="rounded-[28px] border bg-[#0f141c] py-0" style={{ borderColor: VH_COLORS.blue }}>
                <CardContent className="p-5">
                  <div className="text-lg text-slate-400">主框架</div>
                  <div className="text-[34px] font-extrabold" style={{ color: VH_COLORS.blue }}>Remotion</div>
                </CardContent>
              </Card>
              <Card className="rounded-[28px] border bg-[#0f141c] py-0" style={{ borderColor: VH_COLORS.pink }}>
                <CardContent className="p-5">
                  <div className="text-lg text-slate-400">特种能力</div>
                  <div className="text-[34px] font-extrabold" style={{ color: VH_COLORS.pink }}>Manim</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {[
              ["布局约束", VH_COLORS.blue],
              ["组件复用", VH_COLORS.green],
              ["特种动画", VH_COLORS.pink],
              ["beat 同步", VH_COLORS.gold],
            ].map(([label, color]) => (
              <Badge
                key={label}
                variant="outline"
                className="rounded-[28px] border px-5 py-3.5 text-2xl font-bold bg-[#0f141c]"
                style={{ color: color as string, borderColor: color as string }}
              >
                {label}
              </Badge>
            ))}
          </div>
        </Card>
      </FadeUp>
    </SceneShell>
  );
};

const SplitScene: React.FC = () => {
  return (
    <SceneShell kicker="System split" title="把职责拆开，版式才会稳">
      <div className="grid grid-cols-2 gap-7 h-full">
        <FadeUp>
          <Card
            className="h-full rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-9"
            style={{ borderColor: VH_COLORS.blue }}
          >
            <div className="text-[22px] text-slate-400 font-bold">Remotion 负责</div>
            <div className="text-[42px] text-blue-400 font-extrabold mt-2.5">页面主壳</div>
            <div className="grid gap-4 mt-8">
              <Bullet color={VH_COLORS.blue}>panel / stack / cluster / safe area</Bullet>
              <Bullet color={VH_COLORS.blue}>字幕、标题、卡片、图式约束</Bullet>
              <Bullet color={VH_COLORS.blue}>数据驱动、模板化、批量生成</Bullet>
            </div>
          </Card>
        </FadeUp>
        <FadeUp from={8}>
          <Card
            className="h-full rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-9"
            style={{ borderColor: VH_COLORS.pink }}
          >
            <div className="text-[22px] text-slate-400 font-bold">Manim 负责</div>
            <div className="text-[42px] font-extrabold mt-2.5" style={{ color: VH_COLORS.pink }}>特种镜头</div>
            <div className="grid gap-4 mt-8">
              <Bullet color={VH_COLORS.pink}>特殊变形、示意动画、路径运动</Bullet>
              <Bullet color={VH_COLORS.pink}>复杂关系图的一次性高表达片段</Bullet>
              <Bullet color={VH_COLORS.pink}>渲成 clip，再嵌回 Remotion 时间线</Bullet>
            </div>
          </Card>
        </FadeUp>
      </div>
    </SceneShell>
  );
};

const ManimBridgeScene: React.FC = () => {
  return (
    <SceneShell kicker="Special shot bridge" title="Manim 片段作为可插拔素材接进来">
      <div className="grid gap-7 h-full" style={{ gridTemplateColumns: "1.15fr 0.85fr" }}>
        <FadeUp>
          <Card
            className="h-full rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-5"
            style={{ borderColor: VH_COLORS.purple }}
          >
            <div className="text-lg text-slate-400 mb-4">示例：直接嵌入 serendipity 的 Manim 词源镜头</div>
            <div className="relative w-full h-[520px] overflow-hidden rounded-[22px] border" style={{ borderColor: VH_COLORS.border }}>
              <OffthreadVideo
                src={staticFile(MANIM_CLIPS.origin)}
                className="w-full h-full object-cover"
                startFrom={0}
                endAt={180}
                muted
              />
            </div>
          </Card>
        </FadeUp>
        <FadeUp from={10}>
          <Card
            className="h-full rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-8"
            style={{ borderColor: VH_COLORS.border }}
          >
            <div className="text-lg text-slate-400">接入方式</div>
            <div className="mt-3 text-[38px] font-extrabold">不是重写，而是嵌入</div>
            <div className="grid gap-4 mt-7">
              <Bullet color={VH_COLORS.green}>React 里把 clip 当普通视频组件使用</Bullet>
              <Bullet color={VH_COLORS.gold}>外层照样受页面网格、字幕区、安全区约束</Bullet>
              <Bullet color={VH_COLORS.purple}>只有难动画那一小段交给 Manim 发挥</Bullet>
            </div>
            <Card
              className="rounded-[28px] border bg-[#131a24] mt-7 py-4 px-5"
              style={{ borderColor: VH_COLORS.green }}
            >
              <div className="text-lg text-slate-400">一句话</div>
              <div className="text-[28px] text-slate-50 leading-relaxed mt-2">
                用 Remotion 管“版式系统”，用 Manim 管“高表达镜头”。
              </div>
            </Card>
          </Card>
        </FadeUp>
      </div>
    </SceneShell>
  );
};

const PipelineScene: React.FC = () => {
  const steps = [
    ["1", "word data", VH_COLORS.blue],
    ["2", "Remotion layout", VH_COLORS.green],
    ["3", "Manim special clip", VH_COLORS.pink],
    ["4", "final edit", VH_COLORS.gold],
  ] as const;

  return (
    <SceneShell kicker="Production path" title="下一版就按这条流水线做">
      <FadeUp>
        <Card
          className="h-full rounded-[28px] border bg-[#0f141c] text-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.28)] p-9"
          style={{ borderColor: VH_COLORS.border }}
        >
          <div className="grid grid-cols-4 gap-4 items-center">
            {steps.map(([index, label, color], i) => (
              <React.Fragment key={label}>
                <Card
                  className="rounded-[28px] border bg-[#0f141c] p-6 min-h-[170px] grid content-between"
                  style={{ borderColor: color }}
                >
                  <div className="text-lg text-slate-400">Step {index}</div>
                  <div className="text-[30px] font-extrabold" style={{ color }}>{label}</div>
                </Card>
                {i < steps.length - 1 ? (
                  <div className="h-[3px] bg-white/10 -mx-2" />
                ) : null}
              </React.Fragment>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Card className="rounded-[28px] border bg-[#0f141c] p-6" style={{ borderColor: VH_COLORS.border }}>
              <div className="text-xl text-slate-400">当前这个 prototype 已经证明</div>
              <div className="mt-3.5 grid gap-3 text-[26px] leading-normal">
                <div>• Remotion 可以接住 vocabulary 页面的版式约束</div>
                <div>• Manim 片段可以作为特种素材嵌进来</div>
                <div>• 混合模式可继续长成真正模板系统</div>
              </div>
            </Card>
            <Card className="rounded-[28px] border bg-[#0f141c] p-6" style={{ borderColor: VH_COLORS.purple }}>
              <div className="text-xl text-slate-400">下一步最值得做</div>
              <div className="mt-3.5 grid gap-3 text-[26px] leading-normal">
                <div>• `OriginChain` React 组件</div>
                <div>• `MeaningCluster` React 组件</div>
                <div>• `ManimClipSlot` + beat-aware 时间线</div>
              </div>
            </Card>
          </div>
        </Card>
      </FadeUp>
    </SceneShell>
  );
};

export const VocabularyHybridPrototype: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={frameOffsets.hero} durationInFrames={HYBRID_SCENES.hero}>
        <HeroScene />
      </Sequence>
      <Sequence from={frameOffsets.split} durationInFrames={HYBRID_SCENES.split}>
        <SplitScene />
      </Sequence>
      <Sequence from={frameOffsets.manim} durationInFrames={HYBRID_SCENES.manim}>
        <ManimBridgeScene />
      </Sequence>
      <Sequence from={frameOffsets.pipeline} durationInFrames={HYBRID_SCENES.pipeline}>
        <PipelineScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export { HYBRID_TOTAL_FRAMES };
