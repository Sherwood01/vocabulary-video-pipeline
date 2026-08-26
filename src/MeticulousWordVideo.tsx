import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import meticulousConfig from "../data/meticulous-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MeticulousWordVideo: React.FC = () => {
  return <WordVideoPlayer config={meticulousConfig as WordConfig} />;
};
