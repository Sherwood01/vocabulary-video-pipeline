import React from "react";
import { Audio, staticFile, interpolate } from "remotion";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENE_REGISTRY } from "./registry";
import { SceneConfig, WordConfig } from "./types";

const TransitionOverlay: React.FC<{ duration?: number }> = ({ duration = 12 }) => {
  const frame = useCurrentFrame();
  const opacity =
    frame < duration
      ? interpolate(frame, [0, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  if (opacity <= 0) return null;
  return <div className="absolute inset-0 bg-[#020617]" style={{ opacity, pointerEvents: "none" }} />;
};

const SceneWrapper: React.FC<{ scene: SceneConfig; audioPath: string; themeName?: string; index: number }> = ({
  scene,
  audioPath,
  themeName,
  index,
}) => {
  const frame = useCurrentFrame();
  const Component = SCENE_REGISTRY[scene.type];
  return (
    <AbsoluteFill>
      <Component frame={frame} beats={scene.beats} themeName={themeName} {...scene.props} />
      <Audio src={staticFile(audioPath)} />
      {index > 0 && <TransitionOverlay duration={12} />}
    </AbsoluteFill>
  );
};

export const WordVideoPlayer: React.FC<{ config: WordConfig }> = ({ config }) => {
  const { scenes, audioPrefix, theme } = config;

  const sceneDurations = scenes.map((scene) => {
    if (!scene.beats || scene.beats.length === 0) return 300;
    const maxEndFrame = Math.max(...scene.beats.map((b) => b.endFrame));
    return maxEndFrame + 25;
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.map((scene, index) => (
          <React.Fragment key={index}>
            <TransitionSeries.Sequence durationInFrames={sceneDurations[index]}>
              <SceneWrapper
                scene={scene}
                audioPath={`${audioPrefix}/scene${index + 1}.mp3`}
                themeName={theme}
                index={index}
              />
            </TransitionSeries.Sequence>
            {index < scenes.length - 1 && (
              <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: 12 })}
                presentation={fade()}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
