import { proxyAdmin } from "@/lib/admin/backend";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyAdmin("/admin/ambassadors/invite", { method: "POST", body });
}
