import { Composition } from "remotion";
import {
  IFoundBadWebsites,
  IFoundBadWebsitesConfig,
} from "./templates/IFoundBadWebsites";
import {
  LeadToOutreach90s,
  LeadToOutreach90sConfig,
} from "./templates/LeadToOutreach90s";
import {
  AISalesResearcher,
  AISalesResearcherConfig,
} from "./templates/AISalesResearcher";

export function Root() {
  return (
    <>
      <Composition
        id="IFoundBadWebsites"
        component={IFoundBadWebsites}
        durationInFrames={IFoundBadWebsitesConfig.durationFrames}
        fps={IFoundBadWebsitesConfig.fps}
        width={IFoundBadWebsitesConfig.width}
        height={IFoundBadWebsitesConfig.height}
        defaultProps={{ config: IFoundBadWebsitesConfig }}
      />
      <Composition
        id="LeadToOutreach90s"
        component={LeadToOutreach90s}
        durationInFrames={LeadToOutreach90sConfig.durationFrames}
        fps={LeadToOutreach90sConfig.fps}
        width={LeadToOutreach90sConfig.width}
        height={LeadToOutreach90sConfig.height}
        defaultProps={{ config: LeadToOutreach90sConfig }}
      />
      <Composition
        id="AISalesResearcher"
        component={AISalesResearcher}
        durationInFrames={AISalesResearcherConfig.durationFrames}
        fps={AISalesResearcherConfig.fps}
        width={AISalesResearcherConfig.width}
        height={AISalesResearcherConfig.height}
        defaultProps={{ config: AISalesResearcherConfig }}
      />
    </>
  );
}
