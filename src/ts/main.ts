import docsInteraction from './docs/docsInteraction'
import test from './test'
import CommandQueue from './vim/CommandQueue'
import { Motion } from './vim/Motion'
import Register from './vim/Register'
import Statusline from './vim/Statusline'
import Vim from './vim/Vim'
import VimBuffer from './vim/VimBuffer'

export const VIM = {
  isMac: navigator.userAgent.indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('MAC') >= 0,
  vim: new Vim(),
  interactions: new docsInteraction(),
  VimBuffer: new VimBuffer(),
  CommandQueue: new CommandQueue(),
  motion: new Motion(),
  register: Register.Instance,
  statusline: Statusline.Instance,
} as const

VIM.statusline.update()

// VIM.register

// test()

// VIM.motion.feedkey('normal')
// VIM.motion.feedkey('d')
// VIM.motion.feedkey('i')
// VIM.motion.feedkey('w')
