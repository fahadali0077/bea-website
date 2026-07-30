const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const checks = [
  {
    file: "lib/api/fetch-all-markets-search.ts",
    forbidden: ["TEMPORARY_MARKETS", "Return temporary mockup markets", "catch {"],
  },
  {
    file: "lib/server-auth.ts",
    forbidden: ["demoLoginResponse", "demoSocialResponse", "demo-token", "demo response"],
  },
  {
    file: "app/api/auth/login/route.ts",
    forbidden: ["demoLoginResponse", "demo-token"],
  },
  {
    file: "app/api/auth/social/route.ts",
    forbidden: ["demoSocialResponse"],
  },
  {
    file: "app/dashboard/ambassador/rules/page.tsx",
    forbidden: ["fallbackRules", "Showing fallback rules"],
  },
  {
    file: "app/components/Hero.tsx",
    forbidden: ["Mock API call simulation", "setTimeout"],
  },
  {
    file: "app/components/waitlist/WaitlistStep.tsx",
    mustNotExist: true,
  },
];

const failures = [];

for (const check of checks) {
  const filePath = path.join(root, check.file);
  const exists = fs.existsSync(filePath);

  if (check.mustNotExist) {
    if (exists) failures.push(`${check.file} should not exist`);
    continue;
  }

  if (!exists) {
    failures.push(`${check.file} is missing`);
    continue;
  }

  const text = fs.readFileSync(filePath, "utf8");
  for (const pattern of check.forbidden) {
    if (text.includes(pattern)) {
      failures.push(`${check.file} contains forbidden pattern: ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error("BEA-022 live API verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("BEA-022 live API integration verification passed.");
