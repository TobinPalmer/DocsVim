import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { VimBreakCodes, VimMode, type KeyboardOpts } from '../types/vimTypes'

type KeyboardCommand = KeyboardOpts & { repeat?: number }

export const COMMAND_MAP = Object.freeze({
  INSERT: {
    escape() {
      VIM.Vim.mode = VimMode.normal
    },
  },
  VISUAL_LINE: {},
  VISUAL: {
    escape() {
      VIM.Vim.mode = VimMode.normal
    },
    b() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true, shiftKey: true } },
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
    y() {
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
    f(opts: KeyboardCommand = {}) {
      if (opts.afterKeys) {
        if (opts.shiftKey) {
          console.log('shift key')
          VIM.CommandQueue.add({
            func: DocsInteractions.jumpTo,
            params: { target: opts.afterKeys[0].key, forward: false, repeat: opts.repeat },
            delay: 175,
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.jumpTo,
            params: { target: opts.afterKeys[0].key, forward: true, repeat: opts.repeat },
            delay: 175,
          })
        }
      }
      return { code: VimBreakCodes.find, required: 1 }
    },
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
      if (opts.shiftKey) {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
        })
      }
      VIM.Vim.mode = VimMode.insert
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
      VIM.Vim.mode = VimMode.insert
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
          VIM.Vim.mode = VimMode.insert
        } else {
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' }, delay: 0 })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'End', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Delete' } })
          VIM.Vim.mode = VimMode.insert
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
          VIM.Vim.mode = VimMode.insert
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
          VIM.Vim.mode = VimMode.insert
        },
      },
      k(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'up', mac: opts.mac, endsOnEmptyLine: true },
          delay: 0,
        })
        VIM.Vim.mode = VimMode.insert
      },
      j(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'down', mac: opts.mac, endsOnEmptyLine: true },
          delay: 0,
        })
        VIM.Vim.mode = VimMode.insert
      },
    },
    d: {
      k(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'up', mac: opts.mac, endsOnEmptyLine: false, repeat: opts.repeat },
          delay: 0,
        })
      },
      j(opts: KeyboardCommand = {}) {
        VIM.CommandQueue.add({
          func: DocsInteractions.deleteLines,
          params: { direction: 'down', mac: opts.mac, endsOnEmptyLine: false, repeat: opts.repeat },
          delay: 0,
        })
      },
      d(opts: KeyboardCommand = {}) {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
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
          VIM.CommandQueue.add({ func: DocsInteractions.pasteText, params: { text: 'x' }, delay: 0 })
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
          return VIM.CommandQueue.add({ func: DocsInteractions.pressKey, params: { key: 'Backspace' } })
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
    v: () => {
      VIM.Vim.mode = VimMode.visual
    },
    u() {
      return VIM.CommandQueue.add({ func: DocsInteractions.undo, params: [], delay: 0 })
    },
    b(opts: KeyboardCommand = {}) {
      return VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true }, repeat: opts.repeat },
      })
    },
    x() {
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
    y() {
      return VIM.CommandQueue.add({
        func: DocsInteractions.copy,
        params: [],
        delay: 0,
      })
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
  COMMAND: {},
  RUNNING: {},
} as const)
