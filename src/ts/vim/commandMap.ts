import docsInteraction from '../docs/docsInteraction'
import { VIM } from '../main'
import { type KeyboardOpts, VimMode } from '../types/vimTypes'

export const COMMAND_MAP = Object.freeze({
  insert: {
    Escape: () => {
      VIM.vim.mode = VimMode.normal
    },
  },
  visualLine: {
    Backspace: () => null,
    Space: () => null,
    Escape: () => null,
    G: () => null,
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
    $: () => null,
    0: () => null,
    Backspace: {
      visual: () => null,
      visualLine: () => null,
    },
    Space: {
      visual: () => null,
      visualLine: () => null,
    },
    Escape: {
      visual: () => null,
      insert: () => null,
      visualLine: () => null,
    },
    G: {
      visual: () => null,
      visualLine: () => null,
    },
    '^': {
      visual: () => null,
      visualLine: () => null,
    },
    b: () => null,
    c: () => null,
    d: {
      visual: () => null,
      visualLine: () => null,
    },
    e: () => null,
    g: () => null,
    h: {
      visual: () => null,
      visualLine: () => null,
    },
    j: {
      visual: () => null,
      visualLine: () => null,
    },
    k: {
      visual: () => null,
      visualLine: () => null,
    },
    l: {
      visual: () => null,
      visualLine: () => null,
    },
    u: () => null,
    w: {
      visual: () => null,
      visualLine: () => null,
    },
    x: {
      visual: () => null,
      visualLine: () => null,
    },
    y: {
      visual: () => null,
      visualLine: () => null,
    },
  },
  normal: {
    j(opts: KeyboardOpts = {}) {
      const { ctrlKey, shiftKey, altKey } = opts
      if (shiftKey) {
        VIM.CommandQueue.add({
          func: docsInteraction.pressKey,
          params: { key: 'ArrowDown' },
        })
        VIM.CommandQueue.add({
          func: docsInteraction.pressKey,
          params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
        })
        return VIM.CommandQueue.add({
          func: docsInteraction.pressKey,
          params: { key: 'Backspace' },
        })
      }
      if (!ctrlKey && !altKey && !shiftKey) {
        return VIM.CommandQueue.add({
          func: docsInteraction.pressKey,
          params: { key: 'ArrowDown' },
        })
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
      })
    },
    e(opts: KeyboardOpts = {}) {
      return VIM.CommandQueue.add({
        func: docsInteraction.pressKey,
        params: { key: 'ArrowRight', opts: { altKey: true } },
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
      null
    },
  },
  command: {},
  running: {},
} as const)
