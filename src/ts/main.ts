import DocsInteractions from './docs/DocsInteractions'
import CommandQueue from './vim/CommandQueue'
import Motion from './vim/Motion'
import Register from './vim/Register'
import Statusline from './vim/Statusline'
import Vim from './vim/Vim'
import VimBuffer from './vim/VimBuffer'
import Macro from './vim/Macro'

export const VIM = {
  isMac: navigator.userAgent.includes('MAC') || navigator.platform.toUpperCase().includes('MAC'),
  Vim: new Vim(),
  interactions: new DocsInteractions(),
  VimBuffer: VimBuffer.Instance,
  Macro: Macro.Instance,
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
  // test(['home', 'jump', 'color', 'style', 'paste'])
  // docsTest(['paste'])
}, START_DELAY)

// VIM.motion.feedkey('normal')
// VIM.motion.feedkey('d')
// VIM.motion.feedkey('i')
// VIM.motion.feedkey('w')
