import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import fiascoConfig from "../data/fiasco-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const FiascoWordVideo: React.FC = () => {
  return <WordVideoPlayer config={fiascoConfig as WordConfig} />;
};
