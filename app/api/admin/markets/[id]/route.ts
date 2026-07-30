import { proxyAdmin } from "@/lib/admin/backend";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/markets/${id}`);
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/markets/${id}`, { method: "PATCH", body });
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/markets/${id}`, { method: "PUT", body });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/markets/${id}`, { method: "DELETE" });
}
