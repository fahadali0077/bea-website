import { proxyAdmin } from "@/lib/admin/backend";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdmin(`/admin/forum/posts/${id}`);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/forum/posts/${id}`, { method: "DELETE", body });
}
