import React from "react";
import {Audio} from "@remotion/media";
import type {Caption} from "@remotion/captions";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

const COLORS = {
  bg: "#0b1020",
  panel: "#141c33",
  soft: "#1b2645",
  border: "rgba(148, 163, 184, 0.22)",
  text: "#edf2ff",
  muted: "#9fb0d8",
  blue: "#6ea8fe",
  cyan: "#63e6ff",
  purple: "#b197fc",
  green: "#8ce99a",
  orange: "#ffb86b",
  pink: "#ff87c2",
};

const FPS = 30;
const SECTION = 102;

const NARRATION_CAPTIONS: Caption[] = [
  {
    text: "Remotion 的核心，不是拖时间轴，",
    startMs: 0,
    endMs: 3600,
    timestampMs: 0,
    confidence: 1,
  },
  {
    text: "而是用 React 组件按帧计算画面。",
    startMs: 3600,
    endMs: 7600,
    timestampMs: 3600,
    confidence: 1,
  },
  {
    text: "你读取当前 frame，用 interpolate 或 spring 算出位置、透明度和缩放。",
    startMs: 7600,
    endMs: 12500,
    timestampMs: 7600,
    confidence: 1,
  },
  {
    text: "然后，Remotion 把每一帧渲染出来，再交给 FFmpeg 编码成视频。",
    startMs: 12500,
    endMs: 17016,
    timestampMs: 12500,
    confidence: 1,
  },
];

const fadeIn = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    easing: Easing.bezier(0.4, 0, 1, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideY = (frame: number, start: number, duration: number, from: number) =>
  interpolate(frame, [start, start + duration], [from, 0], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Shell: React.FC<{ children: React.ReactNode; title: string; kicker: string }> = ({
  children,
  title,
  kicker,
}) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 0, 12);
  return (
    <AbsoluteFill
      className="p-[72px]"
      style={{
        background: `radial-gradient(circle at top left, rgba(110,168,254,0.12), transparent 34%),
          radial-gradient(circle at top right, rgba(177,151,252,0.14), transparent 28%), ${COLORS.bg}`,
        color: COLORS.text,
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="flex justify-between items-center" style={{opacity: titleOpacity}}>
        <div>
          <div className="text-2xl font-bold tracking-wider uppercase" style={{color: COLORS.cyan}}>{kicker}</div>
          <div className="text-[56px] font-extrabold mt-2.5">{title}</div>
        </div>
        <FrameBadge />
      </div>
      <div className="flex-1 flex flex-col mt-9">{children}</div>
    </AbsoluteFill>
  );
};

const FrameBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <Card
      className="rounded-[18px] p-4 min-w-[170px] border"
      style={{background: COLORS.panel, borderColor: COLORS.border}}
    >
      <div className="text-lg mb-1" style={{color: COLORS.muted}}>Scene frame</div>
      <div className="text-[34px] font-extrabold" style={{color: COLORS.green}}>
        {String(frame).padStart(3, "0")}
        <span className="text-muted-foreground text-xl" style={{color: COLORS.muted}}> / {durationInFrames}</span>
      </div>
    </Card>
  );
};

const CaptionBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;
  const currentCaption = NARRATION_CAPTIONS.find(
    (caption) => currentMs >= caption.startMs && currentMs < caption.endMs,
  );

  if (!currentCaption) {
    return null;
  }

  return (
    <div className="absolute left-[120px] right-[120px] bottom-[42px] flex justify-center pointer-events-none">
      <Card
        className="max-w-[1320px] px-7 py-5 rounded-[22px] text-center border backdrop-blur-md"
        style={{
          background: "rgba(8, 12, 24, 0.78)",
          borderColor: COLORS.border,
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-lg mb-1.5 tracking-wider" style={{color: COLORS.cyan}}>中文字幕</div>
        <div className="text-[34px] leading-[1.45] font-bold">{currentCaption.text}</div>
      </Card>
    </div>
  );
};

const NodeBox: React.FC<{ label: string; sub: string; color: string }> = ({ label, sub, color }) => (
  <Card
    className="rounded-3xl p-6 border min-w-[240px]"
    style={{background: "rgba(255,255,255,0.03)", borderColor: COLORS.border}}
  >
    <div className="text-lg font-bold mb-2.5" style={{color}}>{sub}</div>
    <div className="text-[34px] font-extrabold">{label}</div>
  </Card>
);

const Arrow: React.FC<{ color?: string; width?: number }> = ({ color = COLORS.cyan, width = 160 }) => (
  <svg width={width} height={28} viewBox={`0 0 ${width} 28`} fill="none">
    <line x1="0" y1="14" x2={width - 16} y2="14" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d={`M ${width - 28} 4 L ${width - 8} 14 L ${width - 28} 24`} stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = spring({
    fps: FPS,
    frame,
    config: { damping: 18, stiffness: 120 },
  });
  const opacity = fadeIn(frame, 0, 18) * fadeOut(frame, 74, 12);
  const subtitleY = slideY(frame, 8, 16, 28);

  return (
    <Shell kicker="Remotion" title="Remotion 到底怎么工作？">
      <div className="flex-1 flex items-center justify-center">
        <Card
          className="w-[1320px] rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div style={{opacity, transform: `scale(${0.92 + scale * 0.08})`}}>
            <div className="text-[92px] font-black leading-[1.05] max-w-[1120px]">
              它本质上是<span style={{color: COLORS.cyan}}>“用 React 按帧生成视频”</span>
            </div>
            <div
              className="mt-7 text-[34px]"
              style={{color: COLORS.muted, transform: `translateY(${subtitleY}px)`}}
            >
              你写组件、读 frame、算样式。Remotion 把每一帧渲染出来，再交给编码器吐成视频。
            </div>
            <div className="flex gap-4.5 mt-10">
              {[
                ["React 组件", COLORS.blue],
                ["frame 驱动", COLORS.green],
                ["逐帧渲染", COLORS.orange],
                ["FFmpeg 输出", COLORS.purple],
              ].map(([label, color]) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="px-5 py-3.5 rounded-full text-2xl font-bold border"
                  style={{color: color as string, borderColor: COLORS.border, background: "rgba(255,255,255,0.03)"}}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

const CodeToTimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const codeOpacity = fadeIn(local, 0, 14) * fadeOut(local, 76, 10);
  const rightOpacity = fadeIn(local, 10, 16) * fadeOut(local, 78, 10);
  const highlight = Math.min(5, Math.max(0, Math.floor(local / 14)));

  return (
    <Shell kicker="Step 1" title="先写 React 组件，而不是点时间轴">
      <div className="flex gap-[30px] flex-1 items-stretch">
        <div className="flex-[1.1]" style={{opacity: codeOpacity, transform: `translateY(${slideY(local, 0, 14, 24)}px)`}}>
          <Card
            className="h-full rounded-[28px] p-7 border"
            style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
          >
            <div className="text-[26px] mb-4.5" style={{color: COLORS.muted}}>你的代码</div>
            {[
              "const frame = useCurrentFrame();",
              "const x = interpolate(frame, [0, 60], [0, 520]);",
              "const opacity = interpolate(frame, [0, 20], [0, 1]);",
              "return <Panel style={{transform:`translateX(${x}px)`}} />;",
              "",
              "// 每一帧都重新执行一次",
            ].map((line, index) => (
              <div
                key={index}
                className="font-mono text-[28px] leading-[1.7] rounded-[14px] px-3 py-0.5 my-[3px]"
                style={{
                  color: index === highlight || index === highlight - 1 ? COLORS.text : "#7d8db4",
                  background: index === highlight || index === highlight - 1 ? "rgba(99,230,255,0.08)" : "transparent",
                }}
              >
                {line || " "}
              </div>
            ))}
            <div className="mt-5 text-2xl" style={{color: COLORS.muted}}>
              Remotion 不让 CSS transition 当主角。主角是 <span style={{color: COLORS.cyan}}>frame → 数值 → 样式</span>。
            </div>
          </Card>
        </div>

        <div className="flex-[0.9]" style={{opacity: rightOpacity, transform: `translateY(${slideY(local, 8, 16, 28)}px)`}}>
          <Card
            className="h-full rounded-[28px] p-7 border"
            style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
          >
            <div className="text-[26px] mb-6" style={{color: COLORS.muted}}>对应到时间上的结果</div>
            <div className="flex flex-col gap-5">
              <NodeBox label="组件" sub="你声明画面结构" color={COLORS.blue} />
              <div className="flex justify-center"><Arrow width={180} /></div>
              <NodeBox label="帧" sub="每次 render 读取当前 frame" color={COLORS.green} />
              <div className="flex justify-center"><Arrow width={180} color={COLORS.orange} /></div>
              <NodeBox label="样式" sub="位置、透明度、缩放都算出来" color={COLORS.orange} />
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

const FrameEngineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const pulse = spring({ fps: FPS, frame: local, config: { damping: 14, stiffness: 120 } });
  const animatedFrame = Math.max(0, Math.min(89, local));
  const x = interpolate(animatedFrame, [0, 89], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animatedFrame, [0, 18, 89], [0.4, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Shell kicker="Step 2" title="真正驱动动画的，是按帧计算">
      <div className="grid grid-cols-[1.1fr_1fr] gap-[30px] flex-1">
        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="text-[26px] mb-4.5" style={{color: COLORS.muted}}>核心公式</div>
          <div className="text-[58px] font-black leading-[1.2]">frame → interpolate / spring → style</div>
          <div className="mt-4.5 text-[30px] leading-[1.5]" style={{color: COLORS.muted}}>
            每到一个 frame，组件重新跑一遍。你读到当前帧，然后算出 x、opacity、scale 等值。
          </div>
          <div className="mt-7 flex gap-4.5">
            <NodeBox label={`frame ${animatedFrame}`} sub="当前时刻" color={COLORS.green} />
            <NodeBox label={`${Math.round(x)}%`} sub="进度" color={COLORS.cyan} />
            <NodeBox label={opacity.toFixed(2)} sub="透明度" color={COLORS.orange} />
          </div>
        </Card>

        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="text-[26px] mb-4.5" style={{color: COLORS.muted}}>可视化理解</div>
          <div className="flex items-center gap-4.5">
            <div className="text-[30px] w-[200px]" style={{color: COLORS.muted}}>Current frame</div>
            <div
              className="flex-1 h-6 rounded-full overflow-hidden border"
              style={{background: COLORS.soft, borderColor: COLORS.border}}
            >
              <div
                className="h-full rounded-full"
                style={{width: `${x}%`, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.blue})`}}
              />
            </div>
          </div>
          <div
            className="mt-9 h-[270px] rounded-3xl border relative overflow-hidden"
            style={{background: "rgba(255,255,255,0.03)", borderColor: COLORS.border}}
          >
            <div
              className="absolute w-[180px] h-[110px] rounded-[28px]"
              style={{
                left: 80 + x * 8.5,
                top: 90,
                background: COLORS.blue,
                transform: `scale(${0.85 + pulse * 0.15})`,
                boxShadow: `0 0 40px rgba(110,168,254,0.35)`,
                opacity,
              }}
            />
            <div className="absolute left-10 top-7 text-2xl" style={{color: COLORS.muted}}>
              同一个组件，在不同 frame 上会算出不同状态
            </div>
            {[0, 20, 40, 60, 80].map((mark) => (
              <div
                key={mark}
                className="absolute bottom-8 text-[22px] -translate-x-1/2"
                style={{left: 80 + mark * 8.5, color: COLORS.muted}}
              >
                {mark}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
};

const RenderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const reveal = fadeIn(local, 0, 14);
  const filmOffset = interpolate(local, [0, 89], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Shell kicker="Step 3" title="最后才是渲染：把每一帧变成视频">
      <div className="flex flex-col gap-7 flex-1">
        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="flex items-center justify-between" style={{opacity: reveal}}>
            <NodeBox label="React 组件树" sub="声明这个时刻的画面" color={COLORS.blue} />
            <Arrow width={130} />
            <NodeBox label="浏览器渲染" sub="得到这一帧的像素" color={COLORS.green} />
            <Arrow width={130} color={COLORS.orange} />
            <NodeBox label="FFmpeg 编码" sub="拼成 MP4 / WebM" color={COLORS.orange} />
          </div>
          <div className="mt-7 text-[28px] leading-[1.55]" style={{color: COLORS.muted}}>
            Remotion 不会“脑补一整个动画”。它是老老实实把 <span style={{color: COLORS.text}}>每个 frame</span> 都算出来，再交给编码器。
          </div>
        </Card>

        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="text-[26px] mb-4.5" style={{color: COLORS.muted}}>逐帧 film strip</div>
          <div className="flex gap-4.5 overflow-hidden">
            {new Array(7).fill(true).map((_, index) => {
              const shift = filmOffset - index * 24;
              return (
                <div
                  key={index}
                  className="w-[210px] h-[160px] rounded-[22px] border relative overflow-hidden shrink-0"
                  style={{
                    background: COLORS.soft,
                    borderColor: COLORS.border,
                    transform: `translateX(${-shift}px)`,
                  }}
                >
                  <div
                    className="absolute w-[70px] h-[70px] rounded-[20px]"
                    style={{
                      left: 24 + index * 14,
                      top: 48,
                      background: index % 2 === 0 ? COLORS.cyan : COLORS.purple,
                    }}
                  />
                  <div className="absolute left-[18px] top-3.5 text-xl" style={{color: COLORS.muted}}>
                    frame {index * 6}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Shell>
  );
};

const SummaryScene: React.FC = () => {
  const bullets = [
    ["你写的是 React 组件", COLORS.blue],
    ["动画靠 currentFrame + interpolate / spring 驱动", COLORS.green],
    ["每一帧都会重新计算一次画面状态", COLORS.orange],
    ["最终由渲染器 + FFmpeg 产出视频文件", COLORS.purple],
  ] as const;
  const frame = useCurrentFrame();
  const local = frame;

  return (
    <Shell kicker="Summary" title="一句话记住 Remotion">
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-[30px] flex-1">
        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="text-[78px] font-black leading-[1.12]">
            用 <span style={{color: COLORS.cyan}}>React</span>
            <br />
            做 <span style={{color: COLORS.orange}}>按帧渲染</span>
            <br />
            的视频系统。
          </div>
          <div className="mt-7 text-[30px] leading-[1.55]" style={{color: COLORS.muted}}>
            它适合解释视频、模板视频、动态图形，以及一切“可以被代码描述的画面”。
          </div>
        </Card>
        <Card
          className="rounded-[28px] p-7 border"
          style={{background: COLORS.panel, borderColor: COLORS.border, boxShadow: "0 18px 60px rgba(0,0,0,0.28)"}}
        >
          <div className="flex flex-col gap-4.5">
            {bullets.map(([text, color], index) => {
              const opacity = fadeIn(local, 6 + index * 8, 10);
              const y = slideY(local, 6 + index * 8, 10, 18);
              return (
                <div
                  key={text}
                  className="px-5 py-5 rounded-[22px] border flex items-center gap-4"
                  style={{
                    opacity,
                    transform: `translateY(${y}px)`,
                    borderColor: COLORS.border,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{background: color, boxShadow: `0 0 24px ${color}`}}
                  />
                  <div className="text-[28px] leading-[1.45]">{text}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Shell>
  );
};

export const RemotionExplained: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("narration.mp3")} />
      <Sequence durationInFrames={SECTION}>
        <IntroScene />
      </Sequence>
      <Sequence from={SECTION} durationInFrames={SECTION}>
        <CodeToTimelineScene />
      </Sequence>
      <Sequence from={SECTION * 2} durationInFrames={SECTION}>
        <FrameEngineScene />
      </Sequence>
      <Sequence from={SECTION * 3} durationInFrames={SECTION}>
        <RenderScene />
      </Sequence>
      <Sequence from={SECTION * 4} durationInFrames={SECTION}>
        <SummaryScene />
      </Sequence>
      <CaptionBar />
    </AbsoluteFill>
  );
};
