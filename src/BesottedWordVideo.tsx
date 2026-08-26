import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import besottedConfig from "../data/besotted-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BesottedWordVideo: React.FC = () => {
  return <WordVideoPlayer config={besottedConfig as WordConfig} />;
};
