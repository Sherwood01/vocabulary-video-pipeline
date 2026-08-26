import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import brainstormingConfig from "../data/brainstorming-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const BrainstormingWordVideo: React.FC = () => {
  return <WordVideoPlayer config={brainstormingConfig as WordConfig} />;
};
