import { proxyAdmin } from "@/lib/admin/backend";

export async function GET(request: Request) {
  const search = new URL(request.url).search;
  return proxyAdmin(`/admin/rewards${search}`);
}

export async function POST(request: Request) {
  const body = await request.text();
  return proxyAdmin("/admin/rewards", { method: "POST", body });
}
