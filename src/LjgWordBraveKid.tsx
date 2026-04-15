import React from "react";
import {Audio} from "@remotion/media";
import {fitText, measureText} from "@remotion/layout-utils";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
  BRAVE_KID_AUDIO,
  BRAVE_KID_CAPTIONS,
  BRAVE_KID_SCENE_BEATS,
  BRAVE_KID_SCENE_FRAMES,
} from "./braveKidNarration";

const COLORS = {
  page: "#f5f5f7",
  pageWarm: "#f8f3ec",
  card: "rgba(255,255,255,0.94)",
  panel: "#ffffff",
  border: "rgba(29,29,31,0.10)",
  borderStrong: "rgba(29,29,31,0.16)",
  ink: "#1d1d1f",
  body: "#4f5968",
  muted: "#8a8f98",
  blue: "#0071e3",
  blueSoft: "rgba(0,113,227,0.10)",
  pink: "#ff5c7a",
  pinkSoft: "rgba(255,92,122,0.10)",
  green: "#0f9d72",
  greenSoft: "rgba(15,157,114,0.10)",
  gold: "#b8822b",
  goldSoft: "rgba(184,130,43,0.12)",
  shadow: "rgba(15, 23, 42, 0.08)",
};

const FONT_PRIMARY = "system-ui";

type Beat = (typeof BRAVE_KID_SCENE_BEATS)[number][number];
type SceneProps = {duration: number};

const sceneStarts = BRAVE_KID_SCENE_FRAMES.map((_, index) =>
  BRAVE_KID_SCENE_FRAMES.slice(0, index).reduce((sum, item) => sum + item, 0),
);

const MAIN_CARD_STYLE: React.CSSProperties = {
  position: "absolute",
  left: 72,
  top: 164,
  width: 936,
  height: 1512,
  padding: 64,
  borderRadius: 40,
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  boxShadow: `0 28px 80px ${COLORS.shadow}`,
  overflow: "hidden",
};

const reveal = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

const rise = (frame: number, start: number, duration = 12, from = 18) =>
  interpolate(frame, [start, start + duration], [from, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

const focus = (frame: number, beat: Beat) =>
  interpolate(frame, [beat.startFrame - 10, beat.startFrame, beat.endFrame, beat.endFrame + 10], [0.76, 1, 1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const floaty = (frame: number, speed: number, range: number) => Math.sin(frame / speed) * range;

const getFitFontSize = ({text, withinWidth, maxFontSize, fontWeight = "700"}: {
  text: string;
  withinWidth: number;
  maxFontSize: number;
  fontWeight?: string;
}) => {
  const {fontSize} = fitText({
    text,
    withinWidth,
    fontFamily: FONT_PRIMARY,
    fontWeight,
  });
  return Math.min(maxFontSize, fontSize);
};

const getTextWidth = ({text, fontSize, fontWeight = "700"}: {text: string; fontSize: number; fontWeight?: string}) =>
  measureText({
    text,
    fontFamily: FONT_PRIMARY,
    fontSize,
    fontWeight,
  }).width;

const PaperBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 16% 8%, rgba(0,113,227,0.07), transparent 20%),
          radial-gradient(circle at 85% 10%, rgba(255,92,122,0.06), transparent 22%),
          radial-gradient(circle at 50% 100%, rgba(184,130,43,0.10), transparent 28%),
          linear-gradient(180deg, ${COLORS.page} 0%, ${COLORS.pageWarm} 100%)`,
      }}
    >
      <div
        className="absolute rounded-full border"
        style={{
          left: 114,
          top: 96 + floaty(frame, 22, 4),
          width: 190,
          height: 74,
          background: "rgba(255,255,255,0.82)",
          borderColor: COLORS.border,
        }}
      />
      <div
        className="absolute rounded-full border"
        style={{
          right: 118,
          top: 118 + floaty(frame + 20, 24, 5),
          width: 214,
          height: 82,
          background: "rgba(255,255,255,0.78)",
          borderColor: COLORS.border,
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;
  const current = BRAVE_KID_CAPTIONS.find((item) => currentMs >= item.startMs && currentMs < item.endMs);
  if (!current) return null;

  const fontSize = getFitFontSize({text: current.text, withinWidth: 780, maxFontSize: 31, fontWeight: "700"});

  return (
    <div className="absolute left-[52px] right-[52px] bottom-9 flex justify-center">
      <Card
        className="max-w-[836px] rounded-[26px] border px-6 py-4 text-center"
        style={{
          background: "rgba(255,255,255,0.94)",
          borderColor: COLORS.border,
          boxShadow: `0 12px 30px ${COLORS.shadow}`,
        }}
      >
        <div style={{fontSize, lineHeight: 1.45, fontWeight: 700, color: COLORS.ink}}>{current.text}</div>
      </Card>
    </div>
  );
};

const SmallLabel: React.FC<{text: string}> = ({text}) => (
  <div className="text-lg font-bold tracking-[2.2px]" style={{color: COLORS.muted}}>{text}</div>
);

const PageShell: React.FC<{kicker: string; title: string; duration: number; children: React.ReactNode; titleMaxFontSize?: number}> = ({kicker, title, duration, children, titleMaxFontSize = 64}) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 0, 10);
  const exit = interpolate(frame, [duration - 12, duration], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 10, duration - 12, duration], [18, 0, 0, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const titleSize = getFitFontSize({text: title, withinWidth: 760, maxFontSize: titleMaxFontSize, fontWeight: "700"});

  return (
    <div className="absolute inset-0" style={{opacity: Math.min(enter, exit), transform: `translateY(${y}px)`}}>
      <div className="pt-1">
        <SmallLabel text={kicker} />
      </div>
      <div
        className="mt-4 font-bold whitespace-nowrap"
        style={{
          fontSize: titleSize,
          lineHeight: 1.08,
          letterSpacing: titleSize >= 50 ? -1.2 : -0.4,
          color: COLORS.ink,
        }}
      >
        {title}
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[196px]">{children}</div>
    </div>
  );
};

const AutoPill: React.FC<{
  text: string;
  beat: Beat;
  frame: number;
  left: number;
  top: number;
  maxWidth: number;
  bg: string;
  color?: string;
}> = ({text, beat, frame, left, top, maxWidth, bg, color = COLORS.ink}) => {
  const fontSize = getFitFontSize({text, withinWidth: maxWidth - 48, maxFontSize: 34, fontWeight: "700"});
  const width = Math.min(maxWidth, Math.ceil(getTextWidth({text, fontSize, fontWeight: "700"})) + 48);
  const shown = reveal(frame, beat.startFrame, 10);
  const y = rise(frame, beat.startFrame, 10, 16);
  const emphasis = focus(frame, beat);

  return (
    <Badge
      variant="outline"
      className="absolute whitespace-nowrap rounded-full border font-bold px-6 py-3.5"
      style={{
        left,
        top,
        width,
        opacity: shown,
        transform: `translateY(${y}px) scale(${0.96 + emphasis * 0.04})`,
        background: bg,
        borderColor: COLORS.borderStrong,
        fontSize,
        lineHeight: 1,
        color,
      }}
    >
      {text}
    </Badge>
  );
};

const QuoteCard: React.FC<{title: string; text: string; beat: Beat; frame: number; style?: React.CSSProperties}> = ({title, text, beat, frame, style}) => {
  const shown = reveal(frame, beat.startFrame, 10);
  const y = rise(frame, beat.startFrame, 10, 18);
  const fontSize = getFitFontSize({text, withinWidth: 280, maxFontSize: 30, fontWeight: "700"});

  return (
    <Card
      className="absolute rounded-[30px] border"
      style={{
        opacity: shown,
        transform: `translateY(${y}px)`,
        background: COLORS.panel,
        borderColor: COLORS.border,
        boxShadow: `0 12px 26px ${COLORS.shadow}`,
        ...style,
      }}
    >
      <CardContent className="p-7">
        <div className="text-xl leading-[1.4] font-bold" style={{color: COLORS.muted}}>{title}</div>
        <div className="mt-5 font-bold" style={{fontSize, lineHeight: 1.5, color: COLORS.ink}}>{text}</div>
      </CardContent>
    </Card>
  );
};

const StepConnector: React.FC<{top: number; height: number; beat: Beat; frame: number}> = ({top, height, beat, frame}) => {
  const shown = reveal(frame, beat.startFrame, 10);
  return (
    <div className="absolute w-9" style={{left: 385, top, opacity: shown}}>
      <div className="w-1 rounded-full mx-auto" style={{height, background: "rgba(29,29,31,0.18)"}} />
      <div
        className="mx-auto -mt-[1px]"
        style={{
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "14px solid rgba(29,29,31,0.22)",
        }}
      />
    </div>
  );
};

const IconBadge: React.FC<{text: string; emoji: string; top: number; beat: Beat; frame: number; bg: string}> = ({text, emoji, top, beat, frame, bg}) => {
  const shown = reveal(frame, beat.startFrame, 10);
  const y = rise(frame, beat.startFrame, 10, 18);
  return (
    <Card
      className="absolute rounded-[30px] border"
      style={{
        left: 0,
        top,
        width: 808,
        height: 240,
        opacity: shown,
        transform: `translateY(${y}px)`,
        background: bg,
        borderColor: COLORS.border,
        boxShadow: `0 12px 26px ${COLORS.shadow}`,
      }}
    >
      <CardContent className="p-7 flex gap-6 h-full items-center">
        <div
          className="w-[90px] h-[90px] rounded-3xl flex items-center justify-center text-[42px] shrink-0"
          style={{background: "rgba(255,255,255,0.70)"}}
        >
          {emoji}
        </div>
        <div className="flex-1">
          <div className="text-[46px] leading-[1.15] font-bold" style={{color: COLORS.ink}}>{text}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const IntroScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const beats = BRAVE_KID_SCENE_BEATS[0];
  const braveSize = getFitFontSize({text: "Brave", withinWidth: 470, maxFontSize: 166, fontWeight: "700"});

  return (
    <PageShell kicker="WORD" title="Brave 是什么" duration={duration} titleMaxFontSize={52}>
      <div className="absolute inset-0">
        <Card
          className="absolute left-0 top-0 w-[808px] h-[352px] rounded-[30px] border"
          style={{
            background: "linear-gradient(135deg, rgba(245,249,253,0.98), rgba(255,255,255,0.90) 64%, rgba(220,233,244,0.52) 100%)",
            borderColor: COLORS.border,
            boxShadow: `0 12px 26px ${COLORS.shadow}`,
            opacity: reveal(frame, beats[0].startFrame, 12),
            transform: `translateY(${rise(frame, beats[0].startFrame, 12, 24)}px)`,
          }}
        >
          <CardContent className="p-9 h-full grid grid-cols-[1.16fr_0.84fr] gap-[26px] items-stretch">
            <div className="flex flex-col justify-between">
              <div>
                <div className="text-lg leading-[1.4] font-bold tracking-widest" style={{color: COLORS.muted}}>ENGLISH WORD</div>
                <div className="mt-2.5 font-bold tracking-[-4px]" style={{fontSize: braveSize, lineHeight: 0.9, color: COLORS.ink}}>Brave</div>
                <div className="mt-[18px] text-[42px] leading-none font-semibold whitespace-nowrap" style={{color: COLORS.muted}}>/breɪv/</div>
              </div>
              <div
                style={{
                  opacity: reveal(frame, beats[1].startFrame, 10),
                  transform: `translateY(${rise(frame, beats[1].startFrame, 10, 16)}px)`,
                }}
              >
                <div
                  className="inline-flex items-center gap-3 rounded-full border px-6 py-4"
                  style={{background: COLORS.blueSoft, borderColor: COLORS.borderStrong}}
                >
                  <div className="text-lg leading-none font-bold tracking-wider" style={{color: COLORS.blue}}>意思</div>
                  <div className="text-[34px] leading-none font-bold" style={{color: COLORS.ink}}>勇敢</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center pl-2.5">
              <div className="text-lg leading-[1.4] font-bold" style={{color: COLORS.muted}}>先抓住最重要的感觉</div>
              <div className="mt-3.5 text-[44px] leading-[1.12] font-bold tracking-[-1.2px]" style={{color: COLORS.ink}}>
                会怕，<br />
                也往前。
              </div>
              <div className="mt-[18px] text-[26px] leading-[1.55] font-bold" style={{color: COLORS.body}}>
                这比“一点都不怕”更接近 brave。
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="absolute left-0 top-[392px] w-[808px] h-[380px] rounded-[30px] border"
          style={{
            background: "rgba(255,255,255,0.88)",
            borderColor: COLORS.border,
            boxShadow: `0 12px 26px ${COLORS.shadow}`,
            opacity: reveal(frame, beats[2].startFrame, 10),
            transform: `translateY(${rise(frame, beats[2].startFrame, 10, 18)}px)`,
          }}
        >
          <CardContent className="p-7 h-full grid grid-cols-[0.82fr_1.18fr] gap-[18px]">
            <div
              className="rounded-[26px] border p-6 flex flex-col justify-between"
              style={{background: COLORS.pinkSoft, borderColor: COLORS.border}}
            >
              <div>
                <div className="text-lg leading-[1.4] font-bold" style={{color: COLORS.muted}}>常见误解</div>
                <div
                  className="mt-4 font-bold"
                  style={{
                    fontSize: getFitFontSize({text: "一点都不怕", withinWidth: 240, maxFontSize: 56, fontWeight: "700"}),
                    lineHeight: 1.04,
                    color: COLORS.pink,
                    textDecoration: "line-through",
                    textDecorationThickness: 8,
                  }}
                >
                  一点都不怕
                </div>
              </div>
              <div className="text-2xl leading-[1.55] font-bold" style={{color: COLORS.body}}>这听起来很猛，但已经偏离 brave 了。</div>
            </div>

            <div
              className="rounded-[26px] border p-6 flex flex-col justify-between"
              style={{
                background: "linear-gradient(180deg, rgba(245,249,253,0.96), rgba(255,255,255,0.94))",
                borderColor: COLORS.border,
              }}
            >
              <div>
                <div className="text-lg leading-[1.4] font-bold" style={{color: COLORS.muted}}>更接近 brave</div>
                <div className="mt-3.5 text-[42px] leading-[1.2] font-bold tracking-[-1px]" style={{color: COLORS.ink}}>
                  心里会怕一下，<br />
                  但还是愿意面对。
                </div>
              </div>
              <div className="grid gap-3">
                <div className="px-[18px] py-4 rounded-[20px] border font-bold" style={{background: "rgba(255,255,255,0.94)", borderColor: COLORS.border, fontSize: 22, lineHeight: 1.45, color: COLORS.body}}>
                  先承认会怕，再决定往前。
                </div>
                <div className="px-[18px] py-4 rounded-[20px] border font-bold" style={{background: COLORS.greenSoft, borderColor: COLORS.border, fontSize: 22, lineHeight: 1.45, color: COLORS.body}}>
                  这才是这页真正该记住的感觉。
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
};

const PictureScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const beats = BRAVE_KID_SCENE_BEATS[1];
  return (
    <PageShell kicker="PICTURE" title="有点怕，也往前" duration={duration}>
      <div className="absolute inset-0">
        <AutoPill text="心里有一点怕" beat={beats[1]} frame={frame} left={0} top={0} maxWidth={260} bg={COLORS.pinkSoft} color={COLORS.pink} />
        <AutoPill text="还是愿意往前走" beat={beats[2]} frame={frame} left={280} top={0} maxWidth={300} bg={COLORS.blueSoft} color={COLORS.blue} />

        <Card
          className="absolute left-0 top-[112px] w-[520px] h-[470px] rounded-[30px] border"
          style={{
            background: "linear-gradient(180deg, rgba(0,113,227,0.03), rgba(255,255,255,0.9))",
            borderColor: COLORS.border,
            boxShadow: `0 12px 26px ${COLORS.shadow}`,
          }}
        >
          <CardContent className="p-[34px]">
            <div className="text-xl leading-[1.4] font-bold" style={{color: COLORS.muted}}>把 brave 想成一个动作</div>
            <div className="mt-7 grid gap-5">
              <Card
                className="relative w-[452px] h-[120px] rounded-[30px] border"
                style={{background: COLORS.pinkSoft, borderColor: COLORS.border, boxShadow: `0 12px 26px ${COLORS.shadow}`}}
              >
                <CardContent className="p-6 text-[34px] leading-[1.32] font-bold" style={{color: COLORS.ink}}>
                  心里会紧一下，<br />但没有停住。
                </CardContent>
              </Card>
              <Card
                className="relative w-[452px] h-[120px] rounded-[30px] border"
                style={{
                  background: COLORS.blueSoft,
                  borderColor: COLORS.border,
                  boxShadow: `0 12px 26px ${COLORS.shadow}`,
                  opacity: reveal(frame, beats[2].startFrame, 10),
                }}
              >
                <CardContent className="p-6 text-[34px] leading-[1.32] font-bold" style={{color: COLORS.ink}}>
                  脚还是往前，<br />先走出一小步。
                </CardContent>
              </Card>
            </div>
            <div
              className="mt-7 text-[30px] leading-[1.45] font-bold"
              style={{color: COLORS.body, opacity: reveal(frame, beats[4].startFrame, 10)}}
            >
              轮到你的时候，<br />也可以先举手试一下。
            </div>
          </CardContent>
        </Card>

        <QuoteCard
          title="孩子可以这样说"
          text="“我有点紧张，但我还是想试一下。”"
          beat={beats[4]}
          frame={frame}
          style={{right: 0, top: 152, width: 252, height: 338, background: COLORS.panel}}
        />
      </div>
    </PageShell>
  );
};

const ExampleScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const beats = BRAVE_KID_SCENE_BEATS[2];

  return (
    <PageShell kicker="EXAMPLE" title="生活里的勇敢" duration={duration}>
      <div className="absolute inset-0">
        <div
          className="text-[34px] leading-[1.42] font-bold"
          style={{color: COLORS.body, opacity: reveal(frame, beats[0].startFrame, 10)}}
        >
          轮到你的时候，<br />
          认真说出口，或走过去帮一把。
        </div>
        <div className="absolute left-0 top-[130px]">
          <IconBadge text="敢说对不起" emoji="💬" top={0} beat={beats[1]} frame={frame} bg={COLORS.pinkSoft} />
          <IconBadge text="愿意站出来帮一把" emoji="🤝" top={272} beat={beats[3]} frame={frame} bg={COLORS.greenSoft} />
        </div>
      </div>
    </PageShell>
  );
};

const FormulaScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const beats = BRAVE_KID_SCENE_BEATS[3];
  return (
    <PageShell kicker="FORMULA" title="勇敢的小公式" duration={duration}>
      <div className="absolute inset-0">
        <div className="absolute left-[395px] top-[126px] w-0.5 h-[612px] rounded-full" style={{background: "rgba(29,29,31,0.08)"}} />
        <div
          className="text-[34px] leading-[1.4] font-bold"
          style={{color: COLORS.body, opacity: reveal(frame, beats[0].startFrame, 10)}}
        >
          你可以这样记：
        </div>
        <AutoPill text="有一点怕" beat={beats[1]} frame={frame} left={212} top={118} maxWidth={380} bg={COLORS.pinkSoft} color={COLORS.pink} />
        <StepConnector top={206} height={72} beat={beats[2]} frame={frame} />
        <AutoPill text="往前一步" beat={beats[2]} frame={frame} left={212} top={302} maxWidth={380} bg={COLORS.blueSoft} color={COLORS.blue} />
        <StepConnector top={390} height={72} beat={beats[3]} frame={frame} />
        <AutoPill text="做对的事" beat={beats[3]} frame={frame} left={212} top={486} maxWidth={380} bg={COLORS.greenSoft} color={COLORS.green} />
        <StepConnector top={574} height={76} beat={beats[4]} frame={frame} />
        <AutoPill text="Brave" beat={beats[4]} frame={frame} left={256} top={674} maxWidth={292} bg={COLORS.goldSoft} color={COLORS.gold} />
      </div>
    </PageShell>
  );
};

const EndingScene: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const beats = BRAVE_KID_SCENE_BEATS[4];
  const quoteSize = getFitFontSize({text: "Brave does not mean no fear.", withinWidth: 710, maxFontSize: 50, fontWeight: "700"});
  return (
    <PageShell kicker="QUOTE" title="记住这句话" duration={duration}>
      <div className="absolute inset-0">
        <Card
          className="absolute left-0 top-0 w-[808px] h-[144px] rounded-[30px] border"
          style={{
            background: COLORS.blueSoft,
            borderColor: COLORS.border,
            boxShadow: `0 12px 26px ${COLORS.shadow}`,
            opacity: reveal(frame, beats[1].startFrame, 10),
            transform: `translateY(${rise(frame, beats[1].startFrame, 10, 16)}px)`,
          }}
        >
          <CardContent className="h-full flex items-center justify-center font-bold whitespace-nowrap tracking-[-0.6px]" style={{fontSize: quoteSize, lineHeight: 1.08, color: COLORS.ink}}>
            Brave does not mean no fear.
          </CardContent>
        </Card>

        <AutoPill text="勇敢不是一点都不怕" beat={beats[2]} frame={frame} left={0} top={214} maxWidth={500} bg="rgba(255,255,255,0.96)" color={COLORS.ink} />
        <Card
          className="absolute left-0 top-[328px] w-[620px] h-[148px] rounded-[30px] border"
          style={{
            background: COLORS.greenSoft,
            borderColor: COLORS.border,
            boxShadow: `0 12px 26px ${COLORS.shadow}`,
            opacity: reveal(frame, beats[3].startFrame, 10),
            transform: `translateY(${rise(frame, beats[3].startFrame, 10, 16)}px)`,
          }}
        >
          <CardContent className="p-7">
            <div className="text-[22px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>真正的 brave</div>
            <div className="mt-3 text-[38px] leading-[1.35] font-bold" style={{color: COLORS.ink}}>
              害怕的时候，<br />
              也愿意做对的事。
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
};

export const LjgWordBraveKid: React.FC = () => {
  const scenes = [IntroScene, PictureScene, ExampleScene, FormulaScene, EndingScene] as const;

  return (
    <AbsoluteFill style={{fontFamily: `${FONT_PRIMARY}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`}}>
      <PaperBackground />
      <div style={MAIN_CARD_STYLE}>
        {scenes.map((SceneComponent, index) => (
          <Sequence key={index} from={sceneStarts[index]} durationInFrames={BRAVE_KID_SCENE_FRAMES[index]}>
            <SceneComponent duration={BRAVE_KID_SCENE_FRAMES[index]} />
            <Audio src={staticFile(BRAVE_KID_AUDIO[index].audio)} />
          </Sequence>
        ))}
      </div>
      <CaptionBar />
    </AbsoluteFill>
  );
};
