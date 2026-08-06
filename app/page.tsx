import { redirect } from "next/navigation";

/**
 * The landing page now lives at the site root. The waitlist step screens
 * (/waitlist/3 … /waitlist/9) are unchanged and still route through here.
 */
export default function WaitlistPage() {
  redirect("/");
}
