import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import amiableConfig from "../data/amiable-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const AmiableWordVideo: React.FC = () => {
  return <WordVideoPlayer config={amiableConfig as WordConfig} />;
};
