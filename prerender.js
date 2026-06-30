// Static prerender: render each route to HTML and write it into dist/ so crawlers (and
// users) get real content before JS runs. Runs after the client + SSR builds (see package.json).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './dist-ssr/entry-server.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf-8')

const routes = [
  { url: '/', out: 'index.html', title: 'Ambient Monitor — live room temperature, light & motion' },
  { url: '/dashboard', out: 'dashboard/index.html', title: 'Dashboard · Ambient Monitor' },
  { url: '/embed', out: 'embed/index.html', title: 'Embed builder · Ambient Monitor' },
]

for (const { url, out, title } of routes) {
  const appHtml = render(url)
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  const outPath = join(dist, out)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  console.log('prerendered', url, '→', out)
}
