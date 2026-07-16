import { NextRequest, NextResponse } from "next/server";
import { getRole, ROLE_COOKIE, roleCanAccessPath } from "@/lib/roles";

// Route guard for mock role-based access:
//  - no role cookie        -> /login
//  - has role, on /login   -> their landing route
//  - route not in role nav -> their landing route
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRole(req.cookies.get(ROLE_COOKIE)?.value);

  if (pathname === "/login") {
    if (role) {
      const url = req.nextUrl.clone();
      url.pathname = role.landingRoute;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!roleCanAccessPath(role.id, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = role.landingRoute;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, static assets, and files
  // with an extension (images, fonts, etc.).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};
