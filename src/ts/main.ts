import docsInteraction from './docs/docsInteraction'
import test from './test'
import CommandQueue from './vim/CommandQueue'
import { Motion } from './vim/Motion'
import Vim from './vim/Vim'
import VimBuffer from './vim/VimBuffer'
export const isMac = true
export const vim = new Vim('insert')
export const interactions = new docsInteraction()

export const GLOBALS = Object.freeze({
  isMac: navigator.userAgent.indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('MAC') >= 0,
  interactions: new docsInteraction(),
} as const)

export const VIM = Object.freeze({
  vim: new Vim('insert'),
  VimBuffer: new VimBuffer(),
  CommandQueue: new CommandQueue(),
  motion: new Motion(),
} as const)

test()
// VIM.motion.feedkey('normal')
// VIM.motion.feedkey('d')
// VIM.motion.feedkey('i')
// VIM.motion.feedkey('w')
