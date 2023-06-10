import DocsInteractions from './docs/DocsInteractions'
import test from './test'
import CommandQueue from './vim/CommandQueue'
import Motion from './vim/Motion'
import Register from './vim/Register'
import Statusline from './vim/Statusline'
import Vim from './vim/Vim'
import VimBuffer from './vim/VimBuffer'

export const VIM = {
  isMac: navigator.userAgent.includes('MAC') || navigator.platform.toUpperCase().includes('MAC'),
  Vim: new Vim(),
  interactions: new DocsInteractions(),
  VimBuffer: new VimBuffer(),
  CommandQueue: new CommandQueue(),
  Motion: new Motion(),
  Register: Register.Instance,
  Statusline: Statusline.Instance,

  VARIABLES: {
    EXCESSIVE_REPEAT: 2000,
  } as const,
} as const

VIM.Statusline.update()

const START_DELAY = 0

setTimeout(() => {
  // test(['home', 'jump', 'color', 'style'])
  // test(['copy'])
}, START_DELAY)

// VIM.motion.feedkey('normal')
// VIM.motion.feedkey('d')
// VIM.motion.feedkey('i')
// VIM.motion.feedkey('w')
