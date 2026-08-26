import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import ubiquitousConfig from "../data/ubiquitous-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const UbiquitousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={ubiquitousConfig as WordConfig} />;
};
