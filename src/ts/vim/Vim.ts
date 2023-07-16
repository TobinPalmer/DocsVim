import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { type KeyboardOpts, PlaybackStatus, VimMode } from '../types/vimTypes'
import { Keys } from '../input/FormatKey'
import Macro from './Macro'

/**
 * Vim class that handles different vim modes and input
 */
export default class Vim {
  private pasteEscape = false

  private _mode: VimMode = VimMode.INSERT

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
      case VimMode.NORMAL:
      case VimMode.VISUAL:
      case VimMode.VISUAL_LINE:
        DocsInteractions.setCursorWidth({
          // eslint-disable-next-line no-magic-numbers
          width: DocsInteractions.getFontSize() / 2,
        })
        break
      case VimMode.INSERT:
        // docsInteractions.setCursorWidth({ width: 1 * docsInteractions.getFontSize() })
        DocsInteractions.setCursorWidth({
          width: 2,
          isInsertMode: true,
        })
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
  private static _keyToString(key: string): keyof Keys {
    const mapper = {
      '.': 'dot',
      ',': 'comma',
      '@': 'at',
    }
    return (mapper[key as keyof typeof mapper] || key) as keyof Keys
  }

  /**
   * Handles a key down press event.
   * @param key the key to handle
   * @param opts the options to pass to the keydown event
   */
  public keydown(key: string, opts: KeyboardOpts = {}): boolean {
    opts.mac ??= VIM.isMac
    const result = VIM.Motion.feedkey(Vim._keyToString(key), opts)

    if (VIM.Macro.status.playbackStatus === PlaybackStatus.RECORDING) {
      Macro.record(key, opts, VIM.Macro.status.register)
    }

    if (this.pasteEscape) {
      DocsInteractions.pasteText({ text: key })
      this.pasteEscape = false
    }

    if (key === Macro.PASTE_ESCAPE) {
      this.pasteEscape = true
    }

    if (this._mode === VimMode.INSERT) {
      return result
    }

    return true
  }
}
