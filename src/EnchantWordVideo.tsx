import React from "react";
import { WordVideoPlayer } from "./pipeline/player";
import enchantConfig from "../data/enchant-draft-with-beats.json";
import type { WordConfig } from "./pipeline/types";

export const EnchantWordVideo: React.FC = () => {
  return <WordVideoPlayer config={enchantConfig as WordConfig} />;
};
