import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_TOKEN_COOKIE,
} from "@/lib/admin/auth-constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isAdminArea = pathname === ADMIN_HOME_PATH || pathname.startsWith(`${ADMIN_HOME_PATH}/`);

  if (isAdminArea && !token) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_HOME_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth/admin"],
};
