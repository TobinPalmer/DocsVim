import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import {
  type KeyboardOpts,
  LAST_COMMAND_KEYS,
  PlaybackStatus,
  SpecialRegisters,
  VimBreakCodes,
  VimMode,
  VimRegisters,
} from '../types/vimTypes'
import Macro from './Macro'
import Statusline from './Statusline'

type KeyboardCommand = KeyboardOpts & { repeat?: number }

export const COMMAND_MAP = Object.freeze({
  INSERT: {
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
    },
  },
  VISUAL_LINE: {
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
      DocsInteractions.stopSelecting()
    },
    j() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowDown', opts: { shiftKey: true } },
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'End', opts: { shiftKey: true } },
      })
    },
    k() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowUp', opts: { shiftKey: true } },
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'End', opts: { shiftKey: true } },
      })
    },
  },
  VISUAL: {
    r(opts: KeyboardCommand = {}) {
      if (opts.metaKey) location.reload()
    },
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
      DocsInteractions.stopSelecting()
    },
    b() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true, shiftKey: true } },
      })
    },
    d() {
      VIM.CommandQueue.add({
        params: {},
        func: VIM.Register.copyText,
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'Backspace' },
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.stopSelecting,
        params: [],
      })
    },
    y() {
      VIM.Register.copyText({ fullLine: false }).then(() => {
        VIM.CommandQueue.add({
          func: DocsInteractions.stopSelecting,
          params: [],
        })
      })
    },
    w() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true, shiftKey: true } },
        delay: 0,
      })
    },
    h() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { shiftKey: true } },
      })
    },
    k() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowUp', opts: { shiftKey: true } },
      })
    },
    j() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowDown', opts: { shiftKey: true } },
      })
    },
    l() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', opts: { shiftKey: true } },
      })
    },
  },
  NORMAL: {
    dot(opts: KeyboardCommand = {}) {
      const command = VIM.VimBuffer.buffer.get('LAST_COMMAND_KEYS' as SpecialRegisters) as LAST_COMMAND_KEYS
      const keys = command.key.split('')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let commandFn: Record<string, any> = COMMAND_MAP.NORMAL
      for (let i = 0; i < keys.length; i++) {
        commandFn = commandFn[keys[i] as keyof typeof commandFn]
      }

      const isFunction = (x: unknown): x is (options: KeyboardOpts) => void => typeof x === 'function'

      if (isFunction(commandFn)) {
        for (let i = 0; i < (opts.repeat ?? 1); i++) {
          commandFn(command.opts ?? {})
        }
      }
    },
    // eslint-disable-next-line consistent-return
    q(opts: KeyboardCommand = {}) {
      if (VIM.Macro.status.playbackStatus === PlaybackStatus.STOPPED && !opts.afterKeys) {
        return { code: VimBreakCodes.macro_register, required: 1 }
      }

      if (VIM.Macro.status.playbackStatus === PlaybackStatus.RECORDING) {
        Statusline.showMessage('')
        VIM.Statusline.update()
        VIM.Macro.status = { playbackStatus: PlaybackStatus.STOPPED, register: '' }
      }

      if (opts.afterKeys && VIM.Macro.status.playbackStatus === PlaybackStatus.STOPPED) {
        const [afterKey] = opts.afterKeys
        Statusline.showMessage(`Recording: @${afterKey.key}`)
        VIM.Statusline.update()
        Macro.clearMacro(afterKey.key)
        // Wait to set status so that the key is not recorded
        setTimeout(() => {
          VIM.Macro.status = { playbackStatus: PlaybackStatus.RECORDING, register: afterKey.key }
        })
      }
    },
    at(opts: KeyboardCommand = {}) {
      if (opts.afterKeys) {
        const [afterKey] = opts.afterKeys
        const macro = Macro.getMacroText(VIM.VimBuffer.getMacroMap().get(afterKey.key) || [])

        VIM.Macro.status = { playbackStatus: PlaybackStatus.PLAYING, register: afterKey.key }
        Macro.runMacro({ keys: macro, repeat: opts.repeat ?? 1 })
        return
      }

      if (!opts.afterKeys) {
        // eslint-disable-next-line consistent-return
        return { code: VimBreakCodes.macro, required: 1 }
      }
    },
    o(opts: KeyboardCommand = {}) {
      if (opts.shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowUp' },
          delay: 0,
        })
      }
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'End' },
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'Enter' },
      })
    },
    f(opts: KeyboardCommand = {}) {
      if (opts.afterKeys) {
        // if (opts.afterKeys[0].key === 'Shift') return { code: VimBreakCodes.find, required: 1 }
        if (opts.shiftKey) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.jumpTo,
            params: {
              target: opts.afterKeys[0].key,
              forward: false,
              repeat: opts.repeat,
            },
            delay: 175,
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.jumpTo,
            params: {
              target: opts.afterKeys[0].key,
              forward: true,
              repeat: opts.repeat,
            },
            delay: 175,
          })
        }
      }
      return { code: VimBreakCodes.find, required: 1 }
    },
    j(opts: KeyboardCommand = {}) {
      const { ctrlKey, shiftKey, altKey } = opts
      if (shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowDown' },
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
        })
        return VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Backspace' },
        })
      }
      if (!ctrlKey && !altKey && !shiftKey) {
        return VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowDown', repeat: opts.repeat },
        })
      }
      return false
    },
    g(opts: KeyboardCommand = {}) {
      if (opts.shiftKey) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', opts: { ctrlKey: true } },
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'End', opts: { ctrlKey: true } },
          })
        }
      }
      // Keys that we have motions for, ex gg, gk, gj
      const gKeys = ['g', 'j', 'k']
      if (opts.afterKeys && gKeys.includes(opts.afterKeys[0].key)) {
        if (opts.afterKeys[0].key === 'g') {
          if (opts.mac) {
            VIM.CommandQueue.add({
              func: DocsInteractions.pressKey,
              params: { key: 'ArrowUp', opts: { ctrlKey: true } },
            })
          } else {
            VIM.CommandQueue.add({
              func: DocsInteractions.pressKey,
              params: { key: 'Home', opts: { ctrlKey: true } },
            })
          }
        }
        if (opts.afterKeys[0].key === 'j') {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', repeat: opts.repeat },
          })
        }
        if (opts.afterKeys[0].key === 'k') {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', repeat: opts.repeat },
          })
        }
      }
      return { code: VimBreakCodes.g, required: 1 }
    },
    i(opts: KeyboardCommand = {}) {
      if (opts.shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
        })
      }
      VIM.Vim.mode = VimMode.INSERT
    },
    a(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight' },
      })
      if (opts.shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowRight', opts: { ctrlKey: true } },
        })
      }

      const COMMAND_QUEUE_DELAY = 15
      setTimeout(() => {
        VIM.Vim.mode = VimMode.INSERT
      }, COMMAND_QUEUE_DELAY)
    },
    $(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: {
          key: 'ArrowRight',
          opts: { ctrlKey: true },
          repeat: opts.repeat,
        },
      })
    },
    '0'() {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
      })
    },
    h(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', repeat: opts.repeat },
      })
    },
    k(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowUp', repeat: opts.repeat },
      })
    },
    l(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', repeat: opts.repeat },
      })
    },
    r(opts: KeyboardCommand = {}) {
      if (opts.metaKey) location.reload()
    },
    w(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: {
          key: 'ArrowRight',
          opts: { altKey: true },
          repeat: opts.repeat ? opts.repeat + 1 : 1,
        },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true } },
        delay: 0,
      })
    },
    e(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: {
          key: 'ArrowRight',
          opts: { altKey: true },
          repeat: opts.repeat,
        },
      })
    },
    p(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pasteFromRegister,
        params: { register: VimRegisters.DEFAULT, repeat: opts.repeat },
      })
    },
    c: {
      c() {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Home' },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'End', opts: { shiftKey: true } },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Backspace' },
          delay: 0,
        })

        const DELAY = 30
        setTimeout(() => {
          VIM.Vim.mode = VimMode.INSERT
        }, DELAY)
      },
      i: {
        w: () => {
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: {
              key: 'ArrowRight',
              opts: { altKey: true, shiftKey: true },
            },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
          VIM.Vim.mode = VimMode.INSERT
        },
      },
      a: {
        w: () => {
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: {
              key: 'ArrowRight',
              opts: { altKey: true, shiftKey: true },
            },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
          VIM.Vim.mode = VimMode.INSERT
        },
      },
      k(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'up', mac: opts.mac, endsOnEmptyLine: true },
          delay: 0,
        })
        VIM.Vim.mode = VimMode.INSERT
      },
      j(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'down', mac: opts.mac, endsOnEmptyLine: true },
          delay: 0,
        })
        VIM.Vim.mode = VimMode.INSERT
      },
    },
    d: {
      k(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: {
            direction: 'up',
            mac: opts.mac,
            endsOnEmptyLine: false,
            repeat: opts.repeat,
          },
          delay: 0,
        })
      },
      j(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: {
            direction: 'down',
            mac: opts.mac,
            endsOnEmptyLine: false,
            repeat: opts.repeat,
          },
          delay: 0,
        })
      },
      d() {
        VIM.CommandQueue.add({
          func: DocsInteractions.copyCurrentLine,
          params: { fullLine: true },
        })
        // VIM.CommandQueue.add({
        //   func: DocsInteractions.pressKey,
        //   params: { key: 'Backspace', repeat: 2, opts: { shiftKey: true } },
        // })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Home' },
          // delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'End', opts: { shiftKey: true } },
          // delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Backspace', repeat: 2 },
        })
      },
      i: {
        w() {
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: {
              key: 'ArrowRight',
              opts: { altKey: true, shiftKey: true },
            },
            delay: 0,
          })
          return VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
        },
      },
      a: {
        w() {
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: {
              key: 'ArrowRight',
              opts: { altKey: true, shiftKey: true },
            },
            delay: 0,
          })
          return VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
        },
      },
    },
    v(opts: KeyboardCommand = {}) {
      if (opts.shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Home' },
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'End', opts: { shiftKey: true } },
        })
        VIM.Vim.mode = VimMode.VISUAL_LINE
      } else VIM.Vim.mode = VimMode.VISUAL
    },
    s: {
      i: {
        w() {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight', opts: { altKey: true } },
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { shiftKey: true, altKey: true } },
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: ' ' },
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteFromRegister,
            params: { register: VimRegisters.DEFAULT },
          })
        },
      },
    },
    u() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.undo,
        params: [],
        delay: 0,
      })
    },
    b(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: {
          key: 'ArrowLeft',
          opts: { altKey: true },
          repeat: opts.repeat,
        },
      })
    },
    x(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', repeat: opts.repeat },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'Backspace', repeat: opts.repeat },
      })
    },
    y: {
      s: {
        i: {
          w(opts: KeyboardCommand = {}) {
            if (opts.afterKeys) {
              // Key isn't a modifier key.
              if (
                !['Escape', 'Meta', 'Alt', 'Control', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
                  opts.afterKeys[0].key,
                )
              ) {
                VIM.CommandQueue.add({
                  func: DocsInteractions.pressKey,
                  params: { key: 'ArrowRight', opts: { altKey: true } },
                })
                VIM.CommandQueue.add({
                  func: DocsInteractions.pressKey,
                  params: { key: 'ArrowLeft', opts: { altKey: true } },
                })

                VIM.CommandQueue.add({
                  func: DocsInteractions.pasteText,
                  params: { text: opts.afterKeys[0].key },
                })

                VIM.CommandQueue.add({
                  func: DocsInteractions.pressKey,
                  params: { key: 'ArrowRight', opts: { altKey: true } },
                })

                VIM.CommandQueue.add({
                  func: DocsInteractions.pasteText,
                  params: { text: opts.afterKeys[0].key },
                })
              }
            }
            return { code: VimBreakCodes.wrap, required: 1 }
          },
        },
        s(opts: KeyboardCommand = {}) {
          if (opts.afterKeys) {
            // Key isn't a modifier key.
            if (
              !['Escape', 'Meta', 'Alt', 'Control', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
                opts.afterKeys[0].key,
              )
            ) {
              VIM.CommandQueue.add({
                func: DocsInteractions.pressKey,
                params: { key: 'Home' },
              })

              VIM.CommandQueue.add({
                func: DocsInteractions.pasteText,
                params: { text: opts.afterKeys[0].key },
              })

              VIM.CommandQueue.add({
                func: DocsInteractions.pressKey,
                params: { key: 'End' },
              })

              VIM.CommandQueue.add({
                func: DocsInteractions.pasteText,
                params: { text: opts.afterKeys[0].key },
              })
            }
          }
          return { code: VimBreakCodes.wrap, required: 1 }
        },
      },
      y() {
        DocsInteractions.copyCurrentLine({ fullLine: true })
      },
    },
    Enter() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowDown' },
      })
    },
    Backspace() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
  },
  COMMAND: {
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
    },
    r(opts: KeyboardCommand = {}) {
      if (opts.metaKey) location.reload()
    },
  },
  RUNNING: {},
} as const)
