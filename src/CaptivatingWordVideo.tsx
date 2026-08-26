import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import captivatingConfig from "../data/captivating-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const CaptivatingWordVideo: React.FC = () => {
  return <WordVideoPlayer config={captivatingConfig as WordConfig} />;
};
