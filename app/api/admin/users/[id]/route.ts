import { proxyAdmin } from "@/lib/admin/backend";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  return proxyAdmin(`/admin/users/${id}`);
}
