import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import pragmaticConfig from "../data/pragmatic-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const PragmaticWordVideo: React.FC = () => {
  return <WordVideoPlayer config={pragmaticConfig as WordConfig} />;
};
