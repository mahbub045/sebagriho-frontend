/**
 * Derives the tenant subdomain from the current hostname.
 * e.g. "acme.yourapp.com" -> "acme"; "acme.localhost" -> "acme"; bare domain -> ''.
 * Falls back to NEXT_PUBLIC_LOCAL_SUBDOMAIN on localhost so local dev can
 * simulate a tenant without needing a real subdomain.
 */
export function getSubdomainFromHost(): string {
  let subdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || '';

  if (typeof window === 'undefined') return subdomain;

  const hostname = window.location.hostname;

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
