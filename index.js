addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Only respond to exactly /links with the JSON links.
  // Otherwise respond with the webpage (including /links/)
  if (url.pathname === '/links') {
    event.respondWith(handleLinksRequest(event.request));
  } else {
    event.respondWith(handleRequest(event.request));
  }
})

// The links to be used for the /links endpoint and LinksTransformer
const links = [
  { name: "Cloudflare", url: "https://cloudflare.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Rust", url: "https://rust-lang.org" },
  { name: "Docker", url: "https://docker.com" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "DigitalOcean", url: "https://digitalocean.com" }
];

/**
 * Respond with the modified static webpage
 * @param {Request} request
 */
async function handleRequest(request) {
  const resp = await fetch('https://static-links-page.signalnerve.workers.dev')
    .catch(error => {
      return new Response('Failed to fetch static webpage', {
        headers: { 'Content-Type': 'text/plain' }
      });
    });

  // Transform the specified elements using the given transformers
  const modified = new HTMLRewriter()
    .on('div#links', new LinksTransformer(links))
    .on('div#profile', new ProfileTransformer())
    .on('img#avatar', new AvatarTransformer())
    .on('h1#name', new UsernameTransformer())
    .on('div#social', new SocialTransformer())
    .on('title', new TitleTransformer())
    .on('body', new BackgroundTransformer())
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
    // Clear the inner content in case anything already exists there
    element.setInnerContent('');

    // Add the links inside of the element's content.
    this.links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, {
        html: true
      });
    });
  }
}

class ProfileTransformer {
  async element(element) {
    // Removes 'display: none' styling
    element.removeAttribute('style');
  }
}

class AvatarTransformer {
  async element(element) {
    // Adds the image source for the user avatar
    element.setAttribute('src', 'https://avatars0.githubusercontent.com/u/6753860?s=460&v=4');
  }
}

class UsernameTransformer {
  async element(element) {
    // Sets the username value
    element.setInnerContent('nnazo');
  }
}

class SocialTransformer {
  constructor() {
    // Contents of SVG are from https://simpleicons.org/icons/github.svg
    this.githubUrl = `
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub icon</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 
      17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 
      3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 
      1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 
      1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
      1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 
      2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>`;
  }

  async element(element) {
    // Clears the 'display: none' style
    element.removeAttribute('style');
    // Adds the GitHub socials link
    element.setInnerContent(`
      <a href="https://github.com/nnazo" alt="GitHub Profile">
        ${this.githubUrl}
      </a>
    `, {
      html: true
    });
  }
}

class TitleTransformer {
  async element(element) {
    // Modifies the title to my name.
    element.setInnerContent('Jacob Curtis');
  }
}

class BackgroundTransformer {
  async element(element) {
    // Changes the background color.
    element.setAttribute('class', 'bg-gray-700');
  }
}