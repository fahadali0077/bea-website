import { proxyAdmin } from "@/lib/admin/backend";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.text();

  return proxyAdmin(`/admin/orders/${id}/status`, {
    method: "PUT",
    body,
  });
}
