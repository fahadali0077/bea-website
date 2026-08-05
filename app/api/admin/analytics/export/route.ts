import { UnauthenticatedError, adminFetch } from "@/lib/admin/backend";

export async function GET(request: Request) {
  const search = new URL(request.url).search;

  try {
    const upstream = await adminFetch(`/admin/analytics/export${search}`, {
      headers: { Accept: "text/csv" },
    });
    const csv = await upstream.text();
    return new Response(csv, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "text/csv",
        "Content-Disposition":
          upstream.headers.get("Content-Disposition") ?? "attachment; filename=analytics.csv",
      },
    });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return Response.json({ ok: false, message: "Session expired. Please sign in again." }, { status: 401 });
    }
    return Response.json({ ok: false, message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
