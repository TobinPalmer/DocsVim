import docsInteractions from '../docs/docsInteraction'
import { VIM } from '../main'
import { type KeyboardOpts, VimMode } from '../types/vimTypes'

/**
 * Vim class that handles different vim modes and input
 */
export default class Vim {
  private _mode: VimMode = VimMode.insert

  /**
   * Gets the current mode
   */
  public get mode(): VimMode {
    return this._mode
  }

  /**
   * Sets the current mode
   * @param mode the mode to set
   */
  public set mode(mode: VimMode) {
    this._mode = mode
    VIM.statusline.update()

    switch (mode) {
      case VimMode.normal:
      case VimMode.visual:
      case VimMode.visualLine:
        docsInteractions.setCursorWidth({ width: docsInteractions.getFontSize() / 2 })
        break
      case VimMode.insert:
        // docsInteractions.setCursorWidth({ width: 1 * docsInteractions.getFontSize() })
        // console.log('changing to insert mode', docsInteractions.getFontSize())
        docsInteractions.setCursorWidth({ width: 2 })
        break
    }
  }

  /**
   * converts normal keys to vim keys
   * @param key the key to convert
   * @returns either the key you passed in or a formatted key
   */
  private static _keyToString(key: string) {
    const mapper = {}
    return mapper[key as keyof typeof mapper] || key
  }

  /**
   * Handles a key down press event.
   * @param key the key to handle
   */
  public keydown(key: string, opts: KeyboardOpts = {}): boolean {
    opts.mac = opts.mac ?? this._mode === VimMode.insert
    console.log(`${this._mode.toUpperCase()}: ${key}`)
    const result = VIM.motion.feedkey(Vim._keyToString(key), opts)

    if (this._mode === VimMode.insert) return result

    return true
  }
}
