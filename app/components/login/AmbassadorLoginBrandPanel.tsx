import { login as loginConfig } from "@/lib/config";

import { AmbassadorProgramLogo } from "./AmbassadorProgramLogo";

export function AmbassadorLoginBrandPanel() {
  const { leftPanel } = loginConfig;

  return (
    <div className="left-panel left-panel--program">
      <div className="left-panel-program-inner">
        <AmbassadorProgramLogo className="left-program-logo" />
        <p className="left-program-eyebrow">{leftPanel.eyebrow}</p>
        <h1 className="left-program-headline">{leftPanel.headline}</h1>
        <p className="left-program-tagline">
          <span className="text-highlight">{leftPanel.tagline}</span>
        </p>
      </div>
    </div>
  );
}
