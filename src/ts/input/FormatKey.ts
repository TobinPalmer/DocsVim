interface nonNormalKeys {
  ctrl: string
}

const keysList = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',
  i: 'i',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'o',
  p: 'p',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  u: 'u',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Meta: 'Meta',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  Enter: 'Enter',
  Escape: 'Escape',
  Tab: 'Tab',
  Shift: 'Shift',
  '.': 'dot',
  ':': ':',
} as const

export type Keys = typeof keysList & nonNormalKeys

/**
 * Format util that formats keys to the correct platform.
 */
const Format = {
  /**
   * Formats a key to the correct platform.
   */
  format(key: keyof Keys, mac = false): keyof Keys {
    return this._getKeys(mac)[key] as keyof Keys
  },

  /**
   * Returns the keys for the current platform.
   * @private
   */
  _getKeys(mac?: boolean): Keys {
    return {
      ...keysList,
      ctrl: mac ? 'Meta' : 'Control',
    } as const
  },
}

export default Format
