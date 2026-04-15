import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

const COLORS = {
  ink: "#151515",
  muted: "#676b67",
  line: "rgba(21, 21, 21, 0.10)",
  paper: "#f8f5ef",
  pink: "#f4d9df",
  pinkStrong: "#b04b63",
  blue: "#dce9f4",
  blueStrong: "#1e507d",
  green: "#ddeade",
  greenStrong: "#24624a",
  sand: "#e9decd",
  sandStrong: "#8b6330",
  shadow: "0 24px 72px rgba(31, 26, 20, 0.08)",
};

const reveal = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

const rise = (frame: number, start: number, duration = 14, from = 26) =>
  interpolate(frame, [start, start + duration], [from, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const BraveWidePage01: React.FC = () => {
  const frame = useCurrentFrame();
  const heroIn = reveal(frame, 0, 14);
  const meaningIn = reveal(frame, 36, 12);
  const contrastIn = reveal(frame, 84, 14);
  const footerIn = reveal(frame, 132, 12);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "var(--font-body)",
        color: COLORS.ink,
        background: `radial-gradient(circle at 10% 0%, rgba(255,255,255,.88), transparent 28%),
          radial-gradient(circle at 88% 5%, rgba(255,227,212,.68), transparent 24%),
          linear-gradient(180deg, #f4f0e8 0%, #ebe5d8 100%)`,
      }}
    >
      <div
        className="absolute rounded-[24px] overflow-hidden border border-[rgba(21,21,21,0.08)]"
        style={{
          inset: 24,
          background: COLORS.paper,
          boxShadow: COLORS.shadow,
        }}
      >
        <div
          className="absolute w-[172px] h-[62px] left-[58px] top-[42px] rounded-full border border-[rgba(21,21,21,0.04)]"
          style={{background: "rgba(255,255,255,.76)"}}
        />
        <div
          className="absolute w-[224px] h-[70px] right-[52px] top-[58px] rounded-full border border-[rgba(21,21,21,0.04)]"
          style={{background: "rgba(255,255,255,.76)"}}
        />

        <div className="absolute inset-0 px-[68px] pb-[46px] pt-[58px] flex flex-col">
          <div className="text-sm tracking-[0.22em] uppercase font-bold" style={{color: COLORS.muted}}>WORD</div>
          <div className="mt-2.5 text-[60px] leading-[0.98] tracking-[-0.06em] font-extrabold">先认识这个词</div>

          <div
            className="mt-6 grid items-stretch gap-5"
            style={{
              gridTemplateColumns: ".86fr 1.18fr .88fr",
              opacity: heroIn,
              transform: `translateY(${rise(frame, 0, 14, 24)}px)`,
            }}
          >
            <Card
              className="rounded-[28px] border p-6 shadow-[0_12px_32px_rgba(31,26,20,0.05)]"
              style={{
                borderColor: COLORS.line,
                background: `linear-gradient(180deg, #f5f9fd 0%, ${COLORS.blue} 100%)`,
              }}
            >
              <div className="text-[15px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>English Word</div>
              <div className="mt-2.5 text-[88px] leading-[0.92] tracking-[-0.07em] font-extrabold">Brave</div>
              <div className="mt-3.5 text-[32px] leading-none font-semibold text-[#68727f]">/breɪv/</div>
              <div
                className="mt-[18px]"
                style={{
                  opacity: meaningIn,
                  transform: `translateY(${rise(frame, 36, 12, 16)}px)`,
                }}
              >
                <Badge
                  variant="outline"
                  className="inline-flex items-center rounded-full px-5 py-3 min-h-[50px] text-[22px] leading-none font-bold border"
                  style={{
                    color: COLORS.blueStrong,
                    background: "rgba(220,233,244,.94)",
                    borderColor: "rgba(21,21,21,.12)",
                  }}
                >
                  它的意思是：勇敢
                </Badge>
              </div>
            </Card>

            <Card
              className="rounded-[28px] border p-6 shadow-[0_12px_32px_rgba(31,26,20,0.05)]"
              style={{borderColor: COLORS.line, background: "rgba(255,255,255,0.84)"}}
            >
              <div className="text-[15px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>真正的 brave</div>
              <div className="mt-3.5 text-[30px] leading-[1.35] font-bold">
                心里有一点点怕，<br />
                也还是愿意面对。
              </div>
              <div className="grid grid-cols-2 gap-3.5 mt-[18px]">
                <div
                  className="px-4 py-3.5 rounded-[18px] border border-[rgba(21,21,21,0.08)] text-[17px] leading-[1.5] font-bold"
                  style={{background: "rgba(255,255,255,.76)", color: "#3a444d"}}
                >
                  会怕，不等于退缩
                </div>
                <div
                  className="px-4 py-3.5 rounded-[18px] border border-[rgba(21,21,21,0.08)] text-[17px] leading-[1.5] font-bold"
                  style={{background: "rgba(255,255,255,.76)", color: "#3a444d"}}
                >
                  愿意面对，才是关键
                </div>
              </div>
              <Card
                className="rounded-[28px] border p-5 mt-[18px]"
                style={{
                  borderColor: COLORS.line,
                  background: `linear-gradient(180deg, #fcf8f1 0%, ${COLORS.sand} 100%)`,
                }}
              >
                <div className="text-[15px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>一句话先记住</div>
                <div className="mt-2.5 text-2xl leading-[1.45] font-bold">
                  不是一点都不怕，<br />是会怕，也愿意面对。
                </div>
              </Card>
            </Card>

            <div
              className="grid gap-4"
              style={{
                opacity: contrastIn,
                transform: `translateY(${rise(frame, 84, 14, 20)}px)`,
              }}
            >
              <Card
                className="rounded-[28px] border p-[22px] shadow-[0_12px_32px_rgba(31,26,20,0.05)]"
                style={{
                  borderColor: COLORS.line,
                  background: `linear-gradient(180deg, #fbf1f4 0%, ${COLORS.pink} 100%)`,
                }}
              >
                <div className="text-[15px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>不是这样理解</div>
                <div
                  className="mt-2.5 text-[42px] leading-[1.14] tracking-[-0.04em] font-extrabold"
                  style={{
                    color: COLORS.pinkStrong,
                    textDecoration: "line-through",
                    textDecorationThickness: 7,
                  }}
                >
                  一点都不怕
                </div>
              </Card>
              <Card
                className="rounded-[28px] border p-[22px] shadow-[0_12px_32px_rgba(31,26,20,0.05)]"
                style={{
                  borderColor: COLORS.line,
                  background: `linear-gradient(180deg, #f5fbf6 0%, ${COLORS.green} 100%)`,
                }}
              >
                <div className="text-[15px] leading-[1.4] font-bold" style={{color: COLORS.muted}}>更接近的感觉</div>
                <div className="mt-2.5 text-[21px] leading-[1.55] font-bold" style={{color: COLORS.greenStrong}}>
                  会怕一下，<br />但没有躲开。
                </div>
              </Card>
            </div>
          </div>

          <div
            className="mt-auto self-center rounded-full px-6 py-3.5 text-lg leading-[1.3] font-bold"
            style={{
              background: "rgba(255,255,255,.92)",
              border: "1px solid rgba(21,21,21,.10)",
              boxShadow: "0 8px 24px rgba(31,26,20,.06)",
              opacity: footerIn,
              transform: `translateY(${rise(frame, 132, 12, 14)}px)`,
            }}
          >
            可是勇敢，不是一点都不害怕。
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
