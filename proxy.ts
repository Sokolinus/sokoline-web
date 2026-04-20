import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  const { pathname } = req.nextUrl;
  console.log(`[Middleware] ${req.method} ${pathname} (Slash: ${pathname.endsWith('/')}) | User: ${authData.userId || 'Guest'}`);
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
