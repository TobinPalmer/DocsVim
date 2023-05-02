import { GLOBALS, VIM } from '../main'
import { vimMode } from '../types/vimTypes'
// import { Motion } from './Motion'

export default class Vim {
  constructor(private _mode: keyof typeof vimMode) {}
  // private motion = new Motion()

  get mode() {
    return this._mode
  }

  set mode(mode: keyof typeof vimMode) {
    this._mode = mode
  }

  private static keyToString(key: string) {
    const mapper = {}
    return mapper[key as keyof typeof mapper] || key
  }

  public keydown(key: string) {
    if (key === 'escape' && this.mode !== 'normal') {
      this.mode = 'normal'
    }
    if (this.mode === 'normal') {
      VIM.motion.feedkey(Vim.keyToString(key))
    }
  }
}
