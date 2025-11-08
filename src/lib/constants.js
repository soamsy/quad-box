export const SHAPE_POOL = [
  'diamond',
  'heart',
  'hemicircle',
  'octagon',
  'square',
  'star',
  'triangle',
  'cross',
  'crescent',
]

export const TETRIS_POOL = [
  'tetris_i',
  'tetris_t',
  'tetris_z',
  'tetris_l',
  'tetris_u',
  'tetris_arrow',
  'tetris_cross',
  'tetris_zig',
  'tetris_corner',
]

export const ICONS_A_POOL = [
  'full_lucide_cookie',
  'full_lucide_swatch_book',
  'full_graphene_apps',
  'full_mindustry',
  'full_biome',
  'full_emoji_tooth',
  'full_nebbia_kwgt',
  'full_signal_alt_1',
  'full_guardians',
  'full_grasshopper',
  'full_goodtime',
  'full_gms_flags',
  'full_tokyo_amesh_log',
  'full_toogoodtogo',
  'full_canli_doviz',
  'full_beehive',
  'full_diaspora',
  'full_bubble_pop',
  'full_officesuite',
  'full_status2',
  'full_youdao_note',
  'full_unity_remote',
  'full_unacademy',
  'full_tuta_alt',
  'full_toast_takeout',
  'full_siyuan',
  'full_airtel',
  'full_alfred_camera',
  'full_apcoa_flow',
  'full_cloud',
  'full_deezer',
  'full_emoji_beans',
  'full_2050',
  'full_lucide_command',
  'full_domestika',
  'full_mbills',
  'big_lightbulb',
  'big_stairs',
  'big_parent',
  'big_alarm',
  'big_brush',
  'big_gate',
]

export const ICONS_B_POOL = [
  'full_lucide_bean',
  'full_lucide_snail',
  'full_lucide_hamburger',
  'full_lucide_worm',
  'full_lucide_fish',
  'full_breadboard',
  'full_money_manager',
  'full_afvalwijzer',
  'full_toxic',
  'full_emoji_baby_bottle',
  'full_emoji_bat',
  'full_emoji_thunder_cloud_and_rain',
  'full_lego_builder',
  'full_quacker',
  'full_samsung_gift_indonesia',
  'full_toxic',
  'full_altcoinprices',
  'full_oroaming',
  'full_emoji_mushroom',
  'full_repainter',
  'full_bos_funk',
  'full_cherrygram',
  'full_life_fits_into_home',
  'full_meditation_assistant_alt',
  'full_functiongenerator',
  'big_cake',
  'big_beer',
  'big_plant',
  'big_camera',
  'big_planet',
]

export const ALL_SHAPES_POOL = [ ...SHAPE_POOL, ...TETRIS_POOL, ...ICONS_A_POOL, ...ICONS_B_POOL ]

export const LIGHT_PALETTE = {
  red: '#FF2233',
  green: '#35FF55',
  blue: '#2545FF',
  yellow: '#FBFB61',
  purple: '#8831EA',
  cyan: '#69FCFF',
  orange: '#FF9320',
  pink: '#FC75BA',
  inner: '#313131',
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
  inner: '#FFFFFF',
}

export const COLOR_POOL = Object.keys(LIGHT_PALETTE).filter(key => key !== 'inner')

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

const LETTERS_M1_PATH = "LettersM1/"
export const LETTER_M1_AUDIO_POOL = [
 `${LETTERS_M1_PATH}a`,
 `${LETTERS_M1_PATH}d`,
 `${LETTERS_M1_PATH}g`,
 `${LETTERS_M1_PATH}i`,
 `${LETTERS_M1_PATH}k`,
 `${LETTERS_M1_PATH}m`,
 `${LETTERS_M1_PATH}o`,
 `${LETTERS_M1_PATH}s`,
 `${LETTERS_M1_PATH}z`,
 `${LETTERS_M1_PATH}b`,
 `${LETTERS_M1_PATH}e`,
 `${LETTERS_M1_PATH}j`,
]

const LETTERS_M2_PATH = "LettersM2/"
export const LETTER_M2_AUDIO_POOL = [
  `${LETTERS_M2_PATH}a`,
  `${LETTERS_M2_PATH}c`,
  `${LETTERS_M2_PATH}d`,
  `${LETTERS_M2_PATH}e`,
  `${LETTERS_M2_PATH}h`,
  `${LETTERS_M2_PATH}i`,
  `${LETTERS_M2_PATH}j`,
  `${LETTERS_M2_PATH}k`,
  `${LETTERS_M2_PATH}l`,
  `${LETTERS_M2_PATH}m`,
  `${LETTERS_M2_PATH}p`,
  `${LETTERS_M2_PATH}q`,
  `${LETTERS_M2_PATH}t`,
  `${LETTERS_M2_PATH}u`,
  `${LETTERS_M2_PATH}v`,
]

const LETTERS_F1_PATH = "LettersF1/"
export const LETTER_F1_AUDIO_POOL = [
  `${LETTERS_F1_PATH}a`,
  `${LETTERS_F1_PATH}b`,
  `${LETTERS_F1_PATH}c`,
  `${LETTERS_F1_PATH}d`,
  `${LETTERS_F1_PATH}e`,
  `${LETTERS_F1_PATH}f`,
  `${LETTERS_F1_PATH}g`,
  `${LETTERS_F1_PATH}h`,
  `${LETTERS_F1_PATH}i`,
  `${LETTERS_F1_PATH}j`,
  `${LETTERS_F1_PATH}k`,
  `${LETTERS_F1_PATH}l`,
  `${LETTERS_F1_PATH}n`,
  `${LETTERS_F1_PATH}o`,
  `${LETTERS_F1_PATH}p`,
  `${LETTERS_F1_PATH}q`,
  `${LETTERS_F1_PATH}r`,
  `${LETTERS_F1_PATH}s`,
  `${LETTERS_F1_PATH}t`,
  `${LETTERS_F1_PATH}u`,
  `${LETTERS_F1_PATH}w`,
  `${LETTERS_F1_PATH}x`,
  `${LETTERS_F1_PATH}y`,
  `${LETTERS_F1_PATH}z`,
]

const LETTERS_F2_PATH = "LettersF2/"
export const LETTER_F2_AUDIO_POOL = [
  `${LETTERS_F2_PATH}a`,
  `${LETTERS_F2_PATH}b`,
  `${LETTERS_F2_PATH}c`,
  `${LETTERS_F2_PATH}d`,
  `${LETTERS_F2_PATH}f`,
  `${LETTERS_F2_PATH}g`,
  `${LETTERS_F2_PATH}k`,
  `${LETTERS_F2_PATH}l`,
  `${LETTERS_F2_PATH}m`,
  `${LETTERS_F2_PATH}q`,
  `${LETTERS_F2_PATH}r`,
  `${LETTERS_F2_PATH}x`,
  `${LETTERS_F2_PATH}y`,
  `${LETTERS_F2_PATH}z`,
]

const LETTERS_F3_PATH = "LettersF3/"
export const LETTER_F3_AUDIO_POOL = [
  `${LETTERS_F3_PATH}b`,
  `${LETTERS_F3_PATH}c`,
  `${LETTERS_F3_PATH}g`,
  `${LETTERS_F3_PATH}i`,
  `${LETTERS_F3_PATH}j`,
  `${LETTERS_F3_PATH}m`,
  `${LETTERS_F3_PATH}l`,
  `${LETTERS_F3_PATH}t`,
  `${LETTERS_F3_PATH}k`,
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

const SYL_5_PATH = "syl5/"
export const SYL_5_AUDIO_POOL = [
  `${SYL_5_PATH}a`,
  `${SYL_5_PATH}c`,
  `${SYL_5_PATH}e`,
  `${SYL_5_PATH}g`,
  `${SYL_5_PATH}i`,
  `${SYL_5_PATH}k`,
  `${SYL_5_PATH}m`,
  `${SYL_5_PATH}o`,
  `${SYL_5_PATH}q`,
  `${SYL_5_PATH}s`,
  `${SYL_5_PATH}u`,
  `${SYL_5_PATH}b`,
  `${SYL_5_PATH}d`,
  `${SYL_5_PATH}f`,
  `${SYL_5_PATH}h`,
  `${SYL_5_PATH}j`,
  `${SYL_5_PATH}l`,
  `${SYL_5_PATH}n`,
  `${SYL_5_PATH}p`,
  `${SYL_5_PATH}r`,
  `${SYL_5_PATH}t`,
  `${SYL_5_PATH}v`,
]

const SYL_10_PATH = "syl10/"
export const SYL_10_AUDIO_POOL = [
  `${SYL_10_PATH}a`,
  `${SYL_10_PATH}d`,
  `${SYL_10_PATH}f`,
  `${SYL_10_PATH}h`,
  `${SYL_10_PATH}j`,
  `${SYL_10_PATH}l`,
  `${SYL_10_PATH}n`,
  `${SYL_10_PATH}p`,
  `${SYL_10_PATH}r`,
  `${SYL_10_PATH}t`,
  `${SYL_10_PATH}b`,
  `${SYL_10_PATH}e`,
  `${SYL_10_PATH}g`,
  `${SYL_10_PATH}i`,
  `${SYL_10_PATH}k`,
  `${SYL_10_PATH}m`,
  `${SYL_10_PATH}o`,
  `${SYL_10_PATH}q`,
  `${SYL_10_PATH}s`,
  `${SYL_10_PATH}u`,
]

export const getAudioPool = (audioSource) => {
  switch (audioSource) {
    case 'letters':
      return LETTER_F3_AUDIO_POOL
    case 'letters2':
      return LETTER_M1_AUDIO_POOL
    case 'letters3':
      return LETTER_M2_AUDIO_POOL
    case 'letters4':
      return LETTER_F2_AUDIO_POOL
    case 'letters5':
      return LETTER_F1_AUDIO_POOL
    case 'numbers':
      return NUMBER_AUDIO_POOL
    case 'nato':
      return NATO_AUDIO_POOL
    case 'syl5':
      return SYL_5_AUDIO_POOL
    case 'syl10':
      return SYL_10_AUDIO_POOL
    default:
      return LETTER_M1_AUDIO_POOL
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

export const POSITION_POOL_2D = [
  '0-0',
  '0-1',
  '0-2',
  '1-0',
  '1-1',
  '1-2',
  '2-0',
  '2-1',
  '2-2',
  '0-0',
  '0-1',
  '0-2',
  '1-0',
  '1-1',
  '1-2',
  '2-0',
  '2-1',
  '2-2',
  '0-0',
  '0-1',
  '0-2',
  '1-0',
  '1-1',
  '1-2',
  '2-0',
  '2-1',
  '2-2',
]
