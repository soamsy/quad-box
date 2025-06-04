export const SHAPES = {
  diamond: `
    M55,5 L105,55 L55,105 L5,55 Z
  `,
  heart: `
    M55,92
    C30,77 10,47 30,27
    C40,17 55,22 55,37
    C55,22 70,17 80,27
    C100,47 80,77 55,92 Z
  `,
  hemicircle: `
    M5,40
    A55,60 0 0,1 105,40 
    L105,100
    L5,100 Z
  `,
  octagon: `
    M35,5 L75,5 L105,35 L105,75 L75,105 L35,105 L5,75 L5,35 Z
  `,
  square: `
    M5,5 H105 V105 H5 Z
  `,
  star: `
    M55,5 
    L66.8,40.1 L105,40.1 
    L74.1,62 L85.9,96 
    L55,75 L24.1,96 
    L35.9,62 L5,40.1 
    L43.2,40.1 Z
  `,
  triangle: `
    M55,5 L105,105 L5,105 Z
  `
}

export const LIGHT_PALETTE = {
  red: '#FF2233',
  green: '#35FF55',
  blue: '#2545FF',
  yellow: '#FBFB61',
  purple: '#8831EA',
  cyan: '#69FCFF',
  orange: '#FF9320',
  pink: '#FC75BA',
}

export const DARK_PALETTE = {
  red: '#A4031F',
  green: '#09AA40',
  blue: '#1616CA',
  yellow: '#DFAC28',
  purple: '#56255D',
  cyan: '#57B6C3',
  orange: '#CC5000',
  pink: '#F27191',
}

export const COLOR_POOL = Object.keys(LIGHT_PALETTE)
export const SHAPE_POOL = Object.keys(SHAPES)

function createSvgBlobUrl(path, fill, stroke) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
    <path d="${path.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  </svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}

const generateShapeUrls = () => {
  const shapeUrls = {}
  for (const shape in SHAPES) {
    shapeUrls[shape] = {}
    for (const lightColor in LIGHT_PALETTE) {
      shapeUrls[`${shape}-light-${lightColor}`] = createSvgBlobUrl(SHAPES[shape], LIGHT_PALETTE[lightColor], '#222')
    }
    for (const darkColor in DARK_PALETTE) {
      shapeUrls[`${shape}-dark-${darkColor}`] = createSvgBlobUrl(SHAPES[shape], DARK_PALETTE[darkColor], '#333')
    }
    shapeUrls[`${shape}-dark-inner`] = createSvgBlobUrl(SHAPES[shape], "#FFFFFF", '#333')
    shapeUrls[`${shape}-light-inner`] = createSvgBlobUrl(SHAPES[shape], "#313131", '#333')
  }
  return shapeUrls
}

export const SHAPE_URLS = generateShapeUrls()

const NATURAL_PATH = "Natural-Numbers/"
export const NUMBER_AUDIO_POOL = [
  `${NATURAL_PATH}1.opus`,
  `${NATURAL_PATH}2.opus`,
  `${NATURAL_PATH}3.opus`,
  `${NATURAL_PATH}4.opus`,
  `${NATURAL_PATH}5.opus`,
  `${NATURAL_PATH}6.opus`,
  `${NATURAL_PATH}7.opus`,
  `${NATURAL_PATH}8.opus`,
]

const LETTERS_PATH = "Letters/"
export const LETTER_AUDIO_POOL = [
  `${LETTERS_PATH}b.opus`,
  `${LETTERS_PATH}c.opus`,
  `${LETTERS_PATH}g.opus`,
  `${LETTERS_PATH}i.opus`,
  `${LETTERS_PATH}j.opus`,
  `${LETTERS_PATH}m.opus`,
  `${LETTERS_PATH}l.opus`,
  `${LETTERS_PATH}t.opus`,
  `${LETTERS_PATH}k.opus`,
]

const LETTERS_2_PATH = "Letters2/"
export const LETTER_2_AUDIO_POOL = [
 `${LETTERS_2_PATH}a.opus`,
 `${LETTERS_2_PATH}d.opus`,
 `${LETTERS_2_PATH}g.opus`,
 `${LETTERS_2_PATH}i.opus`,
 `${LETTERS_2_PATH}k.opus`,
 `${LETTERS_2_PATH}m.opus`,
 `${LETTERS_2_PATH}o.opus`,
 `${LETTERS_2_PATH}s.opus`,
 `${LETTERS_2_PATH}z.opus`,
 `${LETTERS_2_PATH}b.opus`,
 `${LETTERS_2_PATH}e.opus`,
 `${LETTERS_2_PATH}j.opus`,
]

export const ALL_AUDIO = [
  ...NUMBER_AUDIO_POOL, 
  ...LETTER_AUDIO_POOL,
  ...LETTER_2_AUDIO_POOL,
]

export const POSITION_POOL = [
  '0-0-0',
  '0-0-1',
  '0-0-2',
  '0-1-0',
  '0-1-1',
  '0-1-2',
  '0-2-0',
  '0-2-1',
  '0-2-2',
  '1-0-0',
  '1-0-1',
  '1-0-2',
  '1-1-0',
  '1-1-1',
  '1-1-2',
  '1-2-0',
  '1-2-1',
  '1-2-2',
  '2-0-0',
  '2-0-1',
  '2-0-2',
  '2-1-0',
  '2-1-1',
  '2-1-2',
  '2-2-0',
  '2-2-1',
  '2-2-2',
]
