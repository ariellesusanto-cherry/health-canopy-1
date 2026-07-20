import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRole, ROLE_COOKIE, roleCanAccessPath } from "@/lib/roles";

// Clerk owns authentication; the role cookie owns in-app authorization.
// Flow:
//   not signed in            -> /sign-in (Clerk)
//   signed in, no role       -> /login (role chooser)
//   signed in, role set      -> enforce that role's allowed routes
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  if (!userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Signed in — role selection is the second gate.
  const role = getRole(req.cookies.get(ROLE_COOKIE)?.value);

  if (pathname === "/login") return NextResponse.next(); // role chooser

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
});

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes + Clerk's auto-proxy path.
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
