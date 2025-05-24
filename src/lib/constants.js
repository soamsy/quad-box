export const SHAPES = {
  diamond: `
    M50,0 L100,50 L50,100 L0,50 Z
  `,
  heart: `
    M50,90 
    C20,70 0,40 25,20 
    A15,15 0 0,1 50,30 
    A15,15 0 0,1 75,20 
    C100,40 80,70 50,90 Z
  `,
  hemicircle: `
    M0,50 
    A50,50 0 0,1 100,50 
    L100,100 
    L0,100 Z
  `,
  octagon: `
    M30,0 L70,0 L100,30 L100,70 L70,100 L30,100 L0,70 L0,30 Z
  `,
  square: `
    M0,0 H100 V100 H0 Z
  `,
  star: `
    M50,0 
    L61.8,35.1 L100,35.1 
    L69.1,57 L80.9,91.0 
    L50,70 L19.1,91 
    L30.9,57 L0,35.1 
    L38.2,35.1 Z
  `,
  trapezoid: `
    M25,0 L75,0 L100,100 L0,100 Z
  `,
  triangle: `
    M50,0 L100,100 L0,100 Z
  `
}

export const DARK_PALETTE = {
  red: '#FF6370',
  green: '#65FF85',
  blue: '#2555FF',
  yellow: '#FCFC69',
  purple: '#B365FF',
  cyan: '#69FCFF',
  monochrome: '#FFFFFF',
  orange: '#FF9355',
  pink: '#FF65B3',
  brown: '#504512',
}

export const LIGHT_PALETTE = {
  red: '#FF2320',
  green: '#20FF30',
  blue: '#1525FF',
  yellow: '#FCFC09',
  purple: '#7325FF',
  cyan: '#09FCFF',
  monochrome: '#000000',
  orange: '#FF9000',
  pink: '#FF45C3',
  brown: '#765000',
}

export const COLOR_POOL = Object.keys(LIGHT_PALETTE)
export const SHAPE_POOL = Object.keys(SHAPES)

const NATURAL_PATH = "Natural-Numbers/"
export const AUDIO_POOL = [
  `${NATURAL_PATH}1.wav`,
  `${NATURAL_PATH}2.wav`,
  `${NATURAL_PATH}3.wav`,
  `${NATURAL_PATH}4.wav`,
  `${NATURAL_PATH}5.wav`,
  `${NATURAL_PATH}6.wav`,
  `${NATURAL_PATH}7.wav`,
  `${NATURAL_PATH}8.wav`,
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