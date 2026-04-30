import "./index.css";
import { Composition } from "remotion";
import { BRAVE_KID_TOTAL_FRAMES } from "./braveKidNarration";
import { BraveWidePage01 } from "./BraveWidePage01";
import { LjgWordBraveKid } from "./LjgWordBraveKid";
import { RemotionExplained } from "./RemotionExplained";
import { HYBRID_TOTAL_FRAMES, VocabularyHybridPrototype } from "./VocabularyHybridPrototype";
import { SERENDIPITY_V1_TOTAL_FRAMES, SerendipityHybridV1 } from "./SerendipityHybridV1";
import { SILHOUETTE_V1_TOTAL_FRAMES, SilhouetteHybridV1 } from "./SilhouetteHybridV1";
import { WordVideoPlayer } from "./pipeline/player";
import { BeautifulWordVideo } from "./BeautifulWordVideo";
import { BreakfastWordVideo } from "./BreakfastWordVideo";
import { LemonadeWordVideo } from "./LemonadeWordVideo";
import { TariffWordVideo } from "./TariffWordVideo";
import { SpacewalkWordVideo } from "./SpacewalkWordVideo";
import type { WordConfig } from "./pipeline/types";
import { SerendipityWordVideo } from "./SerendipityWordVideo";
import { EarthquakeWordVideo } from "./EarthquakeWordVideo";
import { MysteryWordVideo } from "./MysteryWordVideo";
import { WisdomWordVideo } from "./WisdomWordVideo";
import { SolutionWordVideo } from "./SolutionWordVideo";
import { DeepseekWordVideo } from "./DeepseekWordVideo";
import { LightWordVideo } from "./LightWordVideo";
import { GravityWordVideo } from "./GravityWordVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RemotionExplained"
        component={RemotionExplained}
        durationInFrames={510}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BraveWidePage01"
        component={BraveWidePage01}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LjgWordBraveKid"
        component={LjgWordBraveKid}
        durationInFrames={BRAVE_KID_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="VocabularyHybridPrototype"
        component={VocabularyHybridPrototype}
        durationInFrames={HYBRID_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SerendipityHybridV1"
        component={SerendipityHybridV1}
        durationInFrames={SERENDIPITY_V1_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SilhouetteHybridV1"
        component={SilhouetteHybridV1}
        durationInFrames={SILHOUETTE_V1_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BeautifulWordVideo"
        component={BeautifulWordVideo}
        durationInFrames={3180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BreakfastWordVideo"
        component={BreakfastWordVideo}
        durationInFrames={3522}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LemonadeWordVideo"
        component={LemonadeWordVideo}
        durationInFrames={3911}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TariffWordVideo"
        component={TariffWordVideo}
        durationInFrames={1717}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WordVideo"
        component={(props: WordConfig) => <WordVideoPlayer config={props} />}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => {
          const total = (props.scenes || []).reduce((sum, s) => {
            const last = s.beats?.[s.beats.length - 1];
            return sum + (last ? last.endFrame + 5 : 300);
          }, 0);
          return { durationInFrames: Math.max(300, total) };
        }}
        defaultProps={{
          word: "cascade",
          title: "Cascade",
          theme: "midnight",
          fps: 30,
          audioPrefix: "cascade-audio-v1",
          scenes: [],
        }}
      />
<Composition
        id="SpacewalkWordVideo"
        component={SpacewalkWordVideo}
        durationInFrames={4346}
        fps={30}
        width={1920}
        height={1080}
      />
<Composition
        id="SerendipityWordVideo"
        component={SerendipityWordVideo}
        durationInFrames={3986}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EarthquakeWordVideo"
        component={EarthquakeWordVideo}
        durationInFrames={4260}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MysteryWordVideo"
        component={MysteryWordVideo}
        durationInFrames={3614}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WisdomWordVideo"
        component={WisdomWordVideo}
        durationInFrames={2894}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SolutionWordVideo"
        component={SolutionWordVideo}
        durationInFrames={4050}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DeepseekWordVideo"
        component={DeepseekWordVideo}
        durationInFrames={3569}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LightWordVideo"
        component={LightWordVideo}
        durationInFrames={3810}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GravityWordVideo"
        component={GravityWordVideo}
        durationInFrames={3593}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
