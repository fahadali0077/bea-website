import { proxyAdmin } from "@/lib/admin/backend";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/schools/${id}`);
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/schools/${id}`, { method: "PUT", body });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/schools/${id}`, { method: "DELETE" });
}
