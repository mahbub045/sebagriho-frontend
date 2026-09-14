/**
 * Derives the tenant subdomain from a hostname.
 * e.g. "acme.yourapp.com" -> "acme"; "acme.localhost" -> "acme"; bare domain -> ''.
 * Falls back to NEXT_PUBLIC_LOCAL_SUBDOMAIN on localhost so local dev can
 * simulate a tenant without needing a real subdomain.
 *
 * Pass `host` explicitly when calling from a server context (e.g. proxy.ts,
 * reading the request's `Host` header) where `window` isn't available.
 */
export function getSubdomainFromHost(host?: string): string {
  let subdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || '';

  const rawHost =
    host ??
    (typeof window !== 'undefined' ? window.location.hostname : undefined);

  if (!rawHost) return subdomain;

  // Strip a port, e.g. "acme.localhost:3000" -> "acme.localhost"
  const hostname = rawHost.split(':')[0];

  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const parts = hostname.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1] === 'localhost')) {
      const extractedSubdomain = parts[0];
      if (extractedSubdomain && extractedSubdomain !== 'www') {
        subdomain = extractedSubdomain;
      }
    }
  }

  return subdomain;
}
