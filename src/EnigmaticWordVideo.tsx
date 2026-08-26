import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import enigmaticConfig from "../data/enigmatic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EnigmaticWordVideo: React.FC = () => {
  return <WordVideoPlayer config={enigmaticConfig as WordConfig} />;
};
