import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import infatuateConfig from "../data/infatuate-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const InfatuateWordVideo: React.FC = () => {
  return <WordVideoPlayer config={infatuateConfig as WordConfig} />;
};
