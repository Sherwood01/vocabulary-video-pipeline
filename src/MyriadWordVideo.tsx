import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import myriadConfig from "../data/myriad-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MyriadWordVideo: React.FC = () => {
  return <WordVideoPlayer config={myriadConfig as WordConfig} />;
};
