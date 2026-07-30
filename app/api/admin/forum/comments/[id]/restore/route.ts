import { proxyAdmin } from "@/lib/admin/backend";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();
  return proxyAdmin(`/admin/forum/comments/${id}/restore`, { method: "POST", body });
}
