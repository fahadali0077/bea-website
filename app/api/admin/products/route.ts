import { proxyAdmin } from "@/lib/admin/backend";

export async function GET(request: Request) {
  const search = new URL(request.url).search;
  return proxyAdmin(`/admin/products${search}`);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return proxyAdmin("/admin/products", {
    method: "POST",
    headers,
    body: request.body,
    // @ts-ignore
    duplex: "half",
  });
}
