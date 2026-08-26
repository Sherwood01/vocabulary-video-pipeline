import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import massiveConfig from "../data/massive-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const MassiveWordVideo: React.FC = () => {
  return <WordVideoPlayer config={massiveConfig as WordConfig} />;
};
