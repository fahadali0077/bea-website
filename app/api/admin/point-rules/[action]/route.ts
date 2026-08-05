import { proxyAdmin } from "@/lib/admin/backend";

export async function PUT(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/point-rules/${encodeURIComponent(action)}`, { method: "PUT", body });
}
