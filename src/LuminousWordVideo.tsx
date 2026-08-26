import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import luminousConfig from "../data/luminous-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const LuminousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={luminousConfig as WordConfig} />;
};
