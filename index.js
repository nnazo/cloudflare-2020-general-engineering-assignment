addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const links = [
  { "name": "Cloudflare", "url": "https://cloudflare.com" },
  { "name": "GitHub", "url": "https://github.com" },
  { "name": "Rust", "url": "https://rust-lang.org" },
  { "name": "Docker", "url": "https://docker.com" },
  { "name": "DuckDuckGo", "url": "https://duckduckgo.com" },
  { "name": "DigitalOcean", "url": "https://digitalocean.com" }
];

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}
