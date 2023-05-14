import docsInteraction from '../docs/docsInteraction'
import { VIM } from '../main'
import { VimMode, type KeyboardOpts } from '../types/vimTypes'

export const COMMAND_MAP = Object.freeze({
  insert: {
    escape: () => {
      VIM.vim.mode = VimMode.normal
    },
  },
  visualLine: {
    backspace: () => null,
    space: () => null,
    escape: () => null,
    g: () => null,
    '^': () => null,
    d: () => null,
    h: () => null,
    j: () => null,
    k: () => null,
    l: () => null,
    w: () => null,
    x: () => null,
    y: () => null,
  },
  visual: {
    escape(opts: KeyboardOpts = {}) {
      VIM.vim.mode = VimMode.normal
    },
    h(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft', opts: { shiftKey: true } },
      })
    },
    k(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowUp', opts: { shiftKey: true } },
      })
    },
    j(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowDown', opts: { shiftKey: true } },
      })
    },
    l(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { shiftKey: true } },
      })
    },
    y(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.copy,
        params: [],
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight' },
      })
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
  },
  normal: {
    j(opts: KeyboardOpts = {}) {
      const { ctrlKey, shiftKey, altKey } = opts
      if (shiftKey) {
        VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'ArrowDown' } })
        VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'ArrowLeft', opts: { ctrlKey: true } } })
        return VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'Backspace' } })
      }
      if (!ctrlKey && !altKey && !shiftKey) {
        return VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'ArrowDown' } })
      }
    },
    i(opts: KeyboardOpts = {}) {
      VIM.vim.mode = VimMode.insert
    },
    a() {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight' },
      })
      VIM.vim.mode = VimMode.insert
    },
    $(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { ctrlKey: true } },
      })
    },
    0(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
      })
    },
    h(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
    k(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowUp' },
      })
    },
    l(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight' },
      })
    },
    r(opts: KeyboardOpts = {}) {
      if (opts.metaKey) location.reload()
    },
    w(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true } },
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true } },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true } },
        delay: 0,
      })
    },
    e(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true } },
      })
    },
    d: {
      d: (opts: KeyboardOpts = {}) => {
        if (opts.mac) {
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'ArrowRight', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'ArrowDown' }, delay: 0 })
          VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'Backspace' } })
        } else {
          VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'Home' }, delay: 0 })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'End', opts: { shiftKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({ func: docsInteraction.pressKey, params: { key: 'Delete' } })
        }
      },
      i: {
        w: () => {
          VIM.CommandQueue.add({
            func: docsInteraction.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
            delay: 0,
          })
          return VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'Backspace' },
          })
        },
      },
      a: {
        w: () => {
          VIM.CommandQueue.add({
            func: docsInteraction.pasteText,
            params: { text: 'x' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'ArrowLeft', opts: { altKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'ArrowRight', opts: { altKey: true, shiftKey: true } },
            delay: 0,
          })
          return VIM.CommandQueue.add({
            func: docsInteraction.pressKey,
            params: { key: 'Backspace' },
          })
        },
      },
    },
    v: (opts: KeyboardOpts = {}) => {
      VIM.vim.mode = VimMode.visual
    },
    u(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.undo,
        params: [],
        delay: 0,
      })
    },
    b(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft', opts: { altKey: true } },
      })
    },
    x(opts: KeyboardOpts = {}) {
      VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight' },
        delay: 0,
      })
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'Backspace' },
      })
    },
    y(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.copy,
        params: [],
        delay: 0,
      })
    },
    Enter(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowDown' },
      })
    },
    Backspace(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowLeft' },
      })
    },
  },
  command: {},
  running: {},
} as const)
