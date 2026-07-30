import { proxyAdmin } from "@/lib/admin/backend";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin(`/admin/markets/${id}/toggle-status`, { method: "PATCH" });
}
