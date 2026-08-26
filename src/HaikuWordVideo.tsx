import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import haikuConfig from "../data/haiku-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const HaikuWordVideo: React.FC = () => {
  return <WordVideoPlayer config={haikuConfig as WordConfig} />;
};
