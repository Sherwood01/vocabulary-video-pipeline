import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import opportuneConfig from "../data/opportune-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const OpportuneWordVideo: React.FC = () => {
  return <WordVideoPlayer config={opportuneConfig as WordConfig} />;
};
