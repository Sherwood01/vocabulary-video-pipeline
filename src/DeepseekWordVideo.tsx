import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import deepseekConfig from "../data/deepseek-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DeepseekWordVideo: React.FC = () => {
  return <WordVideoPlayer config={deepseekConfig as WordConfig} />;
};
