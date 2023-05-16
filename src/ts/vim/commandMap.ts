import DocsInteractions from '../docs/DocsInteraction'
import { VIM } from '../main'
import { VimMode, type KeyboardOpts } from '../types/vimTypes'

type KeyboardCommand = KeyboardOpts & { repeat?: number }

export const COMMAND_MAP = Object.freeze({
  INSERT: {
    escape() {
      VIM.vim.mode = VimMode.normal
    },
  },
  VISUAL_LINE: {},
  VISUAL: {
    escape(opts: KeyboardCommand = {}) {
      VIM.vim.mode = VimMode.normal
    },
    b(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true, shiftKey: true } },
      })
    },
    w(opts: KeyboardCommand = {}) {
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
    h(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { shiftKey: true } },
      })
    },
    k(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowUp', opts: { shiftKey: true } },
      })
    },
    j(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowDown', opts: { shiftKey: true } },
      })
    },
    l(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', opts: { shiftKey: true } },
      })
    },
    y(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.copy,
        params: [],
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight' },
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
  },
  NORMAL: {
    j(opts: KeyboardCommand = {}) {
      const { ctrlKey, shiftKey, altKey } = opts
      if (shiftKey) {
        VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'ArrowDown' } })
        VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'ArrowLeft', opts: { ctrlKey: true } } })
        return VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Backspace' } })
      }
      if (!ctrlKey && !altKey && !shiftKey) {
        return VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowDown', repeat: opts.repeat },
        })
      }
      return false
    },
    i(opts: KeyboardCommand = {}) {
      VIM.vim.mode = VimMode.insert
    },
    a(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', repeat: opts.repeat },
      })
      VIM.vim.mode = VimMode.insert
    },
    $(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight', opts: { ctrlKey: true }, repeat: opts.repeat },
      })
    },
    0(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { ctrlKey: true }, repeat: opts.repeat },
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
        params: { key: 'ArrowRight', opts: { altKey: true }, repeat: opts.repeat ? opts.repeat + 1 : 1 },
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
        params: { key: 'ArrowRight', opts: { altKey: true }, repeat: opts.repeat },
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
          VIM.vim.mode = VimMode.insert
        } else {
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'End', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' } })
          VIM.vim.mode = VimMode.insert
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
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
          VIM.vim.mode = VimMode.insert
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
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
          VIM.vim.mode = VimMode.insert
        },
      },
      k(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'up' },
          delay: 0,
        })
        // if (opts.mac) {
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'ArrowRight', opts: { ctrlKey: true } },
        //     delay: 0,
        //   })
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
        //     delay: 0,
        //   })
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'ArrowUp', opts: { shiftKey: true } },
        //     delay: 0,
        //   })
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'Backspace', opts: { ctrlKey: true } },
        //     delay: 0,
        //   })
        // } else {
        //   VIM.CommandQueue.add({ func: docsInteractions.pressKey, params: { key: 'End' }, delay: 0 })
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'Home', opts: { shiftKey: true } },
        //     delay: 0,
        //   })
        //   VIM.CommandQueue.add({
        //     func: docsInteractions.pressKey,
        //     params: { key: 'ArrowUp', opts: { shiftKey: true } },
        //     delay: 0,
        //   })
        //   VIM.CommandQueue.add({ func: docsInteractions.pressKey, params: { key: 'Delete' } })
        // }
        VIM.vim.mode = VimMode.insert
      },
      j(opts: KeyboardCommand = {}) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'End' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Home', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' } })
        }
        VIM.vim.mode = VimMode.insert
      },
    },
    d: {
      k(opts: KeyboardCommand = {}) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
          })
        } else {
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'End' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Home', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
          })
        }
      },
      j(opts: KeyboardCommand = {}) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowRight', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'End' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Home', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowUp', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Delete', opts: { ctrlKey: true } },
          })
        }
      },
      d: (opts: KeyboardCommand = {}) => {
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
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'ArrowDown' }, delay: 0 })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Backspace' } })
        } else {
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'End', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' } })
        }
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
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
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
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
            delay: 0,
          })
          return VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
          })
        },
      },
    },
    v: (opts: KeyboardCommand = {}) => {
      VIM.vim.mode = VimMode.visual
    },
    u(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.undo,
        params: [],
        delay: 0,
      })
    },
    b(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true } },
      })
    },
    x(opts: KeyboardCommand = {}) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight' },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'Backspace' },
      })
    },
    y(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.copy,
        params: [],
        delay: 0,
      })
    },
    Enter(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowDown' },
      })
    },
    Backspace(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
  },
  COMMAND: {},
  RUNNING: {},
} as const)
