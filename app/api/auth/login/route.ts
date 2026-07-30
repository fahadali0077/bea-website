import {
  validateLoginBody,
  withAuthBackend,
  type LoginBody,
} from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const validationError = validateLoginBody(body);

  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 });
  }

  return withAuthBackend(
    "/auth/login",
    {
      email: body.email!.trim(),
      password: body.password!,
      remember: Boolean(body.remember),
    },
  );
}
