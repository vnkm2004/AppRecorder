/**
 * URL normalization utility:
 * Automatically formats URLs for direct, seamless embedding without proxies.
 * Handles missing protocols, Google igu=1 embed parameter, YouTube/Vimeo embeds.
 */
export function normalizeUrl(input) {
  if (!input) return '';
  let url = input.trim();
  if (!url) return '';

  // Auto-prefix https if protocol is missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // Google Search: Root google.com restricts iframes with X-Frame-Options: SAMEORIGIN.
    // However, Google officially provides the `igu=1` ("Iframe Google Universal") endpoint
    // which removes X-Frame-Options and allows full interactive embedding.
    if (host === 'google.com' || host === 'www.google.com') {
      if (parsed.pathname === '/' || parsed.pathname === '') {
        return 'https://www.google.com/search?igu=1';
      }
      if (!parsed.searchParams.has('igu')) {
        parsed.searchParams.set('igu', '1');
        return parsed.toString();
      }
    }

    // YouTube: Convert watch URLs to embed player URLs
    if (host.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) {
        return `https://www.youtube.com/embed/${v}?autoplay=1&mute=1`;
      }
    }
    if (host === 'youtu.be') {
      const v = parsed.pathname.slice(1);
      if (v) {
        return `https://www.youtube.com/embed/${v}?autoplay=1&mute=1`;
      }
    }

    // Vimeo: Convert standard link to embed player
    if (host.includes('vimeo.com') && !host.includes('player.vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
  } catch (err) {}

  return url;
}
