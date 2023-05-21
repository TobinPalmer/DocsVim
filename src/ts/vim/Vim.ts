import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { VimMode, type KeyboardOpts } from '../types/vimTypes'

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
    setTimeout(() => {
      this._mode = mode
      VIM.Statusline.update()
    }, 0)

    switch (mode) {
      case VimMode.normal:
      case VimMode.visual:
      case VimMode.visualLine:
        DocsInteractions.setCursorWidth({ width: DocsInteractions.getFontSize() / 2 })
        break
      case VimMode.insert:
        // docsInteractions.setCursorWidth({ width: 1 * docsInteractions.getFontSize() })
        DocsInteractions.setCursorWidth({ width: 2, isInsertMode: true })
        break
      default:
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
    // opts.mac = opts.mac ?? this._mode === VimMode.insert
    opts.mac ??= VIM.isMac
    const result = VIM.Motion.feedkey(Vim._keyToString(key), opts)

    if (this._mode === VimMode.insert) return result

    return true
  }
}
