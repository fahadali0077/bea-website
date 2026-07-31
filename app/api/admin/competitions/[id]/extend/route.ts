import { proxyAdmin } from "@/lib/admin/backend";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/competitions/${id}/extend`, { method: "POST", body });
}
