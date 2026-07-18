// Minimal PNG generator — creates solid-color icons for PWA
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { deflateSync } from 'zlib'

const sizes = [192, 512]
const color = [134, 59, 255] // #863bff — purple from favicon

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function png(size) {
  const raw = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      raw[i] = color[0]
      raw[i + 1] = color[1]
      raw[i + 2] = color[2]
      raw[i + 3] = 255
    }
  }

  // Filter byte per row (0 = None)
  const filtered = Buffer.alloc(size + size * size * 4)
  for (let y = 0; y < size; y++) {
    filtered[y * (size * 4 + 1)] = 0
    raw.copy(filtered, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }

  const compressed = deflateSync(filtered)

  // Build PNG
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function chunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const t = Buffer.from(type, 'ascii')
    const crcData = Buffer.concat([t, data])
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(crcData))
    return Buffer.concat([len, t, data, crcBuf])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)  // width
  ihdr.writeUInt32BE(size, 4)  // height
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = resolve('public/icons')
mkdirSync(outDir, { recursive: true })

for (const s of sizes) {
  writeFileSync(resolve(outDir, `icon-${s}x${s}.png`), png(s))
  console.log(`Created icon-${s}x${s}.png`)
}
