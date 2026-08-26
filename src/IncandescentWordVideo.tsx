import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import incandescentConfig from "../data/incandescent-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const IncandescentWordVideo: React.FC = () => {
  return <WordVideoPlayer config={incandescentConfig as WordConfig} />;
};
