import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import proverbialConfig from "../data/proverbial-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ProverbialWordVideo: React.FC = () => {
  return <WordVideoPlayer config={proverbialConfig as WordConfig} />;
};
