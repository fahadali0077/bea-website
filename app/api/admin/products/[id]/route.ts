import { proxyAdmin } from "@/lib/admin/backend";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const contentType = request.headers.get("content-type") || "";
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return proxyAdmin(`/admin/products/${id}`, {
    method: "PUT",
    headers,
    body: request.body,
    // @ts-ignore
    duplex: "half",
  });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/products/${id}`, { method: "DELETE" });
}
