import { proxyAdmin } from "@/lib/admin/backend";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyAdmin("/admin/messages/send", { method: "POST", body });
}
