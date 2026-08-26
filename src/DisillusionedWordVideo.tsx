import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import disillusionedConfig from "../data/disillusioned-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DisillusionedWordVideo: React.FC = () => {
  return <WordVideoPlayer config={disillusionedConfig as WordConfig} />;
};
