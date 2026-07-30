"use client";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import { AmbassadorGuard, AmbassadorPageHeader, DashboardNotice, Panel } from "../_components";

export default function AmbassadorRulesPage() {
  const { data, isLoading, error } = useGetAmbassadorDashboardQuery();
  const rules = data?.rulesAndTerms.sections ?? [];

  return (
    <AmbassadorGuard>
      <main className="flex-1 flex flex-col gap-6 md:gap-8">
        <AmbassadorPageHeader
          title="Rules and Terms"
          subtitle="Operational ambassador competition rules. Final legal wording should be approved before production release."
        />
        {isLoading ? <DashboardNotice>Loading rules...</DashboardNotice> : null}
        {error ? <DashboardNotice>Unable to load ambassador rules. Please refresh or try again later.</DashboardNotice> : null}

        <Panel title={data?.rulesAndTerms.title ?? "Ambassador Competition Rules"}>
          {isLoading ? null : rules.length === 0 ? (
            <p className="font-lato text-[14px] font-semibold leading-relaxed text-neutral-500">
              No ambassador rules are available yet.
            </p>
          ) : (
            <ol className="list-decimal pl-5 space-y-3">
              {rules.map((rule) => (
                <li key={rule} className="font-lato text-[14px] font-semibold leading-relaxed text-neutral-700">
                  {rule}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </main>
    </AmbassadorGuard>
  );
}
