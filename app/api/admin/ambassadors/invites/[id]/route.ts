import { proxyAdmin } from "@/lib/admin/backend";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin(`/admin/ambassadors/invites/${id}`, { method: "DELETE" });
}
