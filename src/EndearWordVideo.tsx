import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import endearConfig from "../data/endear-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EndearWordVideo: React.FC = () => {
  return <WordVideoPlayer config={endearConfig as WordConfig} />;
};
