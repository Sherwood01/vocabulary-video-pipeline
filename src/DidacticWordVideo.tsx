import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import didacticConfig from "../data/didactic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const DidacticWordVideo: React.FC = () => {
  return <WordVideoPlayer config={didacticConfig as WordConfig} />;
};
