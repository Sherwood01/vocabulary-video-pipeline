import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import quintessentialConfig from "../data/quintessential-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const QuintessentialWordVideo: React.FC = () => {
  return <WordVideoPlayer config={quintessentialConfig as WordConfig} />;
};
