/**
 * 压缩 public/images 下的 JPG，缩小体积并保持画质
 * 运行: node scripts/compress-images.mjs
 */
import { readdir, readFile, writeFile } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, "..", "public", "images")
const MAX_WIDTH = 1200
const QUALITY = 82

const sharp = (await import("sharp")).default

const files = await readdir(IMAGES_DIR)
const jpgs = files.filter((f) => f.toLowerCase().endsWith(".jpg"))

let totalBefore = 0
let totalAfter = 0

for (const name of jpgs) {
  const path = join(IMAGES_DIR, name)
  const buf = await readFile(path)
  totalBefore += buf.length
  const out = await sharp(buf)
    .resize(MAX_WIDTH, null, { withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer()
  await writeFile(path, out)
  totalAfter += out.length
  const pct = ((1 - out.length / buf.length) * 100).toFixed(0)
  console.log(`${name}: ${(buf.length / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB (-${pct}%)`)
}

console.log(`\n总计: ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB (节省 ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`)
