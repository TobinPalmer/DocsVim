import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { type KeyboardOpts, VimBreakCodes, VimMode, VimRegisters } from '../types/vimTypes'

type KeyboardCommand = KeyboardOpts & { repeat?: number }

export const COMMAND_MAP = Object.freeze({
  INSERT: {
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
    },
  },
  VISUAL_LINE: {},
  VISUAL: {
    r(opts: KeyboardCommand = {}) {
      if (opts.metaKey) location.reload()
    },
    escape() {
      VIM.Vim.mode = VimMode.NORMAL
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
        console.log(opts.afterKeys[0])
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
    g: {
      g() {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Home', opts: { ctrlKey: true } },
        })
      },
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
      VIM.Vim.mode = VimMode.INSERT
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
    p() {
      // VIM.CommandQueue.add({
      //   func: DocsInteractions.pressKey,
      //   params: { key: 'End' },
      // })
      return VIM.CommandQueue.add({
        func: DocsInteractions.pasteFromRegister,
        params: { register: VimRegisters.DEFAULT },
      })
    },
    c: {
      c(opts: KeyboardCommand = {}) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.Vim.mode = VimMode.INSERT
        } else {
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
            params: { key: 'Delete' },
          })
          VIM.Vim.mode = VimMode.INSERT
        }
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
      d(opts: KeyboardCommand = {}) {
        if (opts.mac) {
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
          // DocsInteractions.copyCurrentLine({ fullLine: true }).then(() => {
          //   VIM.CommandQueue.add({
          //     func: DocsInteractions.pressKey,
          //     params: { key: 'Backspace', repeat: 2, opts: { shiftKey: true } },
          //     delay: 0,
          //   })
          // })
        }
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
          params: { key: 'Delete' },
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
    v: () => {
      VIM.Vim.mode = VimMode.VISUAL
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
      y() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        DocsInteractions.copyCurrentLine({ fullLine: true }).then(() => {})
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
