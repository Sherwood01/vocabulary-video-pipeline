import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import antithesisConfig from "../data/antithesis-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AntithesisWordVideo: React.FC = () => {
  return <WordVideoPlayer config={antithesisConfig as WordConfig} />;
};
