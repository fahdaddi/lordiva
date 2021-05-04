import Svgo from 'svgo'
import fs from 'fs-extra'
import cleanupIDs from 'svgo/plugins/cleanupIDs'

export async function writeSVG(path, content) {
  const result = await fs.writeFile(path, content, { flag: 'w' })
  return result
}

export async function readSVG(path) {
  const result = await fs.readFile(path)
  return result
}

export async function optimizeSVG(name, content, svgoPlugins = []) {
  const svgOptimizer = new Svgo({
      plugins: svgoPlugins
  });

  cleanupIDs.params.prefix = `${name}-`
  const $data = await svgOptimizer.optimize(content)
  return $data.data
}

export function convertToSymbol(name, content) {
  const $data = content
    .replace('<svg', `<symbol id="${name}"`)
    .replace('</svg>', '</symbol>')
    .replace(/<defs>(.+)<\/defs>/, '')

  return $data
}

export function extractDefs(content) {
  const $data = content
    .match(/<defs>(.+)<\/defs>/)

  return $data ? $data[1] : ''
}

export function isSVGFile(file) {
  return file.match(/.*\.svg$/)
}

export function wrap(content, defs) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
        '<defs>\n' +
        defs +
        '\n</defs>\n' +
        content +
        '\n</svg>'
}
