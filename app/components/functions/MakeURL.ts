import type { UrlObject } from 'url';
type TypeUrl = string | UrlObject;

export function MakeURL(href: TypeUrl) {
  let url = new URL(location.href);
  let { href: _href, query, search: _search, protocol, hostname, port, host, pathname, hash } =
    typeof href === "string" ? { href } as UrlObject : href;
  if (_href && !(query || _search || protocol || hostname || port || host || pathname || hash)) {
    try { url.href = _href; } catch { url.href = url.origin + "/" + _href; }
  } else {
    if (protocol) url.protocol = protocol;
    if (hostname) url.hostname = hostname;
    if (port) url.port = String(port);
    if (host) url.host = host;
    if (hash) url.hash = hash;
    query = query || _search;
    if (query) {
      const search = new URLSearchParams(typeof query === "string" ? query :
        Object.fromEntries(Object.entries(query)
          .map(([k, v]) => [k, String((v !== undefined && v !== null) ? v : "")])));
      url.search = search.size ? search.toString() : "";
    }
  }
  return url;
}
