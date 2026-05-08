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
import {
  PhoneDemo32s,
  PhoneDemo32sConfig,
} from "./templates/PhoneDemo32s";
import {
  GrowthOSShort,
  GrowthOSShortConfig,
} from "./templates/GrowthOSShort";
import {
  FastCutFootage,
  FastCutFootageConfig,
} from "./templates/FastCutFootage";
import {
  GrowthOSCut,
  GrowthOSCutConfig,
} from "./templates/GrowthOSCut";

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
      <Composition
        id="PhoneDemo32s"
        component={PhoneDemo32s}
        durationInFrames={PhoneDemo32sConfig.durationFrames}
        fps={PhoneDemo32sConfig.fps}
        width={PhoneDemo32sConfig.width}
        height={PhoneDemo32sConfig.height}
      />
      <Composition
        id="GrowthOSShort"
        component={GrowthOSShort}
        durationInFrames={GrowthOSShortConfig.durationFrames}
        fps={GrowthOSShortConfig.fps}
        width={GrowthOSShortConfig.width}
        height={GrowthOSShortConfig.height}
      />
      <Composition
        id="FastCutFootage"
        component={FastCutFootage}
        durationInFrames={FastCutFootageConfig.durationFrames}
        fps={FastCutFootageConfig.fps}
        width={FastCutFootageConfig.width}
        height={FastCutFootageConfig.height}
      />
      <Composition
        id="GrowthOSCut"
        component={GrowthOSCut}
        durationInFrames={GrowthOSCutConfig.durationFrames}
        fps={GrowthOSCutConfig.fps}
        width={GrowthOSCutConfig.width}
        height={GrowthOSCutConfig.height}
      />
    </>
  );
}
