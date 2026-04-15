import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import tariffConfig from "../data/tariff-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const TariffWordVideo: React.FC = () => {
  return <WordVideoPlayer config={tariffConfig as WordConfig} />;
};
