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
  `${NATURAL_PATH}1`,
  `${NATURAL_PATH}2`,
  `${NATURAL_PATH}3`,
  `${NATURAL_PATH}4`,
  `${NATURAL_PATH}5`,
  `${NATURAL_PATH}6`,
  `${NATURAL_PATH}7`,
  `${NATURAL_PATH}8`,
]

const LETTERS_PATH = "Letters/"
export const LETTER_AUDIO_POOL = [
  `${LETTERS_PATH}b`,
  `${LETTERS_PATH}c`,
  `${LETTERS_PATH}g`,
  `${LETTERS_PATH}i`,
  `${LETTERS_PATH}j`,
  `${LETTERS_PATH}m`,
  `${LETTERS_PATH}l`,
  `${LETTERS_PATH}t`,
  `${LETTERS_PATH}k`,
]

const LETTERS_2_PATH = "Letters2/"
export const LETTER_2_AUDIO_POOL = [
 `${LETTERS_2_PATH}a`,
 `${LETTERS_2_PATH}d`,
 `${LETTERS_2_PATH}g`,
 `${LETTERS_2_PATH}i`,
 `${LETTERS_2_PATH}k`,
 `${LETTERS_2_PATH}m`,
 `${LETTERS_2_PATH}o`,
 `${LETTERS_2_PATH}s`,
 `${LETTERS_2_PATH}z`,
 `${LETTERS_2_PATH}b`,
 `${LETTERS_2_PATH}e`,
 `${LETTERS_2_PATH}j`,
]

const NATO_PATH = "Nato/"
export const NATO_AUDIO_POOL = [
 `${NATO_PATH}a`,
 `${NATO_PATH}b`,
 `${NATO_PATH}c`,
 `${NATO_PATH}d`,
 `${NATO_PATH}e`,
 `${NATO_PATH}f`,
 `${NATO_PATH}g`,
 `${NATO_PATH}h`,
 `${NATO_PATH}i`,
 `${NATO_PATH}j`,
 `${NATO_PATH}k`,
 `${NATO_PATH}l`,
 `${NATO_PATH}m`,
 `${NATO_PATH}n`,
 `${NATO_PATH}o`,
 `${NATO_PATH}p`,
 `${NATO_PATH}q`,
 `${NATO_PATH}r`,
 `${NATO_PATH}s`,
 `${NATO_PATH}t`,
 `${NATO_PATH}u`,
 `${NATO_PATH}v`,
 `${NATO_PATH}w`,
 `${NATO_PATH}x`,
 `${NATO_PATH}y`,
 `${NATO_PATH}z`,
]

export const getAudioPool = (audioSource) => {
  switch (audioSource) {
    case 'letters':
      return LETTER_AUDIO_POOL
    case 'numbers':
      return NUMBER_AUDIO_POOL
    case 'nato':
      return NATO_AUDIO_POOL
    default:
      return LETTER_2_AUDIO_POOL
  }
}

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
