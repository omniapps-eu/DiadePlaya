// Genera los iconos PNG de la PWA a partir de public/icon.svg
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public', 'icon.svg'))

const targets = [
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
  [180, 'apple-touch-icon.png'],
  [32, 'favicon-32.png'],
]

for (const [size, name] of targets) {
  await sharp(svg).resize(size, size).png().toFile(join(root, 'public', name))
  console.log('✓', name)
}
