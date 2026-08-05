import { proxyAdmin } from "@/lib/admin/backend";

export async function GET() {
  return proxyAdmin("/admin/point-rules");
}
