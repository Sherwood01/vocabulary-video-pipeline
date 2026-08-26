import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import ambivalentConfig from "../data/ambivalent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AmbivalentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={ambivalentConfig as WordConfig} />;
};
