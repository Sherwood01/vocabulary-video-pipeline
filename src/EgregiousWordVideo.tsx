import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import egregiousConfig from "../data/egregious-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EgregiousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={egregiousConfig as WordConfig} />;
};
