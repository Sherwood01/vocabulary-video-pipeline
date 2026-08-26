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
import type { WordConfig } from "./pipeline/types";
import { SubstantiateWordVideo } from "./SubstantiateWordVideo";
import { AmiableWordVideo } from "./AmiableWordVideo";
import { AplombWordVideo } from "./AplombWordVideo";
import { BesottedWordVideo } from "./BesottedWordVideo";
import { DisillusionedWordVideo } from "./DisillusionedWordVideo";
import { EffervescentWordVideo } from "./EffervescentWordVideo";
import { EnigmaticWordVideo } from "./EnigmaticWordVideo";
import { EphemeralWordVideo } from "./EphemeralWordVideo";
import { FelicitousWordVideo } from "./FelicitousWordVideo";
import { FundamentallyWordVideo } from "./FundamentallyWordVideo";
import { IdiosyncraticWordVideo } from "./IdiosyncraticWordVideo";
import { ImmenseWordVideo } from "./ImmenseWordVideo";
import { IncandescentWordVideo } from "./IncandescentWordVideo";
import { IntricateWordVideo } from "./IntricateWordVideo";
import { MassiveWordVideo } from "./MassiveWordVideo";
import { MellifluousWordVideo } from "./MellifluousWordVideo";
import { NefariousWordVideo } from "./NefariousWordVideo";
import { PetrichorWordVideo } from "./PetrichorWordVideo";
import { ScintillatingWordVideo } from "./ScintillatingWordVideo";
import { UbiquitousWordVideo } from "./UbiquitousWordVideo";
import { UnequivocallyWordVideo } from "./UnequivocallyWordVideo";
import { AdmireWordVideo } from "./AdmireWordVideo";
import { AdoreWordVideo } from "./AdoreWordVideo";
import { AllureWordVideo } from "./AllureWordVideo";
import { CaptivatingWordVideo } from "./CaptivatingWordVideo";
import { CherishWordVideo } from "./CherishWordVideo";
import { DazzlingWordVideo } from "./DazzlingWordVideo";
import { DelightWordVideo } from "./DelightWordVideo";
import { DevotionWordVideo } from "./DevotionWordVideo";
import { EmbraceWordVideo } from "./EmbraceWordVideo";
import { EnchantWordVideo } from "./EnchantWordVideo";
import { EndearWordVideo } from "./EndearWordVideo";
import { EnraptureWordVideo } from "./EnraptureWordVideo";
import { EntrancingWordVideo } from "./EntrancingWordVideo";
import { ExquisiteWordVideo } from "./ExquisiteWordVideo";
import { FondnessWordVideo } from "./FondnessWordVideo";
import { GloriousWordVideo } from "./GloriousWordVideo";
import { GracefulWordVideo } from "./GracefulWordVideo";
import { InfatuateWordVideo } from "./InfatuateWordVideo";
import { IntimateWordVideo } from "./IntimateWordVideo";
import { LuminousWordVideo } from "./LuminousWordVideo";
import { MelodicWordVideo } from "./MelodicWordVideo";
import { TendernessWordVideo } from "./TendernessWordVideo";
import { WhispersWordVideo } from "./WhispersWordVideo";
import { AestheticsWordVideo } from "./AestheticsWordVideo";
import { AllegoryWordVideo } from "./AllegoryWordVideo";
import { AllusionWordVideo } from "./AllusionWordVideo";
import { AvantgardeWordVideo } from "./AvantgardeWordVideo";
import { CatharsisWordVideo } from "./CatharsisWordVideo";
import { DystopianWordVideo } from "./DystopianWordVideo";
import { ElegyWordVideo } from "./ElegyWordVideo";
import { ExpressionismWordVideo } from "./ExpressionismWordVideo";
import { HaikuWordVideo } from "./HaikuWordVideo";
import { ImpressionismWordVideo } from "./ImpressionismWordVideo";
import { MetaphorWordVideo } from "./MetaphorWordVideo";
import { MonochromeWordVideo } from "./MonochromeWordVideo";
import { ProtagonistWordVideo } from "./ProtagonistWordVideo";
import { RealismWordVideo } from "./RealismWordVideo";
import { RenaissanceWordVideo } from "./RenaissanceWordVideo";
import { SonnetWordVideo } from "./SonnetWordVideo";
import { SublimeWordVideo } from "./SublimeWordVideo";
import { SurrealWordVideo } from "./SurrealWordVideo";
import { SymbolismWordVideo } from "./SymbolismWordVideo";
import { VersificationWordVideo } from "./VersificationWordVideo";
import { AccomplishedWordVideo } from "./AccomplishedWordVideo";
import { AdmirationWordVideo } from "./AdmirationWordVideo";

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
        id="SubstantiateWordVideo"
        component={SubstantiateWordVideo}
        durationInFrames={4628}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AmiableWordVideo"
        component={AmiableWordVideo}
        durationInFrames={3892}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AplombWordVideo"
        component={AplombWordVideo}
        durationInFrames={4232}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BesottedWordVideo"
        component={BesottedWordVideo}
        durationInFrames={3114}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DisillusionedWordVideo"
        component={DisillusionedWordVideo}
        durationInFrames={3106}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EffervescentWordVideo"
        component={EffervescentWordVideo}
        durationInFrames={3766}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnigmaticWordVideo"
        component={EnigmaticWordVideo}
        durationInFrames={3892}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EphemeralWordVideo"
        component={EphemeralWordVideo}
        durationInFrames={3170}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FelicitousWordVideo"
        component={FelicitousWordVideo}
        durationInFrames={4574}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FundamentallyWordVideo"
        component={FundamentallyWordVideo}
        durationInFrames={4513}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IdiosyncraticWordVideo"
        component={IdiosyncraticWordVideo}
        durationInFrames={3930}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ImmenseWordVideo"
        component={ImmenseWordVideo}
        durationInFrames={4166}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IncandescentWordVideo"
        component={IncandescentWordVideo}
        durationInFrames={4827}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntricateWordVideo"
        component={IntricateWordVideo}
        durationInFrames={3761}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MassiveWordVideo"
        component={MassiveWordVideo}
        durationInFrames={4982}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MellifluousWordVideo"
        component={MellifluousWordVideo}
        durationInFrames={3628}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NefariousWordVideo"
        component={NefariousWordVideo}
        durationInFrames={3942}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PetrichorWordVideo"
        component={PetrichorWordVideo}
        durationInFrames={3115}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ScintillatingWordVideo"
        component={ScintillatingWordVideo}
        durationInFrames={3153}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UbiquitousWordVideo"
        component={UbiquitousWordVideo}
        durationInFrames={4201}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UnequivocallyWordVideo"
        component={UnequivocallyWordVideo}
        durationInFrames={3782}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdmireWordVideo"
        component={AdmireWordVideo}
        durationInFrames={4158}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdoreWordVideo"
        component={AdoreWordVideo}
        durationInFrames={4325}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AllureWordVideo"
        component={AllureWordVideo}
        durationInFrames={5084}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CaptivatingWordVideo"
        component={CaptivatingWordVideo}
        durationInFrames={3864}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CherishWordVideo"
        component={CherishWordVideo}
        durationInFrames={3541}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DazzlingWordVideo"
        component={DazzlingWordVideo}
        durationInFrames={3207}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DelightWordVideo"
        component={DelightWordVideo}
        durationInFrames={3484}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DevotionWordVideo"
        component={DevotionWordVideo}
        durationInFrames={3303}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EmbraceWordVideo"
        component={EmbraceWordVideo}
        durationInFrames={3332}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnchantWordVideo"
        component={EnchantWordVideo}
        durationInFrames={3989}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EndearWordVideo"
        component={EndearWordVideo}
        durationInFrames={3176}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnraptureWordVideo"
        component={EnraptureWordVideo}
        durationInFrames={3878}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EntrancingWordVideo"
        component={EntrancingWordVideo}
        durationInFrames={3950}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ExquisiteWordVideo"
        component={ExquisiteWordVideo}
        durationInFrames={3819}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FondnessWordVideo"
        component={FondnessWordVideo}
        durationInFrames={3609}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GloriousWordVideo"
        component={GloriousWordVideo}
        durationInFrames={3282}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GracefulWordVideo"
        component={GracefulWordVideo}
        durationInFrames={3783}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InfatuateWordVideo"
        component={InfatuateWordVideo}
        durationInFrames={3211}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntimateWordVideo"
        component={IntimateWordVideo}
        durationInFrames={4546}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LuminousWordVideo"
        component={LuminousWordVideo}
        durationInFrames={4054}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MelodicWordVideo"
        component={MelodicWordVideo}
        durationInFrames={3313}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TendernessWordVideo"
        component={TendernessWordVideo}
        durationInFrames={3293}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WhispersWordVideo"
        component={WhispersWordVideo}
        durationInFrames={4409}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AestheticsWordVideo"
        component={AestheticsWordVideo}
        durationInFrames={4468}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AllegoryWordVideo"
        component={AllegoryWordVideo}
        durationInFrames={5259}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AllusionWordVideo"
        component={AllusionWordVideo}
        durationInFrames={4132}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AvantgardeWordVideo"
        component={AvantgardeWordVideo}
        durationInFrames={4525}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CatharsisWordVideo"
        component={CatharsisWordVideo}
        durationInFrames={4152}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DystopianWordVideo"
        component={DystopianWordVideo}
        durationInFrames={3910}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ElegyWordVideo"
        component={ElegyWordVideo}
        durationInFrames={4531}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ExpressionismWordVideo"
        component={ExpressionismWordVideo}
        durationInFrames={5376}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HaikuWordVideo"
        component={HaikuWordVideo}
        durationInFrames={4254}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ImpressionismWordVideo"
        component={ImpressionismWordVideo}
        durationInFrames={4017}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MetaphorWordVideo"
        component={MetaphorWordVideo}
        durationInFrames={3179}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MonochromeWordVideo"
        component={MonochromeWordVideo}
        durationInFrames={4344}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProtagonistWordVideo"
        component={ProtagonistWordVideo}
        durationInFrames={4164}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RealismWordVideo"
        component={RealismWordVideo}
        durationInFrames={4476}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RenaissanceWordVideo"
        component={RenaissanceWordVideo}
        durationInFrames={4805}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SonnetWordVideo"
        component={SonnetWordVideo}
        durationInFrames={4551}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SublimeWordVideo"
        component={SublimeWordVideo}
        durationInFrames={4942}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SurrealWordVideo"
        component={SurrealWordVideo}
        durationInFrames={5507}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SymbolismWordVideo"
        component={SymbolismWordVideo}
        durationInFrames={5082}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="VersificationWordVideo"
        component={VersificationWordVideo}
        durationInFrames={4488}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AccomplishedWordVideo"
        component={AccomplishedWordVideo}
        durationInFrames={4657}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdmirationWordVideo"
        component={AdmirationWordVideo}
        durationInFrames={4916}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
