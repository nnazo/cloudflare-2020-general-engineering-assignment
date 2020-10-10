addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === '/links') {
    event.respondWith(handleLinksRequest(event.request));
  } else {
    event.respondWith(handleRequest(event.request));
  }
})

const links = [
  { name: "Cloudflare", url: "https://cloudflare.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Rust", url: "https://rust-lang.org" },
  { name: "Docker", url: "https://docker.com" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "DigitalOcean", url: "https://digitalocean.com" }
];

/**
 * Respond with static webpage
 * @param {Request} request
 */
async function handleRequest(request) {
  const resp = await fetch('https://static-links-page.signalnerve.workers.dev')
    .catch(error => {
      return new Response('Failed to fetch static webpage', {
        headers: { 'Content-Type': 'text/plain' }
      });
    });

  const modified = new HTMLRewriter()
    .on("div#links", new LinksTransformer(links))
    .on("div#profile", new ProfileTransformer())
    .on("img#avatar", new AvatarTransformer())
    .on("h1#name", new UsernameTransformer())
    .transform(resp);
  
  return new Response(await modified.text(), {
    headers: { 'Content-Type': 'text/html' }
  });
}

/**
 * Respond with the links JSON array
 * @param {Request} request
 */
async function handleLinksRequest(request) {
  return new Response(JSON.stringify(links), {
    headers: { 'Content-Type': 'application/json' }
  });
}

class LinksTransformer {
  constructor(links) {
    this.links = links;
  }

  async element(element) {
    this.links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, {
        html: true
      });
    });
  }
}

class ProfileTransformer {
  async element(element) {
    element.removeAttribute("style");
  }
}

class AvatarTransformer {
  async element(element) {
    element.setAttribute('src', 'https://avatars0.githubusercontent.com/u/6753860?s=460&v=4');
  }
}

class UsernameTransformer {
  async element(element) {
    element.setInnerContent('nnazo');
  }
}