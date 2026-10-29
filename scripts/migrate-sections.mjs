// Moves page content into `content.sections`. Usage: node scripts/migrate-sections.mjs <in-dir> <out-dir>
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SECTIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/brease/sections',
)
const HOME_KEYS = ['hero', 'features', 'closing']

const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz'
export function sectionId(seed) {
  const bytes = createHash('sha256').update(seed).digest()
  let out = ''
  for (let i = 0; i < 26; i++) out += ALPHABET[bytes[i] % 32]
  return `sec_${out}`
}

function migrate(pageId, content) {
  if (!content || Array.isArray(content.sections)) return content
  if (content.template === 'home') {
    const { template, ...rest } = content
    const sections = []
    for (const key of HOME_KEYS) {
      if (!rest[key]) continue
      sections.push({ id: sectionId(`${pageId}:${key}`), type: key, ...rest[key] })
      delete rest[key]
    }
    return { template, ...rest, sections }
  }
  if (content.template === 'page') {
    const { template, title, intro, body, ...rest } = content
    const text = {
      id: sectionId(`${pageId}:body`),
      type: 'text',
      intro: intro ?? '',
      body: body ?? '',
    }
    return { template, title, ...rest, sections: [text] }
  }
  return content
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')

function localeFiles(pagesDir) {
  if (!fs.existsSync(pagesDir)) return []
  return fs
    .readdirSync(pagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      pageId: d.name,
      files: fs
        .readdirSync(path.join(pagesDir, d.name))
        .filter((f) => f.endsWith('.json') && f !== 'page.json')
        .sort()
        .map((f) => path.join(pagesDir, d.name, f)),
    }))
}

function validate(pagesDir) {
  const problems = []
  const types = new Set(
    fs
      .readdirSync(SECTIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
  )
  for (const { pageId, files } of localeFiles(pagesDir)) {
    let first = null
    for (const file of files) {
      const where = `${pageId}/${path.basename(file)}`
      const sections = readJson(file).content?.sections
      if (sections === undefined) continue
      if (!Array.isArray(sections)) {
        problems.push(`${where}: sections is not a list`)
        continue
      }
      const ids = new Set()
      for (const [i, s] of sections.entries()) {
        if (!s || typeof s.id !== 'string' || typeof s.type !== 'string') {
          problems.push(`${where}: sections.${i} has no id or type`)
          continue
        }
        if (!types.has(s.type))
          problems.push(`${where}: sections.${i} type "${s.type}" has no folder`)
        if (ids.has(s.id)) problems.push(`${where}: duplicate id ${s.id}`)
        ids.add(s.id)
      }
      const sequence = sections.map((s) => `${s?.id}/${s?.type}`).join(',')
      if (first === null) first = sequence
      else if (sequence !== first)
        problems.push(`${where}: sections differ from the page's other locales`)
    }
  }
  return problems
}

const [inDir, outDir] = process.argv.slice(2).map((d) => d && path.resolve(d))
if (!inDir || !outDir) {
  console.error('Usage: node scripts/migrate-sections.mjs <in-dir> <out-dir>')
  process.exit(1)
}
if (inDir !== outDir) fs.cpSync(inDir, outDir, { recursive: true })

const pagesDir = path.join(outDir, 'pages')
let changed = 0
for (const { pageId, files } of localeFiles(pagesDir)) {
  let pageChanged = false
  const found = new Set()
  for (const file of files) {
    const data = readJson(file)
    const content = migrate(pageId, data.content)
    if (content !== data.content) {
      writeJson(file, { ...data, content })
      pageChanged = true
    }
    for (const s of content?.sections ?? []) found.add(s.type)
  }
  if (pageChanged) changed++
  console.log(
    `${pageId}: ${pageChanged ? 'changed' : 'unchanged'}; sections: ${[...found].join(', ') || '-'}`,
  )
}
console.log(`${changed} page(s) changed`)

const problems = validate(pagesDir)
if (problems.length) {
  for (const p of problems) console.error(`invalid: ${p}`)
  process.exit(1)
}
console.log('valid')
