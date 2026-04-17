import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import helloConfig from "../data/hello-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const HelloWordVideo: React.FC = () => {
  return <WordVideoPlayer config={helloConfig as WordConfig} />;
};
