const BG = '#FDF9EC'
const LINE = '#A07B54'

const shapes = {
  bolo: 'M120 300 L120 220 Q300 170 480 220 L480 300 Z',
  docinho: 'M300 260 m-90 0 a90 90 0 1 0 180 0 a90 90 0 1 0 -180 0',
  sobremesa: 'M110 210 L490 210 L430 300 L170 300 Z M150 210 Q300 90 450 210',
  presente: 'M150 190 L450 190 L450 300 L150 300 Z M110 190 L490 190 M300 190 L300 300 M220 190 Q300 80 380 190',
}

function daisy(cx, cy, size, color) {
  const petals = Array.from({ length: 12 })
    .map((_, i) => {
      const angle = (360 / 12) * i
      return `<ellipse cx="${cx}" cy="${cy - size}" rx="${size * 0.18}" ry="${size * 0.55}" fill="${color}" transform="rotate(${angle} ${cx} ${cy})" />`
    })
    .join('')
  return `<g>${petals}</g>`
}

function buildSvg(shapeKey, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
      <rect width="1600" height="1000" fill="${BG}" />
      ${daisy(1360, 160, 55, LINE)}
      <g transform="translate(500 200) scale(2)">
        <path d="${shapes[shapeKey]}" fill="none" stroke="${LINE}" stroke-width="6" stroke-linejoin="round" />
      </g>
      <text x="80" y="920" font-family="Poppins, sans-serif" font-size="28" letter-spacing="2" fill="${LINE}">${label}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const heroPlaceholderPhotos = [
  { image: buildSvg('bolo', 'FOTO DE BOLO EM DESTAQUE'), caption: '[Produto assinatura]' },
  { image: buildSvg('docinho', 'FOTO DE DOCINHOS'), caption: 'Docinhos artesanais' },
  { image: buildSvg('sobremesa', 'FOTO DE SOBREMESA'), caption: 'Sobremesas da casa' },
  { image: buildSvg('presente', 'FOTO DE PRESENTE'), caption: 'Presenteie com doçura' },
]
