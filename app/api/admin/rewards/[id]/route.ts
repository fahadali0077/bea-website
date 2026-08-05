import { proxyAdmin } from "@/lib/admin/backend";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/rewards/${id}`, { method: "PUT", body });
}
