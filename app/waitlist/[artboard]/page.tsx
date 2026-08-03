import { notFound } from "next/navigation";

import { WaitlistConfirmedPage } from "@/app/components/waitlist/WaitlistConfirmedPage";
import { WaitlistEmailPage } from "@/app/components/waitlist/WaitlistEmailPage";
import { WaitlistMarketPage } from "@/app/components/waitlist/WaitlistMarketPage";
import { WaitlistNamePage } from "@/app/components/waitlist/WaitlistNamePage";
import { WaitlistPrizesPage } from "@/app/components/waitlist/WaitlistPrizesPage";
import { WaitlistSchoolPage } from "@/app/components/waitlist/WaitlistSchoolPage";
import { WaitlistStepMobile } from "@/app/components/waitlist/WaitlistStepMobile";
import type { WaitlistArtboardId } from "@/lib/waitlist";
import { WAITLIST_JOIN_FLOW } from "@/lib/waitlist";

const STEP_PAGES: Record<
  Exclude<WaitlistArtboardId, "1">,
  () => React.ReactNode
> = {
  "3": () => <WaitlistMarketPage />,
  "4": () => <WaitlistNamePage />,
  "5": () => <WaitlistSchoolPage />,
  "6": () => <WaitlistStepMobile artboardId="6" />,
  "7": () => <WaitlistEmailPage />,
  "8": () => <WaitlistConfirmedPage />,
  "9": () => <WaitlistPrizesPage />,
};

type Props = {
  params: Promise<{ artboard: string }>;
};

export function generateStaticParams() {
  return WAITLIST_JOIN_FLOW.map((artboard) => ({ artboard }));
}

export default async function WaitlistArtboardRoute({ params }: Props) {
  const { artboard } = await params;
  const Page = STEP_PAGES[artboard as Exclude<WaitlistArtboardId, "1">];

  if (!Page) {
    notFound();
  }

  return Page();
}
