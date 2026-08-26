import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import confluenceConfig from "../data/confluence-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const ConfluenceWordVideo: React.FC = () => {
  return <WordVideoPlayer config={confluenceConfig as WordConfig} />;
};
